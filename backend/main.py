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

app = FastAPI(
    title="Customer Segmentation API",
    description="Machine Learning Powered Customer Segmentation System using K-Means Clustering",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for active session dataframe (can be expanded to session tokens)
CURRENT_STATE = {
    "df": None,
    "filename": None,
    "analysis": None,
    "cluster_result": None,
    "insights": None
}

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "sample_data")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Customer Segmentation Engine", "version": "1.0.0"}

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
        
        # Save to current memory state
        CURRENT_STATE["df"] = cleaned_df
        CURRENT_STATE["filename"] = filename
        CURRENT_STATE["analysis"] = analysis
        CURRENT_STATE["cluster_result"] = None
        CURRENT_STATE["insights"] = None

        return {
            "status": "success",
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

@app.post("/api/cluster")
def perform_clustering(req: ClusterRequest):
    """
    Applies K-Means clustering with the selected parameters and features.
    Generates cluster assignments, metrics, 2D/3D projections, and business insights.
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
        
        # Store in state
        CURRENT_STATE["cluster_result"] = clustering_result
        CURRENT_STATE["insights"] = insights
        
        return {
            "status": "success",
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

@app.get("/api/report/html")
def get_html_report_view():
    """Generates and serves a formatted printable HTML report."""
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
