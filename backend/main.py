import os
import io
import pandas as pd
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from data_processor import (
    load_dataset_from_bytes,
    clean_and_prepare_data,
    analyze_dataset_structure
)
from clustering import (
    compute_elbow_and_metrics,
    perform_kmeans_clustering
)
from insights_engine import generate_cluster_insights
from report_generator import generate_html_report

# SQLite Database Persistence Layer
from database import (
    init_database,
    save_dataset,
    get_dataset_by_id,
    get_all_datasets,
    delete_dataset,
    save_full_analysis,
    get_all_analyses,
    get_analysis_details,
    update_analysis_meta,
    delete_analysis,
    save_report,
    get_report_by_analysis_id,
    get_database_stats
)

app = FastAPI(
    title="Customer Segmentation API",
    description="Machine Learning Powered Customer Segmentation System using K-Means Clustering and Persistent SQLite Storage",
    version="2.0.0"
)

# Auto-initialize database on application startup
@app.on_event("startup")
def startup_event():
    init_database()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for active session dataframe
CURRENT_STATE = {
    "df": None,
    "filename": None,
    "dataset_id": None,
    "analysis": None,
    "cluster_result": None,
    "insights": None,
    "analysis_id": None
}

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "sample_data")

@app.get("/api/health")
def health_check():
    stats = get_database_stats()
    return {
        "status": "ok",
        "service": "Customer Segmentation Engine",
        "version": "2.0.0",
        "database": stats
    }

@app.get("/api/db/stats")
def database_diagnostics():
    """Returns database size, file location, and total persistent record counts."""
    return get_database_stats()

@app.get("/api/samples")
def get_sample_datasets():
    """Returns available pre-packaged sample datasets."""
    samples = []
    if os.path.exists(SAMPLES_DIR):
        for f in os.listdir(SAMPLES_DIR):
            if f.endswith(('.csv', '.xlsx')):
                file_path = os.path.join(SAMPLES_DIR, f)
                samples.append({
                    "id": f,
                    "name": f.replace("_", " ").replace(".csv", "").replace(".xlsx", ""),
                    "filename": f,
                    "size_bytes": os.path.getsize(file_path)
                })
    return {"samples": samples}

@app.post("/api/upload")
async def upload_file(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    missing_strategy: str = Form("drop")
):
    """
    Accepts an uploaded CSV/Excel file or loads a sample dataset.
    Performs data cleaning, validation, and exploratory data analysis.
    Persists dataset metadata into the SQLite database.
    """
    try:
        if file is not None:
            filename = file.filename
            contents = await file.read()
            df = load_dataset_from_bytes(contents, filename)
        elif sample_id:
            sample_path = os.path.join(SAMPLES_DIR, sample_id)
            if not os.path.exists(sample_path):
                raise HTTPException(status_code=404, detail="Sample dataset not found.")
            filename = sample_id
            with open(sample_path, "rb") as f:
                contents = f.read()
            df = load_dataset_from_bytes(contents, filename)
        else:
            raise HTTPException(status_code=400, detail="Either a file upload or sample_id must be provided.")

        if df.empty:
            raise HTTPException(status_code=400, detail="The provided dataset is empty.")

        # Preprocessing & cleaning
        cleaned_df = clean_and_prepare_data(df, missing_strategy=missing_strategy)
        if cleaned_df.empty:
            raise HTTPException(status_code=400, detail="No rows remaining after handling missing values.")

        analysis = analyze_dataset_structure(cleaned_df)
        
        # Persist dataset record into SQLite
        dataset_id = save_dataset(
            filename=filename,
            total_rows=analysis["total_rows"],
            total_cols=analysis["total_cols"],
            columns_meta=analysis["column_meta"]
        )

        # Save to current memory state
        CURRENT_STATE["df"] = cleaned_df
        CURRENT_STATE["filename"] = filename
        CURRENT_STATE["dataset_id"] = dataset_id
        CURRENT_STATE["analysis"] = analysis
        CURRENT_STATE["cluster_result"] = None
        CURRENT_STATE["insights"] = None
        CURRENT_STATE["analysis_id"] = None

        return {
            "status": "success",
            "dataset_id": dataset_id,
            "filename": filename,
            "analysis": analysis
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ElbowRequest(BaseModel):
    features: List[str]
    scaler: str = "standard"
    max_k: int = 10

@app.post("/api/elbow")
def calculate_elbow(req: ElbowRequest):
    """
    Calculates the Elbow Curve (WCSS) and Silhouette scores for optimal K detection.
    """
    if CURRENT_STATE["df"] is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded yet. Please upload a dataset first.")

    df = CURRENT_STATE["df"]
    
    # Validate features exist
    for f in req.features:
        if f not in df.columns:
            raise HTTPException(status_code=400, detail=f"Feature '{f}' not found in dataset.")

    try:
        result = compute_elbow_and_metrics(
            df=df,
            features=req.features,
            scaler_type=req.scaler,
            max_k=req.max_k
        )
        return {"status": "success", "elbow_data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ClusterRequest(BaseModel):
    features: List[str]
    k: int
    scaler: str = "standard"
    notes: Optional[str] = ""

@app.post("/api/cluster")
def perform_clustering(req: ClusterRequest):
    """
    Applies K-Means clustering with the selected parameters and features.
    Generates cluster assignments, metrics, 2D/3D projections, and business insights.
    Automatically saves the complete analysis, clusters, and customer records in SQLite.
    """
    if CURRENT_STATE["df"] is None:
        raise HTTPException(status_code=400, detail="No dataset loaded. Please upload a dataset first.")

    df = CURRENT_STATE["df"]
    
    if req.k < 2 or req.k > 15:
        raise HTTPException(status_code=400, detail="Cluster count K must be between 2 and 15.")

    if len(req.features) < 1:
        raise HTTPException(status_code=400, detail="Please select at least 2 numerical features for meaningful clustering.")

    try:
        clustering_result = perform_kmeans_clustering(
            df=df,
            features=req.features,
            k=req.k,
            scaler_type=req.scaler
        )
        
        # Generate Business Insights
        insights = generate_cluster_insights(
            cluster_profiles=clustering_result["cluster_profiles"],
            global_means=clustering_result["global_means"]
        )
        
        # Save to SQLite Database
        dataset_id = CURRENT_STATE.get("dataset_id")
        if dataset_id is None:
            dataset_id = save_dataset(
                filename=CURRENT_STATE.get("filename", "Dataset.csv"),
                total_rows=len(df),
                total_cols=len(df.columns),
                columns_meta={col: {"type": "numerical"} for col in req.features}
            )
            CURRENT_STATE["dataset_id"] = dataset_id

        analysis_name = f"{CURRENT_STATE.get('filename', 'Dataset')} ({req.k} Segments)"
        
        saved_analysis_id = save_full_analysis(
            dataset_id=dataset_id,
            analysis_name=analysis_name,
            k_value=req.k,
            features=req.features,
            scaler_type=req.scaler,
            metrics={
                "silhouette_score": clustering_result["silhouette_score"],
                "davies_bouldin_score": clustering_result["davies_bouldin_score"],
                "calinski_harabasz_score": clustering_result["calinski_harabasz_score"]
            },
            cluster_profiles=clustering_result["cluster_profiles"],
            insights=insights,
            global_means=clustering_result["global_means"],
            clustered_data=clustering_result["clustered_data"],
            coords_2d=clustering_result["plot_coords_2d"],
            coords_3d=clustering_result["plot_coords_3d"],
            pca_variance=clustering_result["pca_explained_var"],
            notes=req.notes or ""
        )

        # Automatically generate and persist executive report in SQLite
        report_html = generate_html_report(
            dataset_summary={
                "total_rows": len(clustering_result["clustered_data"]),
                "filename": CURRENT_STATE.get("filename", "Dataset")
            },
            clustering_params={
                "k": req.k,
                "features": req.features,
                "scaler": req.scaler
            },
            cluster_profiles=clustering_result["cluster_profiles"],
            insights=insights,
            metrics={
                "silhouette_score": clustering_result["silhouette_score"],
                "davies_bouldin_score": clustering_result["davies_bouldin_score"],
                "calinski_harabasz_score": clustering_result["calinski_harabasz_score"]
            }
        )
        save_report(
            analysis_id=saved_analysis_id,
            title=f"Report - {analysis_name}",
            report_html=report_html
        )

        # Store in session state
        CURRENT_STATE["cluster_result"] = clustering_result
        CURRENT_STATE["insights"] = insights
        CURRENT_STATE["analysis_id"] = saved_analysis_id
        
        return {
            "status": "success",
            "analysis_id": saved_analysis_id,
            "k": req.k,
            "features": req.features,
            "scaler": req.scaler,
            "silhouette_score": clustering_result["silhouette_score"],
            "davies_bouldin_score": clustering_result["davies_bouldin_score"],
            "calinski_harabasz_score": clustering_result["calinski_harabasz_score"],
            "cluster_profiles": clustering_result["cluster_profiles"],
            "global_means": clustering_result["global_means"],
            "plot_coords_2d": clustering_result["plot_coords_2d"],
            "centroids_2d": clustering_result["centroids_2d"],
            "plot_coords_3d": clustering_result["plot_coords_3d"],
            "centroids_3d": clustering_result["centroids_3d"],
            "pca_explained_var": clustering_result["pca_explained_var"],
            "insights": insights,
            "clustered_data_sample": clustering_result["clustered_data"][:250],
            "total_clustered_count": len(clustering_result["clustered_data"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ANALYSIS HISTORY & DATABASE RETRIEVAL ENDPOINTS
# ============================================================================

@app.get("/api/history")
def list_analysis_history():
    """Lists all historical segmentation analyses saved in the SQLite database."""
    analyses = get_all_analyses()
    return {"status": "success", "count": len(analyses), "history": analyses}

@app.get("/api/history/{analysis_id}")
def load_historical_analysis(analysis_id: int):
    """
    Retrieves a past analysis from the SQLite database and loads it into active session memory,
    allowing the frontend to view, explore, and report on any saved run.
    """
    details = get_analysis_details(analysis_id)
    if not details:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    # Convert customer records back into dataframe and load into active state
    if details["clustered_data"]:
        df_reloaded = pd.DataFrame(details["clustered_data"])
        CURRENT_STATE["df"] = df_reloaded
        CURRENT_STATE["filename"] = details["dataset_filename"]
        CURRENT_STATE["dataset_id"] = details["dataset_id"]
        CURRENT_STATE["analysis_id"] = details["analysis_id"]
        CURRENT_STATE["cluster_result"] = details
        CURRENT_STATE["insights"] = details["insights"]

    return {
        "status": "success",
        "analysis_id": details["analysis_id"],
        "k": details["k"],
        "features": details["features"],
        "scaler": details["scaler"],
        "silhouette_score": details["silhouette_score"],
        "davies_bouldin_score": details["davies_bouldin_score"],
        "calinski_harabasz_score": details["calinski_harabasz_score"],
        "cluster_profiles": details["cluster_profiles"],
        "global_means": details["global_means"],
        "plot_coords_2d": details["plot_coords_2d"],
        "centroids_2d": details["centroids_2d"],
        "plot_coords_3d": details["plot_coords_3d"],
        "pca_explained_var": details["pca_explained_var"],
        "insights": details["insights"],
        "clustered_data_sample": details["clustered_data"][:250],
        "total_clustered_count": len(details["clustered_data"]),
        "created_at": details["created_at"],
        "notes": details["notes"]
    }

class UpdateAnalysisRequest(BaseModel):
    analysis_name: Optional[str] = None
    notes: Optional[str] = None

@app.patch("/api/history/{analysis_id}")
def update_analysis(analysis_id: int, req: UpdateAnalysisRequest):
    """Updates the custom title or notes for a saved analysis."""
    success = update_analysis_meta(analysis_id, req.analysis_name, req.notes)
    if not success:
        raise HTTPException(status_code=404, detail="Analysis not found or no changes made.")
    return {"status": "success", "message": "Analysis updated successfully."}

@app.delete("/api/history/{analysis_id}")
def delete_historical_analysis(analysis_id: int):
    """Deletes an analysis and all associated records from SQLite."""
    success = delete_analysis(analysis_id)
    if not success:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return {"status": "success", "message": f"Analysis {analysis_id} deleted."}

@app.get("/api/history/{analysis_id}/export")
def export_historical_csv(analysis_id: int):
    """Exports clustered customers from a specific historical analysis as CSV."""
    details = get_analysis_details(analysis_id)
    if not details or not details["clustered_data"]:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    df_out = pd.DataFrame(details["clustered_data"])
    stream = io.StringIO()
    df_out.to_csv(stream, index=False)

    return Response(
        content=stream.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=saved_analysis_{analysis_id}_customers.csv"}
    )

@app.get("/api/history/{analysis_id}/report")
def view_historical_report(analysis_id: int):
    """Retrieves and displays the saved HTML report for a specific past analysis."""
    report = get_report_by_analysis_id(analysis_id)
    if not report:
        raise HTTPException(status_code=404, detail="Saved report not found for this analysis.")
    return HTMLResponse(content=report["report_html"])

# ============================================================================
# REPORT & EXPORT ENDPOINTS FOR ACTIVE SESSION
# ============================================================================

@app.get("/api/report/html")
def get_html_report_view():
    """Generates and serves a formatted printable HTML report for the active session."""
    if CURRENT_STATE["cluster_result"] is None or CURRENT_STATE["insights"] is None:
        raise HTTPException(status_code=400, detail="Please perform clustering first before generating a report.")

    cr = CURRENT_STATE["cluster_result"]
    insights = CURRENT_STATE["insights"]
    analysis = CURRENT_STATE["analysis"] or {}

    dataset_summary = {
        "total_rows": analysis.get("total_rows", len(cr["clustered_data"])),
        "filename": CURRENT_STATE.get("filename", "Dataset")
    }
    
    clustering_params = {
        "k": cr["k"],
        "features": cr["features"],
        "scaler": cr["scaler"]
    }
    
    metrics = {
        "silhouette_score": cr["silhouette_score"],
        "davies_bouldin_score": cr["davies_bouldin_score"],
        "calinski_harabasz_score": cr["calinski_harabasz_score"]
    }

    html = generate_html_report(
        dataset_summary=dataset_summary,
        clustering_params=clustering_params,
        cluster_profiles=cr["cluster_profiles"],
        insights=insights,
        metrics=metrics
    )
    return HTMLResponse(content=html)

@app.get("/api/export/csv")
def export_clustered_csv():
    """Exports all customer records with their assigned cluster labels as CSV."""
    if CURRENT_STATE["cluster_result"] is None:
        raise HTTPException(status_code=400, detail="No clustered data available to export.")

    records = CURRENT_STATE["cluster_result"]["clustered_data"]
    df_out = pd.DataFrame(records)
    
    stream = io.StringIO()
    df_out.to_csv(stream, index=False)
    
    return Response(
        content=stream.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=clustered_customers_{CURRENT_STATE['cluster_result']['k']}_segments.csv"}
    )

# Mount compiled React frontend for unified full-stack hosting
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
