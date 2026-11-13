import io
import math
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional

def load_dataset_from_bytes(file_bytes: bytes, filename: str) -> pd.DataFrame:
    """Reads a CSV or Excel file from raw bytes into a pandas DataFrame."""
    lower_name = filename.lower()
    if lower_name.endswith('.csv'):
        # Try UTF-8 first, fallback to latin-1
        try:
            df = pd.read_csv(io.BytesIO(file_bytes), encoding='utf-8')
        except UnicodeDecodeError:
            df = pd.read_csv(io.BytesIO(file_bytes), encoding='latin-1')
    elif lower_name.endswith(('.xlsx', '.xls')):
        df = pd.read_excel(io.BytesIO(file_bytes))
    else:
        raise ValueError("Unsupported file format. Please upload a .csv or .xlsx/.xls file.")
    return df

def clean_and_prepare_data(df: pd.DataFrame, missing_strategy: str = "drop") -> pd.DataFrame:
    """Handles missing values and drops complete duplicate rows."""
    cleaned = df.copy()
    
    # Remove duplicate rows
    cleaned = cleaned.drop_duplicates()
    
    if missing_strategy == "drop":
        cleaned = cleaned.dropna()
    elif missing_strategy == "mean":
        for col in cleaned.select_dtypes(include=[np.number]).columns:
            cleaned[col] = cleaned[col].fillna(cleaned[col].mean())
        for col in cleaned.select_dtypes(exclude=[np.number]).columns:
            mode_val = cleaned[col].mode()
            if not mode_val.empty:
                cleaned[col] = cleaned[col].fillna(mode_val[0])
    elif missing_strategy == "median":
        for col in cleaned.select_dtypes(include=[np.number]).columns:
            cleaned[col] = cleaned[col].fillna(cleaned[col].median())
        for col in cleaned.select_dtypes(exclude=[np.number]).columns:
            mode_val = cleaned[col].mode()
            if not mode_val.empty:
                cleaned[col] = cleaned[col].fillna(mode_val[0])
                
    return cleaned

def analyze_dataset_structure(df: pd.DataFrame) -> Dict[str, Any]:
    """Extracts comprehensive metadata, column types, statistics, and EDA distributions."""
    total_rows, total_cols = df.shape
    columns = list(df.columns)
    
    column_meta = {}
    numerical_cols = []
    categorical_cols = []
    
    for col in columns:
        col_type = "numerical" if pd.api.types.is_numeric_dtype(df[col]) else "categorical"
        missing_count = int(df[col].isna().sum())
        unique_count = int(df[col].nunique())
        
        # Check if potential ID column
        is_id = False
        lower_col = str(col).lower()
        if any(term in lower_col for term in ['id', 'cust_id', 'customerid', 'user_id', 'index']) and unique_count > (total_rows * 0.8):
            is_id = True
            
        if col_type == "numerical" and not is_id:
            numerical_cols.append(col)
        elif not is_id:
            categorical_cols.append(col)
            
        column_meta[col] = {
            "type": col_type,
            "is_id": is_id,
            "missing_count": missing_count,
            "missing_pct": round((missing_count / total_rows) * 100, 2) if total_rows > 0 else 0,
            "unique_count": unique_count
        }
        
    # Numerical Statistics
    num_stats = {}
    for col in numerical_cols:
        series = df[col].dropna()
        if len(series) > 0:
            num_stats[col] = {
                "mean": round(float(series.mean()), 2),
                "std": round(float(series.std()), 2) if len(series) > 1 else 0.0,
                "min": round(float(series.min()), 2),
                "q25": round(float(series.quantile(0.25)), 2),
                "median": round(float(series.median()), 2),
                "q75": round(float(series.quantile(0.75)), 2),
                "max": round(float(series.max()), 2),
                "skewness": round(float(series.skew()), 2) if len(series) > 2 else 0.0
            }
            
    # Categorical Distributions (Top 10 values)
    cat_distributions = {}
    for col in categorical_cols:
        val_counts = df[col].value_counts(dropna=False).head(10).to_dict()
        cat_distributions[col] = {str(k): int(v) for k, v in val_counts.items()}
        
    # Histograms for numerical columns (10 bins)
    histograms = {}
    for col in numerical_cols:
        series = df[col].dropna()
        if len(series) > 0 and series.nunique() > 1:
            counts, bin_edges = np.histogram(series, bins=10)
            histograms[col] = {
                "bins": [round(float(b), 2) for b in bin_edges],
                "counts": [int(c) for c in counts]
            }
            
    # Pairwise Correlation Matrix for numerical columns
    correlation_matrix = {}
    if len(numerical_cols) >= 2:
        corr_df = df[numerical_cols].corr().fillna(0)
        correlation_matrix = {
            "columns": numerical_cols,
            "values": [[round(float(corr_df.loc[r, c]), 3) for c in numerical_cols] for r in numerical_cols]
        }
        
    # Recommend initial features for clustering
    recommended_features = []
    # Preferred priority keywords: income, spend/score, age
    for priority_kw in ['income', 'spend', 'score', 'age', 'amount', 'frequency', 'recency']:
        for col in numerical_cols:
            if priority_kw in col.lower() and col not in recommended_features:
                recommended_features.append(col)
                if len(recommended_features) >= 3:
                    break
        if len(recommended_features) >= 3:
            break
            
    if len(recommended_features) < 2 and len(numerical_cols) >= 2:
        for col in numerical_cols:
            if col not in recommended_features:
                recommended_features.append(col)
            if len(recommended_features) >= 3:
                break

    # Preview rows
    preview_df = df.head(15).replace({np.nan: None})
    preview_records = preview_df.to_dict(orient='records')
    
    return {
        "total_rows": total_rows,
        "total_cols": total_cols,
        "columns": columns,
        "column_meta": column_meta,
        "numerical_cols": numerical_cols,
        "categorical_cols": categorical_cols,
        "num_stats": num_stats,
        "cat_distributions": cat_distributions,
        "histograms": histograms,
        "correlation_matrix": correlation_matrix,
        "recommended_features": recommended_features,
        "preview_records": preview_records
    }
