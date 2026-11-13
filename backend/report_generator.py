import io
import pandas as pd
from typing import Dict, Any, List
from datetime import datetime

def generate_html_report(
    dataset_summary: Dict[str, Any],
    clustering_params: Dict[str, Any],
    cluster_profiles: List[Dict[str, Any]],
    insights: List[Dict[str, Any]],
    metrics: Dict[str, Any]
) -> str:
    """Generates an executive-level, professional HTML report with full styling."""
    now_str = datetime.now().strftime("%B %d, %Y - %H:%M UTC")
    
    # Generate profile rows for HTML table
    features = clustering_params.get("features", [])
    
    feature_headers = "".join([f"<th>Avg {f}</th>" for f in features])
    
    table_rows = ""
    for p, ins in zip(cluster_profiles, insights):
        cid = p["cluster_id"]
        feat_tds = "".join([f"<td>{p['feature_means'].get(f, 'N/A')}</td>" for f in features])
        table_rows += f"""
        <tr>
            <td><strong style="color: #4f46e5;">Cluster {cid}</strong></td>
            <td><strong>{ins.get('persona_name', f'Segment {cid}')}</strong></td>
            <td>{p['count']} ({p['percentage']}%)</td>
            {feat_tds}
            <td><span class="badge badge-{ins.get('retention_risk', 'Medium').lower()}">{ins.get('retention_risk', 'Medium')}</span></td>
            <td>{ins.get('business_value', 'Standard')}</td>
        </tr>
        """
        
    # Generate Persona Cards HTML
    persona_cards = ""
    for ins in insights:
        strat_list = "".join([f"<li>{s}</li>" for s in ins.get("strategies", [])])
        chan_tags = "".join([f'<span class="channel-pill">{c}</span>' for c in ins.get("channels", [])])
        
        persona_cards += f"""
        <div class="card insight-card">
            <div class="card-header">
                <div>
                    <span class="cluster-tag">Cluster {ins['cluster_id']}</span>
                    <h3 style="margin: 0.3rem 0; font-size: 1.25rem; color: #1e293b;">{ins['persona_name']}</h3>
                    <p style="margin: 0; font-size: 0.88rem; color: #64748b; font-style: italic;">{ins['tagline']}</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.2rem; font-weight: 700; color: #1e293b;">{ins['percentage']}%</div>
                    <div style="font-size: 0.75rem; color: #64748b;">{ins['count']} Customers</div>
                </div>
            </div>
            
            <div class="card-body">
                <p><strong>Profile & Behavior:</strong> {ins['characteristics']}</p>
                {f"<p><strong>Demographics Note:</strong> {ins['demographic_note']}</p>" if ins.get('demographic_note') else ""}
                <p><strong>Business Opportunities:</strong> {ins['opportunities']}</p>
                
                <h4 style="margin: 1rem 0 0.5rem 0; font-size: 0.95rem; color: #334155;">Targeted Marketing Strategies:</h4>
                <ul style="margin: 0 0 1rem 1.2rem; padding: 0; color: #475569; font-size: 0.9rem;">
                    {strat_list}
                </ul>
                
                <div style="margin-top: 0.8rem;">
                    <strong style="font-size: 0.82rem; color: #475569; display: block; margin-bottom: 0.3rem;">Optimal Channels:</strong>
                    <div>{chan_tags}</div>
                </div>
            </div>
        </div>
        """
        
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Segmentation Executive Report</title>
    <style>
        :root {{
            --primary: #4f46e5;
            --primary-dark: #3730a3;
            --bg-slate: #f8fafc;
            --text-dark: #0f172a;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: var(--bg-slate);
            color: var(--text-dark);
            margin: 0;
            padding: 2rem;
            line-height: 1.5;
        }}
        .container {{
            max-width: 1000px;
            margin: 0 auto;
            background: #ffffff;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
        }}
        .header-title h1 {{
            margin: 0;
            font-size: 1.8rem;
            color: #1e1b4b;
        }}
        .header-title p {{
            margin: 0.3rem 0 0 0;
            color: var(--text-muted);
            font-size: 0.95rem;
        }}
        .print-btn {{
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.6rem 1.2rem;
            font-size: 0.88rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }}
        .print-btn:hover {{
            background: var(--primary-dark);
        }}
        .metric-grid {{
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }}
        .metric-box {{
            background: #f1f5f9;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid var(--primary);
        }}
        .metric-box .label {{
            font-size: 0.78rem;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--text-muted);
        }}
        .metric-box .val {{
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e293b;
            margin-top: 0.2rem;
        }}
        h2 {{
            color: #1e293b;
            font-size: 1.3rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
            font-size: 0.9rem;
        }}
        th, td {{
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }}
        th {{
            background: #f8fafc;
            color: #475569;
            font-weight: 600;
            font-size: 0.82rem;
            text-transform: uppercase;
        }}
        .badge {{
            display: inline-block;
            padding: 0.2rem 0.6rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }}
        .badge-low {{ background: #dcfce7; color: #166534; }}
        .badge-medium {{ background: #fef9c3; color: #854d0e; }}
        .badge-high {{ background: #fee2e2; color: #991b1b; }}
        
        .card {{
            border: 1px solid var(--border-color);
            border-radius: 8px;
            margin-bottom: 1.5rem;
            background: #ffffff;
            overflow: hidden;
            break-inside: avoid;
        }}
        .card-header {{
            background: #f8fafc;
            padding: 1rem 1.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
        }}
        .card-body {{
            padding: 1.25rem;
        }}
        .cluster-tag {{
            display: inline-block;
            background: #e0e7ff;
            color: #4338ca;
            padding: 0.15rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
        }}
        .channel-pill {{
            display: inline-block;
            background: #f1f5f9;
            color: #334155;
            border: 1px solid #cbd5e1;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.78rem;
            margin-right: 0.4rem;
            margin-bottom: 0.4rem;
        }}
        .footer {{
            margin-top: 3rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
            font-size: 0.8rem;
            color: var(--text-muted);
            text-align: center;
        }}
        @media print {{
            body {{
                padding: 0;
                background: white;
            }}
            .container {{
                box-shadow: none;
                padding: 0;
            }}
            .print-btn {{
                display: none;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-title">
                <h1>Customer Segmentation Analysis Report</h1>
                <p>K-Means Clustering & Machine Learning Intelligence Dashboard &bull; Generated: {now_str}</p>
            </div>
            <div>
                <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
            </div>
        </div>

        <div class="metric-grid">
            <div class="metric-box">
                <div class="label">Total Customers</div>
                <div class="val">{dataset_summary.get('total_rows', 0):,}</div>
            </div>
            <div class="metric-box">
                <div class="label">Optimal Clusters (K)</div>
                <div class="val">{clustering_params.get('k', 0)}</div>
            </div>
            <div class="metric-box">
                <div class="label">Silhouette Score</div>
                <div class="val">{metrics.get('silhouette_score', 0.0)}</div>
            </div>
            <div class="metric-box">
                <div class="label">Feature Scaler</div>
                <div class="val" style="text-transform: capitalize;">{clustering_params.get('scaler', 'Standard')}</div>
            </div>
        </div>

        <h2>Clustering Model Configuration & Metrics</h2>
        <table>
            <thead>
                <tr>
                    <th>Metric / Parameter</th>
                    <th>Observed Value</th>
                    <th>Analytical Interpretation</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Clustering Algorithm</strong></td>
                    <td>K-Means (k-means++ initialization)</td>
                    <td>Partitioning algorithm optimizing within-cluster sum of squares (WCSS).</td>
                </tr>
                <tr>
                    <td><strong>Selected Features</strong></td>
                    <td>{", ".join(features)}</td>
                    <td>Multi-dimensional customer behavioral vector.</td>
                </tr>
                <tr>
                    <td><strong>Silhouette Coefficient</strong></td>
                    <td><strong>{metrics.get('silhouette_score', 'N/A')}</strong></td>
                    <td>Measures cluster cohesion and separation (Range: -1 to +1; higher indicates well-separated clusters).</td>
                </tr>
                <tr>
                    <td><strong>Davies-Bouldin Index</strong></td>
                    <td><strong>{metrics.get('davies_bouldin_score', 'N/A')}</strong></td>
                    <td>Ratio of within-cluster distance to between-cluster distance (Lower is better).</td>
                </tr>
                <tr>
                    <td><strong>Calinski-Harabasz Score</strong></td>
                    <td><strong>{metrics.get('calinski_harabasz_score', 'N/A')}</strong></td>
                    <td>Variance ratio criterion (Higher indicates denser and better-separated clusters).</td>
                </tr>
            </tbody>
        </table>

        <h2>Customer Segment Profiles Summary</h2>
        <table>
            <thead>
                <tr>
                    <th>Cluster ID</th>
                    <th>Business Persona</th>
                    <th>Distribution</th>
                    {feature_headers}
                    <th>Retention Risk</th>
                    <th>Strategic Role</th>
                </tr>
            </thead>
            <tbody>
                {table_rows}
            </tbody>
        </table>

        <h2>Actionable Business Insights & Targeted Strategies</h2>
        {persona_cards}

        <div class="footer">
            <p><strong>Customer Segmentation System Using K-Means Clustering Algorithm</strong></p>
            <p>"Understand Your Customers. Discover Business Opportunities." &bull; Major Academic Project in CSE</p>
        </div>
    </div>
</body>
</html>
"""
    return html_content
