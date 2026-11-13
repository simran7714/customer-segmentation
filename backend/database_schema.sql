-- ============================================================================
-- CUSTOMER SEGMENTATION SYSTEM DATABASE SCHEMA (SQLite)
-- Independent of Supabase & External Cloud APIs
-- Persistent Relational Schema for Datasets, Clustering Runs, Personas & Records
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. DATASETS TABLE: Stores metadata of uploaded or loaded customer datasets
CREATE TABLE IF NOT EXISTS datasets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    file_hash TEXT,
    total_rows INTEGER NOT NULL,
    total_cols INTEGER NOT NULL,
    columns_json TEXT NOT NULL,              -- JSON list of columns and metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. ANALYSES TABLE: Stores historical K-Means clustering runs
CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dataset_id INTEGER NOT NULL,
    analysis_name TEXT NOT NULL,
    k_value INTEGER NOT NULL,
    features_json TEXT NOT NULL,             -- JSON list of selected features
    scaler_type TEXT NOT NULL DEFAULT 'standard', -- standard, minmax, or none
    silhouette_score REAL,
    davies_bouldin_score REAL,
    calinski_harabasz_score REAL,
    wcss_json TEXT,                          -- JSON array of WCSS elbow values
    pca_variance_json TEXT,                  -- JSON array of PCA explained variance
    global_means_json TEXT,                  -- JSON dict of cohort global feature means
    notes TEXT,                              -- User notes or custom labels
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
);

-- 3. CLUSTERS TABLE: Stores identified business personas & centroid coordinates
CREATE TABLE IF NOT EXISTS clusters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_id INTEGER NOT NULL,
    cluster_id INTEGER NOT NULL,             -- 0, 1, 2, ...
    persona_name TEXT NOT NULL,
    tagline TEXT,
    badge_color TEXT,
    customer_count INTEGER NOT NULL,
    customer_percentage REAL NOT NULL,
    characteristics TEXT,
    demographic_note TEXT,
    opportunities TEXT,
    strategies_json TEXT,                    -- JSON array of recommended strategies
    channels_json TEXT,                      -- JSON array of marketing channels
    retention_risk TEXT,                     -- Low, Medium, High
    business_value TEXT,                     -- e.g. "Highest Revenue Driver"
    feature_means_json TEXT,                 -- JSON dict of centroid unscaled means
    feature_stats_json TEXT,                 -- JSON dict of min/max/std
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
);

-- 4. CUSTOMER_RECORDS TABLE: Stores individual customer instances with cluster labels
CREATE TABLE IF NOT EXISTS customer_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_id INTEGER NOT NULL,
    customer_identifier TEXT,                -- Customer ID or row index
    cluster_id INTEGER NOT NULL,
    features_data_json TEXT NOT NULL,        -- JSON dict of all customer feature values
    coord_x REAL,                            -- 2D projection X coordinate
    coord_y REAL,                            -- 2D projection Y coordinate
    coord_z REAL,                            -- 3D projection Z coordinate (if 3D)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
);

-- 5. SAVED_REPORTS TABLE: Stores generated analytical executive reports
CREATE TABLE IF NOT EXISTS saved_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    report_html TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
);

-- PERFORMANCE & SEARCH INDEXES
CREATE INDEX IF NOT EXISTS idx_analyses_dataset_id ON analyses(dataset_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_clusters_analysis_id ON clusters(analysis_id);
CREATE INDEX IF NOT EXISTS idx_customer_records_analysis_id ON customer_records(analysis_id);
CREATE INDEX IF NOT EXISTS idx_customer_records_cluster ON customer_records(analysis_id, cluster_id);
CREATE INDEX IF NOT EXISTS idx_saved_reports_analysis_id ON saved_reports(analysis_id);
