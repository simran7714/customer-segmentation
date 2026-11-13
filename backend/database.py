"""
Database Access Layer (DAL) for Customer Segmentation System
Provides SQLite CRUD operations for Datasets, Analysis History, Clusters, and Reports.
"""

import os
import json
import sqlite3
from typing import Dict, Any, List, Optional, Tuple
from contextlib import contextmanager

from init_db import get_db_path, init_database

@contextmanager
def get_db(db_path: str = None):
    """Context manager providing a managed SQLite connection with foreign keys and dict rows."""
    target_path = db_path or get_db_path()
    
    # Auto-initialize if database file does not exist
    if not os.path.exists(target_path):
        init_database(target_path)
        
    conn = sqlite3.connect(target_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

# ============================================================================
# DATASET OPERATIONS
# ============================================================================

def save_dataset(
    filename: str,
    total_rows: int,
    total_cols: int,
    columns_meta: Dict[str, Any],
    file_hash: Optional[str] = None
) -> int:
    """Inserts a new dataset metadata record and returns its ID."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO datasets (filename, file_hash, total_rows, total_cols, columns_json)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                filename,
                file_hash,
                total_rows,
                total_cols,
                json.dumps(columns_meta)
            )
        )
        return cursor.lastrowid

def get_all_datasets() -> List[Dict[str, Any]]:
    """Retrieves all stored datasets along with their analysis counts."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT d.id, d.filename, d.total_rows, d.total_cols, d.created_at, d.updated_at,
                   COUNT(a.id) as analysis_count
            FROM datasets d
            LEFT JOIN analyses a ON d.id = a.dataset_id
            GROUP BY d.id
            ORDER BY d.created_at DESC
            """
        )
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def get_dataset_by_id(dataset_id: int) -> Optional[Dict[str, Any]]:
    """Retrieves a single dataset record including its column metadata."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM datasets WHERE id = ?", (dataset_id,))
        row = cursor.fetchone()
        if not row:
            return None
        res = dict(row)
        res["columns_json"] = json.loads(res["columns_json"]) if res.get("columns_json") else {}
        return res

def delete_dataset(dataset_id: int) -> bool:
    """Deletes a dataset and cascades removal of related analyses, clusters, and records."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM datasets WHERE id = ?", (dataset_id,))
        return cursor.rowcount > 0

# ============================================================================
# ANALYSIS & SEGMENTATION OPERATIONS
# ============================================================================

def save_full_analysis(
    dataset_id: int,
    analysis_name: str,
    k_value: int,
    features: List[str],
    scaler_type: str,
    metrics: Dict[str, Any],
    cluster_profiles: List[Dict[str, Any]],
    insights: List[Dict[str, Any]],
    global_means: Dict[str, float],
    clustered_data: List[Dict[str, Any]],
    coords_2d: Optional[List[Dict[str, Any]]] = None,
    coords_3d: Optional[List[Dict[str, Any]]] = None,
    wcss_data: Optional[List[float]] = None,
    pca_variance: Optional[List[float]] = None,
    notes: str = ""
) -> int:
    """
    Saves a complete segmentation run (Analysis, Clusters, and Customer Records)
    in a single atomic database transaction.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Insert Analysis Header
        cursor.execute(
            """
            INSERT INTO analyses (
                dataset_id, analysis_name, k_value, features_json, scaler_type,
                silhouette_score, davies_bouldin_score, calinski_harabasz_score,
                wcss_json, pca_variance_json, global_means_json, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                dataset_id,
                analysis_name,
                k_value,
                json.dumps(features),
                scaler_type,
                metrics.get("silhouette_score"),
                metrics.get("davies_bouldin_score"),
                metrics.get("calinski_harabasz_score"),
                json.dumps(wcss_data) if wcss_data else None,
                json.dumps(pca_variance) if pca_variance else None,
                json.dumps(global_means),
                notes
            )
        )
        analysis_id = cursor.lastrowid

        # 2. Insert Clusters & Personas
        # Map profiles and insights by cluster_id
        insights_map = {ins["cluster_id"]: ins for ins in insights}
        
        for profile in cluster_profiles:
            cid = profile["cluster_id"]
            ins = insights_map.get(cid, {})
            
            cursor.execute(
                """
                INSERT INTO clusters (
                    analysis_id, cluster_id, persona_name, tagline, badge_color,
                    customer_count, customer_percentage, characteristics,
                    demographic_note, opportunities, strategies_json, channels_json,
                    retention_risk, business_value, feature_means_json, feature_stats_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    analysis_id,
                    cid,
                    ins.get("persona_name", f"Cluster {cid}"),
                    ins.get("tagline", ""),
                    ins.get("badge_color", "indigo"),
                    profile["count"],
                    profile["percentage"],
                    ins.get("characteristics", ""),
                    ins.get("demographic_note", ""),
                    ins.get("opportunities", ""),
                    json.dumps(ins.get("strategies", [])),
                    json.dumps(ins.get("channels", [])),
                    ins.get("retention_risk", "Medium"),
                    ins.get("business_value", "Standard Segment"),
                    json.dumps(profile.get("feature_means", {})),
                    json.dumps(profile.get("feature_stats", {}))
                )
            )

        # 3. Insert Customer Records
        # Prepare coordinates lookup
        c2d_map = {idx: pt for idx, pt in enumerate(coords_2d)} if coords_2d else {}
        c3d_map = {idx: pt for idx, pt in enumerate(coords_3d)} if coords_3d else {}

        customer_rows_to_insert = []
        for idx, row in enumerate(clustered_data):
            cid = row.get("Cluster", 0)
            
            # Detect identifier
            cust_id = row.get("CustomerID") or row.get("Customer_ID") or row.get("id") or str(idx + 1)
            
            pt2d = c2d_map.get(idx, {})
            pt3d = c3d_map.get(idx, {})
            
            customer_rows_to_insert.append((
                analysis_id,
                str(cust_id),
                int(cid),
                json.dumps(row),
                pt2d.get("x") if pt2d else None,
                pt2d.get("y") if pt2d else None,
                pt3d.get("z") if pt3d else None
            ))

        cursor.executemany(
            """
            INSERT INTO customer_records (
                analysis_id, customer_identifier, cluster_id,
                features_data_json, coord_x, coord_y, coord_z
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            customer_rows_to_insert
        )

        return analysis_id

def get_all_analyses(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Returns list of all saved analysis runs with dataset details and cluster count.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT a.id, a.dataset_id, a.analysis_name, a.k_value, a.scaler_type,
                   a.silhouette_score, a.davies_bouldin_score, a.calinski_harabasz_score,
                   a.features_json, a.notes, a.created_at,
                   d.filename as dataset_filename, d.total_rows as dataset_rows,
                   (SELECT COUNT(*) FROM customer_records cr WHERE cr.analysis_id = a.id) as recorded_customers
            FROM analyses a
            JOIN datasets d ON a.dataset_id = d.id
            ORDER BY a.created_at DESC
            LIMIT ?
            """,
            (limit,)
        )
        rows = cursor.fetchall()
        result = []
        for r in rows:
            item = dict(r)
            item["features"] = json.loads(item["features_json"]) if item.get("features_json") else []
            del item["features_json"]
            
            # Fetch persona names for quick display
            cursor.execute("SELECT cluster_id, persona_name, customer_count, customer_percentage FROM clusters WHERE analysis_id = ? ORDER BY cluster_id", (item["id"],))
            item["clusters_summary"] = [dict(crow) for crow in cursor.fetchall()]
            result.append(item)
            
        return result

def get_analysis_details(analysis_id: int) -> Optional[Dict[str, Any]]:
    """
    Retrieves the complete state of a past analysis run, reconstructing
    cluster profiles, insights, 2D coordinates, 3D coordinates, and customer records.
    """
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Fetch Analysis
        cursor.execute(
            """
            SELECT a.*, d.filename as dataset_filename, d.total_rows as dataset_rows, d.columns_json
            FROM analyses a
            JOIN datasets d ON a.dataset_id = d.id
            WHERE a.id = ?
            """,
            (analysis_id,)
        )
        analysis_row = cursor.fetchone()
        if not analysis_row:
            return None
            
        analysis = dict(analysis_row)
        features = json.loads(analysis["features_json"])
        global_means = json.loads(analysis["global_means_json"]) if analysis.get("global_means_json") else {}
        pca_var = json.loads(analysis["pca_variance_json"]) if analysis.get("pca_variance_json") else None

        # 2. Fetch Clusters
        cursor.execute("SELECT * FROM clusters WHERE analysis_id = ? ORDER BY cluster_id", (analysis_id,))
        cluster_rows = cursor.fetchall()
        
        cluster_profiles = []
        insights = []
        
        for crow in cluster_rows:
            c = dict(crow)
            feature_means = json.loads(c["feature_means_json"]) if c.get("feature_means_json") else {}
            feature_stats = json.loads(c["feature_stats_json"]) if c.get("feature_stats_json") else {}
            
            cluster_profiles.append({
                "cluster_id": c["cluster_id"],
                "count": c["customer_count"],
                "percentage": c["customer_percentage"],
                "feature_means": feature_means,
                "feature_stats": feature_stats
            })
            
            insights.append({
                "cluster_id": c["cluster_id"],
                "persona_name": c["persona_name"],
                "tagline": c["tagline"],
                "badge_color": c["badge_color"],
                "count": c["customer_count"],
                "percentage": c["customer_percentage"],
                "characteristics": c["characteristics"],
                "demographic_note": c["demographic_note"],
                "opportunities": c["opportunities"],
                "strategies": json.loads(c["strategies_json"]) if c.get("strategies_json") else [],
                "channels": json.loads(c["channels_json"]) if c.get("channels_json") else [],
                "retention_risk": c["retention_risk"],
                "business_value": c["business_value"],
                "feature_means": feature_means
            })

        # 3. Fetch Customer Records
        cursor.execute("SELECT * FROM customer_records WHERE analysis_id = ? ORDER BY id", (analysis_id,))
        records_rows = cursor.fetchall()
        
        clustered_data = []
        plot_coords_2d = []
        plot_coords_3d = []
        
        has_3d = False
        for rrow in records_rows:
            r = dict(rrow)
            data_dict = json.loads(r["features_data_json"])
            clustered_data.append(data_dict)
            
            if r.get("coord_x") is not None and r.get("coord_y") is not None:
                plot_coords_2d.append({
                    "x": r["coord_x"],
                    "y": r["coord_y"],
                    "cluster": r["cluster_id"]
                })
                
            if r.get("coord_z") is not None:
                has_3d = True
                plot_coords_3d.append({
                    "x": r["coord_x"],
                    "y": r["coord_y"],
                    "z": r["coord_z"],
                    "cluster": r["cluster_id"]
                })

        # Calculate centroids for 2D / 3D
        centroids_2d = []
        for p in cluster_profiles:
            cid = p["cluster_id"]
            if len(features) == 2:
                centroids_2d.append({
                    "x": p["feature_means"].get(features[0], 0),
                    "y": p["feature_means"].get(features[1], 0),
                    "cluster": cid
                })
            else:
                pts = [pt for pt in plot_coords_2d if pt["cluster"] == cid]
                if pts:
                    avg_x = sum(pt["x"] for pt in pts) / len(pts)
                    avg_y = sum(pt["y"] for pt in pts) / len(pts)
                    centroids_2d.append({"x": round(avg_x, 3), "y": round(avg_y, 3), "cluster": cid})

        return {
            "analysis_id": analysis["id"],
            "dataset_id": analysis["dataset_id"],
            "analysis_name": analysis["analysis_name"],
            "k": analysis["k_value"],
            "features": features,
            "scaler": analysis["scaler_type"],
            "silhouette_score": analysis["silhouette_score"],
            "davies_bouldin_score": analysis["davies_bouldin_score"],
            "calinski_harabasz_score": analysis["calinski_harabasz_score"],
            "cluster_profiles": cluster_profiles,
            "global_means": global_means,
            "insights": insights,
            "plot_coords_2d": plot_coords_2d,
            "centroids_2d": centroids_2d,
            "plot_coords_3d": plot_coords_3d if has_3d else None,
            "pca_explained_var": pca_var,
            "clustered_data": clustered_data,
            "created_at": analysis["created_at"],
            "dataset_filename": analysis["dataset_filename"],
            "notes": analysis["notes"]
        }

def update_analysis_meta(analysis_id: int, analysis_name: Optional[str] = None, notes: Optional[str] = None) -> bool:
    """Updates the user-facing name or notes of a saved analysis."""
    with get_db() as conn:
        cursor = conn.cursor()
        updates = []
        params = []
        if analysis_name is not None:
            updates.append("analysis_name = ?")
            params.append(analysis_name)
        if notes is not None:
            updates.append("notes = ?")
            params.append(notes)
            
        if not updates:
            return False
            
        params.append(analysis_id)
        sql = f"UPDATE analyses SET {', '.join(updates)} WHERE id = ?"
        cursor.execute(sql, tuple(params))
        return cursor.rowcount > 0

def delete_analysis(analysis_id: int) -> bool:
    """Deletes an analysis record and cascades deletion of its clusters and customer records."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM analyses WHERE id = ?", (analysis_id,))
        return cursor.rowcount > 0

# ============================================================================
# SAVED REPORTS OPERATIONS
# ============================================================================

def save_report(analysis_id: int, title: str, report_html: str) -> int:
    """Saves a generated HTML executive report to the database."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO saved_reports (analysis_id, title, report_html) VALUES (?, ?, ?)",
            (analysis_id, title, report_html)
        )
        return cursor.lastrowid

def get_report_by_analysis_id(analysis_id: int) -> Optional[Dict[str, Any]]:
    """Retrieves the saved report HTML for a given analysis."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM saved_reports WHERE analysis_id = ? ORDER BY created_at DESC LIMIT 1",
            (analysis_id,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None

# ============================================================================
# DATABASE DIAGNOSTICS & PERSISTENCE STATS
# ============================================================================

def get_database_stats() -> Dict[str, Any]:
    """Returns database size, path, and record counts for health monitoring."""
    target_path = get_db_path()
    file_size_bytes = os.path.getsize(target_path) if os.path.exists(target_path) else 0
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM datasets")
        datasets_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM analyses")
        analyses_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM clusters")
        clusters_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM customer_records")
        records_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM saved_reports")
        reports_count = cursor.fetchone()[0]

    return {
        "status": "online",
        "engine": "SQLite 3",
        "persistent_path": target_path,
        "file_size_bytes": file_size_bytes,
        "file_size_formatted": f"{file_size_bytes / 1024:.2f} KB" if file_size_bytes < 1048576 else f"{file_size_bytes / 1048576:.2f} MB",
        "total_datasets": datasets_count,
        "total_analyses": analyses_count,
        "total_clusters": clusters_count,
        "total_customer_records": records_count,
        "total_saved_reports": reports_count
    }
