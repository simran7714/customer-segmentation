import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist-min';
import { 
  BarChart3, PieChart as PieIcon, Layers, Maximize2, 
  RotateCw, ArrowRight, AlertCircle, Compass 
} from 'lucide-react';

const CLUSTER_COLORS = [
  '#4f46e5', // indigo
  '#059669', // emerald
  '#dc2626', // red
  '#d97706', // amber
  '#7c3aed', // violet
  '#0284c7', // light blue
  '#db2777', // pink
  '#4b5563', // gray
  '#0d9488', // teal
  '#ea580c'  // orange
];

export default function VisualizationsTab({ clusterResult, insights, onNavigateTab }) {
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('all');

  const plot2dRef = useRef(null);
  const plot3dRef = useRef(null);
  const distRef = useRef(null);
  const radarRef = useRef(null);

  // Render 2D Scatter Plot
  useEffect(() => {
    if (!plot2dRef.current || !clusterResult || !clusterResult.plot_coords_2d) return;

    const k = clusterResult.k;
    const coords = clusterResult.plot_coords_2d;
    const centroids = clusterResult.centroids_2d;
    const features = clusterResult.features;

    const traces = [];

    // Customer cluster scatter traces
    for (let cid = 0; cid < k; cid++) {
      if (selectedClusterFilter !== 'all' && parseInt(selectedClusterFilter) !== cid) {
        continue;
      }

      const clusterPoints = coords.filter(p => p.cluster === cid);
      const persona = insights ? insights.find(ins => ins.cluster_id === cid) : null;
      const personaName = persona ? persona.persona_name : `Cluster ${cid}`;

      traces.push({
        x: clusterPoints.map(p => p.x),
        y: clusterPoints.map(p => p.y),
        mode: 'markers',
        type: 'scatter',
        name: `Cluster ${cid}: ${personaName}`,
        marker: {
          size: 8,
          color: CLUSTER_COLORS[cid % CLUSTER_COLORS.length],
          opacity: 0.85,
          line: { width: 1, color: '#ffffff' }
        },
        text: clusterPoints.map(() => `Segment: ${personaName}<br>Cluster: ${cid}`),
        hoverinfo: 'text+x+y'
      });
    }

    // Centroid Markers Trace
    const activeCentroids = selectedClusterFilter === 'all'
      ? centroids
      : centroids.filter(c => c.cluster === parseInt(selectedClusterFilter));

    traces.push({
      x: activeCentroids.map(c => c.x),
      y: activeCentroids.map(c => c.y),
      mode: 'markers+text',
      type: 'scatter',
      name: 'Cluster Centroids (µ)',
      marker: {
        size: 16,
        color: '#0f172a',
        symbol: 'diamond',
        line: { width: 2, color: '#ffffff' }
      },
      text: activeCentroids.map(c => `Centroid ${c.cluster}`),
      textposition: 'top center',
      textfont: { size: 10, weight: 800, color: '#0f172a' }
    });

    const isDirect2D = features.length === 2;
    const xLabel = isDirect2D ? features[0] : (clusterResult.pca_explained_var ? `PCA Component 1 (${(clusterResult.pca_explained_var[0]*100).toFixed(1)}% var)` : 'Dimension 1');
    const yLabel = isDirect2D ? features[1] : (clusterResult.pca_explained_var ? `PCA Component 2 (${(clusterResult.pca_explained_var[1]*100).toFixed(1)}% var)` : 'Dimension 2');

    const layout = {
      title: { 
        text: `2D Customer Cluster Mapping (${xLabel} vs ${yLabel})`, 
        font: { size: 14, color: '#1e293b' } 
      },
      xaxis: { title: xLabel, gridcolor: '#f1f5f9' },
      yaxis: { title: yLabel, gridcolor: '#f1f5f9' },
      margin: { l: 50, r: 20, t: 40, b: 60 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      showlegend: true,
      legend: { orientation: 'h', y: -0.2 }
    };

    Plotly.react(plot2dRef.current, traces, layout, { responsive: true });
  }, [clusterResult, insights, selectedClusterFilter]);

  // Render 3D Scatter Plot
  useEffect(() => {
    if (!plot3dRef.current || !clusterResult || !clusterResult.plot_coords_3d || viewMode !== '3d') return;

    const k = clusterResult.k;
    const coords = clusterResult.plot_coords_3d;
    const centroids = clusterResult.centroids_3d;
    const features = clusterResult.features;

    const traces = [];

    for (let cid = 0; cid < k; cid++) {
      if (selectedClusterFilter !== 'all' && parseInt(selectedClusterFilter) !== cid) {
        continue;
      }

      const clusterPoints = coords.filter(p => p.cluster === cid);
      const persona = insights ? insights.find(ins => ins.cluster_id === cid) : null;
      const personaName = persona ? persona.persona_name : `Cluster ${cid}`;

      traces.push({
        x: clusterPoints.map(p => p.x),
        y: clusterPoints.map(p => p.y),
        z: clusterPoints.map(p => p.z),
        mode: 'markers',
        type: 'scatter3d',
        name: `Cluster ${cid}: ${personaName}`,
        marker: {
          size: 4,
          color: CLUSTER_COLORS[cid % CLUSTER_COLORS.length],
          opacity: 0.8
        }
      });
    }

    if (centroids) {
      traces.push({
        x: centroids.map(c => c.x),
        y: centroids.map(c => c.y),
        z: centroids.map(c => c.z),
        mode: 'markers+text',
        type: 'scatter3d',
        name: 'Centroids',
        marker: {
          size: 9,
          color: '#000000',
          symbol: 'diamond'
        },
        text: centroids.map(c => `C${c.cluster}`),
        textposition: 'top center'
      });
    }

    const layout = {
      title: { text: '3D Customer Segmentation Space (Interactive 360°)', font: { size: 14, color: '#1e293b' } },
      scene: {
        xaxis: { title: features[0] || 'X' },
        yaxis: { title: features[1] || 'Y' },
        zaxis: { title: features[2] || 'Z' }
      },
      margin: { l: 0, r: 0, b: 0, t: 30 },
      paper_bgcolor: 'transparent'
    };

    Plotly.react(plot3dRef.current, traces, layout, { responsive: true });
  }, [clusterResult, insights, viewMode, selectedClusterFilter]);

  // Render Cluster Distribution Pie Chart
  useEffect(() => {
    if (!distRef.current || !clusterResult) return;

    const profiles = clusterResult.cluster_profiles;
    const labels = profiles.map(p => {
      const ins = insights?.find(i => i.cluster_id === p.cluster_id);
      return `Cluster ${p.cluster_id}: ${ins ? ins.persona_name : 'Segment'}`;
    });
    const values = profiles.map(p => p.count);

    const trace = {
      labels: labels,
      values: values,
      type: 'pie',
      hole: 0.5,
      marker: {
        colors: CLUSTER_COLORS.slice(0, profiles.length)
      },
      textinfo: 'label+percent',
      textposition: 'inside',
      hoverinfo: 'label+value+percent'
    };

    const layout = {
      title: { text: 'Customer Share by Segment (%)', font: { size: 14, color: '#1e293b' } },
      margin: { l: 20, r: 20, t: 40, b: 20 },
      showlegend: false,
      paper_bgcolor: 'transparent'
    };

    Plotly.react(distRef.current, [trace], layout, { responsive: true });
  }, [clusterResult, insights]);

  // Render Centroid Comparison Radar Chart
  useEffect(() => {
    if (!radarRef.current || !clusterResult) return;

    const profiles = clusterResult.cluster_profiles;
    const features = clusterResult.features;
    const globalMeans = clusterResult.global_means;

    const traces = profiles.map((p, idx) => {
      // Normalize values relative to global mean (100% baseline)
      const rValues = features.map(f => {
        const gMean = globalMeans[f] || 1;
        const cMean = p.feature_means[f] || 0;
        return (cMean / gMean) * 100;
      });

      // Close the loop
      rValues.push(rValues[0]);
      const closedFeatures = [...features, features[0]];

      return {
        type: 'scatterpolar',
        r: rValues,
        theta: closedFeatures,
        fill: 'toself',
        opacity: 0.5,
        name: `Cluster ${p.cluster_id}`,
        marker: { color: CLUSTER_COLORS[idx % CLUSTER_COLORS.length] }
      };
    });

    const layout = {
      polar: {
        radialaxis: {
          visible: true,
          range: [0, 200]
        }
      },
      title: { text: 'Cluster Profile Radar (% of Cohort Mean)', font: { size: 14, color: '#1e293b' } },
      margin: { l: 40, r: 40, t: 40, b: 30 },
      showlegend: true,
      legend: { orientation: 'h', y: -0.15 },
      paper_bgcolor: 'transparent'
    };

    Plotly.react(radarRef.current, traces, layout, { responsive: true });
  }, [clusterResult]);

  if (!clusterResult) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">No Clusters Trained Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Please run the K-Means clustering algorithm in the Segmentation tab to generate 2D and 3D visual graphs.
        </p>
        <button
          onClick={() => onNavigateTab('segmentation')}
          className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-500 transition"
        >
          Go to Segmentation Module
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cluster Visualizations & Spatial Analysis</h2>
          <p className="text-xs text-slate-500">
            Interactive multi-dimensional scatter projections, centroid positions, and relative segment profiles.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Segment Filter */}
          <div className="flex items-center space-x-1.5 text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-600">Filter:</span>
            <select
              value={selectedClusterFilter}
              onChange={(e) => setSelectedClusterFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-700 font-semibold focus:outline-none"
            >
              <option value="all">All Clusters</option>
              {clusterResult.cluster_profiles.map(p => (
                <option key={p.cluster_id} value={p.cluster_id}>Cluster {p.cluster_id}</option>
              ))}
            </select>
          </div>

          {/* 2D / 3D Toggle */}
          <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1.5 rounded-md transition ${viewMode === '2d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              2D Projection
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 rounded-md transition ${viewMode === '3d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              3D Interactive
            </button>
          </div>
        </div>
      </div>

      {/* Main Scatter View (2D or 3D) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        {viewMode === '2d' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Scatter Plot with K-Means Centroids (◆)
              </span>
              <span className="text-xs text-slate-400">Drag to zoom &bull; Double click to reset</span>
            </div>
            <div ref={plot2dRef} className="w-full h-[450px]" />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
                <RotateCw className="w-3.5 h-3.5 text-brand-600" />
                <span>3D Spatial Rotation (Drag to rotate, Scroll to zoom)</span>
              </span>
              <span className="text-xs text-slate-400">WebGL accelerated</span>
            </div>
            <div ref={plot3dRef} className="w-full h-[450px]" />
          </div>
        )}
      </div>

      {/* Secondary Charts: Share Distribution & Profile Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Share Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center space-x-2">
            <PieIcon className="w-4 h-4 text-brand-600" />
            <span>Customer Volume by Cluster</span>
          </h3>
          <div ref={distRef} className="w-full h-80" />
        </div>

        {/* Centroid Radar Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center space-x-2">
            <Compass className="w-4 h-4 text-purple-600" />
            <span>Multidimensional Centroid Radar</span>
          </h3>
          <div ref={radarRef} className="w-full h-80" />
        </div>

      </div>

      {/* Detailed Cluster Centroid Feature Means Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 mb-1">Centroid Feature Coordinates & Distribution Summary</h3>
        <p className="text-xs text-slate-500 mb-4">Actual unscaled feature averages for each trained cluster partition.</p>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Cluster ID</th>
                <th className="py-2.5 px-3">Business Persona</th>
                <th className="py-2.5 px-3">Customer Count</th>
                <th className="py-2.5 px-3">Segment Share (%)</th>
                {clusterResult.features.map(f => (
                  <th key={f} className="py-2.5 px-3">Avg {f}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {clusterResult.cluster_profiles.map((p) => {
                const ins = insights?.find(i => i.cluster_id === p.cluster_id);
                return (
                  <tr key={p.cluster_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-brand-600">Cluster {p.cluster_id}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {ins ? ins.persona_name : `Segment ${p.cluster_id}`}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{p.count.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold">{p.percentage}%</td>
                    {clusterResult.features.map(f => (
                      <td key={f} className="py-2.5 px-3 font-mono">
                        {p.feature_means[f] ?? '—'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
