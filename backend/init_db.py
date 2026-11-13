#!/usr/bin/env python3
"""
Database Initialization Script for Customer Segmentation System
Initializes SQLite database with schema from database_schema.sql
Supports persistent storage path via DATABASE_PATH environment variable.
"""

import os
import sqlite3
import sys

# Persistent database storage path
# Can be overridden by setting the DATABASE_PATH environment variable
DEFAULT_DB_DIR = os.path.join(os.path.dirname(__file__), "data")
DEFAULT_DB_PATH = os.path.join(DEFAULT_DB_DIR, "customer_segmentation.db")
DB_PATH = os.environ.get("DATABASE_PATH", DEFAULT_DB_PATH)

SCHEMA_FILE = os.path.join(os.path.dirname(__file__), "database_schema.sql")

def get_db_path() -> str:
    """Returns the absolute path to the active SQLite database file."""
    return os.path.abspath(DB_PATH)

def init_database(db_path: str = None) -> bool:
    """
    Initializes the SQLite database with the full schema.
    Ensures persistent directory exists and enables WAL mode for concurrency.
    """
    target_path = db_path or get_db_path()
    
    # Ensure directory exists for persistent volume storage
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    
    if not os.path.exists(SCHEMA_FILE):
        raise FileNotFoundError(f"SQL schema file not found at: {SCHEMA_FILE}")
        
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema_sql = f.read()

    conn = sqlite3.connect(target_path)
    try:
        # Enable Write-Ahead Logging (WAL) for superior performance and concurrent reads
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.executescript(schema_sql)
        conn.commit()
        return True
    finally:
        conn.close()

if __name__ == "__main__":
    path = get_db_path()
    print(f"Initializing Customer Segmentation Database...")
    print(f"Persistent Storage Path: {path}")
    
    try:
        init_database(path)
        print("SUCCESS: Database schema initialized successfully.")
        
        # Verify created tables
        conn = sqlite3.connect(path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
        tables = [row[0] for row in cursor.fetchall() if row[0] != 'sqlite_sequence']
        conn.close()
        
        print("Created Tables:")
        for t in tables:
            print(f"  - {t}")
            
    except Exception as e:
        print(f"ERROR: Failed to initialize database: {e}", file=sys.stderr)
        sys.exit(1)
