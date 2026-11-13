import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from sklearn.decomposition import PCA

def find_elbow_point(k_values: List[int], wcss_values: List[float]) -> int:
    """
    Computes the optimal elbow point using the maximum perpendicular distance 
    from the line connecting the first and last points of the WCSS curve.
    """
    if len(k_values) < 3:
        return k_values[0] if k_values else 3
        
    p1 = np.array([k_values[0], wcss_values[0]])
    p2 = np.array([k_values[-1], wcss_values[-1]])
    
    # Line vector from p1 to p2
    line_vec = p2 - p1
    line_len = np.linalg.norm(line_vec)
    if line_len == 0:
        return k_values[min(2, len(k_values) - 1)]
    unit_line = line_vec / line_len
    
    distances = []
    for k, wcss in zip(k_values, wcss_values):
        p = np.array([k, wcss])
        # Vector from p1 to current point
        p_vec = p - p1
        # Projection of p_vec onto unit_line
        proj = np.dot(p_vec, unit_line)
        # Perpendicular distance vector
        perp_vec = p_vec - proj * unit_line
        distances.append(np.linalg.norm(perp_vec))
        
    # The elbow point corresponds to the index of maximum perpendicular distance
    optimal_idx = int(np.argmax(distances))
    return k_values[optimal_idx]

def compute_elbow_and_metrics(
    df: pd.DataFrame, 
    features: List[str], 
    scaler_type: str = "standard", 
    max_k: int = 10
) -> Dict[str, Any]:
    """Calculates WCSS (Elbow curve) and Silhouette scores for K from 1 to max_k."""
    X = df[features].dropna().values
    n_samples = len(X)
    
    if n_samples < 4:
        raise ValueError("Insufficient data points for clustering (at least 4 required).")
        
    actual_max_k = min(max_k, n_samples - 1, 10)
    
    # Scale features
    if scaler_type == "standard":
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
    elif scaler_type == "minmax":
        scaler = MinMaxScaler()
        X_scaled = scaler.fit_transform(X)
    else:
        X_scaled = X
        
    k_range = list(range(1, actual_max_k + 1))
    wcss_list = []
    silhouette_list = []
    
    for k in k_range:
        kmeans = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=42)
        kmeans.fit(X_scaled)
        wcss_list.append(round(float(kmeans.inertia_), 2))
        
        if k > 1:
            sil = silhouette_score(X_scaled, kmeans.labels_)
            silhouette_list.append(round(float(sil), 4))
        else:
            silhouette_list.append(None)
            
    optimal_k = find_elbow_point(k_range, wcss_list)
    
    # Also find best silhouette score
    valid_sil = [(k, s) for k, s in zip(k_range[1:], silhouette_list[1:]) if s is not None]
    best_sil_k = max(valid_sil, key=lambda item: item[1])[0] if valid_sil else optimal_k
    
    return {
        "k_values": k_range,
        "wcss": wcss_list,
        "silhouette_scores": silhouette_list,
        "recommended_k": optimal_k,
        "best_silhouette_k": best_sil_k
    }

def perform_kmeans_clustering(
    df: pd.DataFrame,
    features: List[str],
    k: int,
    scaler_type: str = "standard"
) -> Dict[str, Any]:
    """
    Fits K-Means algorithm, assigns clusters to rows, calculates evaluation metrics,
    computes centroids in both raw and scaled space, and handles 2D/3D projections.
    """
    # Create working copy of dataframe
    work_df = df.copy().dropna(subset=features)
    X = work_df[features].values
    
    # Scaling
    if scaler_type == "standard":
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
    elif scaler_type == "minmax":
        scaler = MinMaxScaler()
        X_scaled = scaler.fit_transform(X)
    else:
        scaler = None
        X_scaled = X
        
    kmeans = KMeans(n_clusters=k, init='k-means++', n_init=15, random_state=42)
    labels = kmeans.fit_predict(X_scaled)
    
    # Centroids
    scaled_centroids = kmeans.cluster_centers_
    if scaler is not None:
        raw_centroids = scaler.inverse_transform(scaled_centroids)
    else:
        raw_centroids = scaled_centroids
        
    # Metrics
    sil_score = round(float(silhouette_score(X_scaled, labels)), 4) if k > 1 else 0.0
    db_score = round(float(davies_bouldin_score(X_scaled, labels)), 4) if k > 1 else 0.0
    ch_score = round(float(calinski_harabasz_score(X_scaled, labels)), 2) if k > 1 else 0.0
    
    # Assign labels to dataframe
    work_df['Cluster'] = [int(lbl) for lbl in labels]
    
    # Compute 2D coordinates for visual plotting (using PCA if > 2 features, or direct if 2 features)
    if len(features) == 2:
        x_col, y_col = features[0], features[1]
        plot_coords_2d = [
            {"x": float(row[x_col]), "y": float(row[y_col]), "cluster": int(row['Cluster'])}
            for _, row in work_df.iterrows()
        ]
        centroids_2d = [
            {"x": float(raw_centroids[i][0]), "y": float(raw_centroids[i][1]), "cluster": i}
            for i in range(k)
        ]
        pca_explained_var = None
    else:
        pca = PCA(n_components=2, random_state=42)
        X_pca = pca.fit_transform(X_scaled)
        centroids_pca = pca.transform(scaled_centroids)
        plot_coords_2d = [
            {"x": round(float(X_pca[i, 0]), 3), "y": round(float(X_pca[i, 1]), 3), "cluster": int(labels[i])}
            for i in range(len(labels))
        ]
        centroids_2d = [
            {"x": round(float(centroids_pca[i, 0]), 3), "y": round(float(centroids_pca[i, 1]), 3), "cluster": i}
            for i in range(k)
        ]
        pca_explained_var = [round(float(v), 3) for v in pca.explained_variance_ratio_]

    # Compute 3D coordinates if at least 3 features
    plot_coords_3d = None
    centroids_3d = None
    if len(features) >= 3:
        if len(features) == 3:
            plot_coords_3d = [
                {
                    "x": float(work_df.iloc[i][features[0]]),
                    "y": float(work_df.iloc[i][features[1]]),
                    "z": float(work_df.iloc[i][features[2]]),
                    "cluster": int(labels[i])
                }
                for i in range(len(labels))
            ]
            centroids_3d = [
                {
                    "x": float(raw_centroids[i][0]),
                    "y": float(raw_centroids[i][1]),
                    "z": float(raw_centroids[i][2]),
                    "cluster": i
                }
                for i in range(k)
            ]
        else:
            pca3 = PCA(n_components=3, random_state=42)
            X_pca3 = pca3.fit_transform(X_scaled)
            cent3 = pca3.transform(scaled_centroids)
            plot_coords_3d = [
                {
                    "x": round(float(X_pca3[i, 0]), 3),
                    "y": round(float(X_pca3[i, 1]), 3),
                    "z": round(float(X_pca3[i, 2]), 3),
                    "cluster": int(labels[i])
                }
                for i in range(len(labels))
            ]
            centroids_3d = [
                {
                    "x": round(float(cent3[i, 0]), 3),
                    "y": round(float(cent3[i, 1]), 3),
                    "z": round(float(cent3[i, 2]), 3),
                    "cluster": i
                }
                for i in range(k)
            ]

    # Cluster profiles & feature summaries
    total_customers = len(work_df)
    cluster_profiles = []
    
    for cid in range(k):
        c_sub = work_df[work_df['Cluster'] == cid]
        c_count = len(c_sub)
        c_pct = round((c_count / total_customers) * 100, 2) if total_customers > 0 else 0
        
        feature_means = {}
        feature_stats = {}
        for fi, feat in enumerate(features):
            f_mean = float(raw_centroids[cid][fi])
            feature_means[feat] = round(f_mean, 2)
            feature_stats[feat] = {
                "mean": round(float(c_sub[feat].mean()), 2),
                "median": round(float(c_sub[feat].median()), 2),
                "std": round(float(c_sub[feat].std()), 2) if c_count > 1 else 0.0,
                "min": round(float(c_sub[feat].min()), 2),
                "max": round(float(c_sub[feat].max()), 2)
            }
            
        cluster_profiles.append({
            "cluster_id": cid,
            "count": c_count,
            "percentage": c_pct,
            "feature_means": feature_means,
            "feature_stats": feature_stats
        })
        
    # Global feature means for relative comparison
    global_means = {feat: round(float(work_df[feat].mean()), 2) for feat in features}
    
    # Prepare customer table preview with assigned cluster
    table_records = work_df.replace({np.nan: None}).to_dict(orient='records')
    
    return {
        "k": k,
        "features": features,
        "scaler": scaler_type,
        "silhouette_score": sil_score,
        "davies_bouldin_score": db_score,
        "calinski_harabasz_score": ch_score,
        "cluster_profiles": cluster_profiles,
        "global_means": global_means,
        "plot_coords_2d": plot_coords_2d,
        "centroids_2d": centroids_2d,
        "plot_coords_3d": plot_coords_3d,
        "centroids_3d": centroids_3d,
        "pca_explained_var": pca_explained_var,
        "clustered_data": table_records
    }
