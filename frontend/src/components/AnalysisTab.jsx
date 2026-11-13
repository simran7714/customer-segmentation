import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist-min';
import { BarChart3, TrendingUp, Grid, Activity, ArrowRight, AlertCircle } from 'lucide-react';

export default function AnalysisTab({ datasetInfo, onNavigateTab }) {
  const analysis = datasetInfo?.analysis;
  const numericalCols = analysis?.numerical_cols || [];
  const catDistributions = analysis?.cat_distributions || {};
  const histograms = analysis?.histograms || {};
  const correlationMatrix = analysis?.correlation_matrix || {};
  const numStats = analysis?.num_stats || {};

  const [selectedHistCol, setSelectedHistCol] = useState(numericalCols[0] || '');
  const [scatterX, setScatterX] = useState(numericalCols[0] || '');
  const [scatterY, setScatterY] = useState(numericalCols[1] || numericalCols[0] || '');

  const histRef = useRef(null);
  const corrRef = useRef(null);
  const scatterRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => {
    if (numericalCols.length > 0 && !selectedHistCol) {
      setSelectedHistCol(numericalCols[0]);
    }
    if (numericalCols.length > 0 && !scatterX) {
      setScatterX(numericalCols[0]);
    }
    if (numericalCols.length > 1 && !scatterY) {
      setScatterY(numericalCols[1]);
    }
  }, [numericalCols]);

  // Render Histogram
  useEffect(() => {
    if (!histRef.current || !selectedHistCol || !histograms[selectedHistCol]) return;
    const histData = histograms[selectedHistCol];
    
    // Convert bin edges to midpoints for clean bar display
    const xLabels = [];
    for (let i = 0; i < histData.bins.length - 1; i++) {
      xLabels.push(`${histData.bins[i]} - ${histData.bins[i+1]}`);
    }

    const trace = {
      x: xLabels,
      y: histData.counts,
      type: 'bar',
      marker: {
        color: '#4f46e5',
        opacity: 0.85,
        line: { color: '#3730a3', width: 1.5 }
      }
    };

    const layout = {
      title: { text: `Distribution of ${selectedHistCol}`, font: { size: 14, color: '#1e293b' } },
      margin: { l: 45, r: 20, t: 40, b: 60 },
      xaxis: { title: selectedHistCol, tickangle: -25, tickfont: { size: 10 } },
      yaxis: { title: 'Frequency (Count)' },
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent'
    };

    Plotly.react(histRef.current, [trace], layout, { responsive: true, displayModeBar: false });
  }, [selectedHistCol, histograms]);

  // Render Categorical (Gender) Pie / Bar Chart
  useEffect(() => {
    if (!catRef.current) return;
    const catKeys = Object.keys(catDistributions);
    if (catKeys.length === 0) return;
    
    const firstCat = catKeys[0];
    const catVals = catDistributions[firstCat];
    const labels = Object.keys(catVals);
    const values = Object.values(catVals);

    const trace = {
      labels: labels,
      values: values,
      type: 'pie',
      hole: 0.45,
      marker: {
        colors: ['#4f46e5', '#ec4899', '#06b6d4', '#f59e0b', '#10b981']
      },
      textinfo: 'label+percent',
      textposition: 'inside',
      hoverinfo: 'label+value+percent'
    };

    const layout = {
      title: { text: `Customer Demographics: ${firstCat}`, font: { size: 14, color: '#1e293b' } },
      margin: { l: 20, r: 20, t: 40, b: 20 },
      showlegend: true,
      legend: { orientation: 'h', y: -0.1 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent'
    };

    Plotly.react(catRef.current, [trace], layout, { responsive: true, displayModeBar: false });
  }, [catDistributions]);

  // Render Correlation Matrix Heatmap
  useEffect(() => {
    if (!corrRef.current || !correlationMatrix.columns || correlationMatrix.columns.length < 2) return;

    const trace = {
      z: correlationMatrix.values,
      x: correlationMatrix.columns,
      y: correlationMatrix.columns,
      type: 'heatmap',
      colorscale: 'Blues',
      reversescale: false,
      zmin: -1,
      zmax: 1,
      hoverongaps: false
    };

    const layout = {
      title: { text: 'Pearson Correlation Heatmap Matrix', font: { size: 14, color: '#1e293b' } },
      margin: { l: 120, r: 30, t: 40, b: 80 },
      xaxis: { tickangle: -25, tickfont: { size: 10 } },
      yaxis: { tickfont: { size: 10 } },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent'
    };

    Plotly.react(corrRef.current, [trace], layout, { responsive: true, displayModeBar: false });
  }, [correlationMatrix]);

  // Render Feature Scatter Pair
  useEffect(() => {
    if (!scatterRef.current || !scatterX || !scatterY || !analysis?.preview_records) return;
    const records = analysis.preview_records;

    const xVals = records.map(r => r[scatterX]).filter(v => v !== null && v !== undefined);
    const yVals = records.map(r => r[scatterY]).filter(v => v !== null && v !== undefined);

    const trace = {
      x: xVals,
      y: yVals,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 9,
        color: '#6366f1',
        opacity: 0.8,
        line: { color: '#312e81', width: 1 }
      }
    };

    const layout = {
      title: { text: `${scatterX} vs ${scatterY} (Unclustered Distribution)`, font: { size: 14, color: '#1e293b' } },
      margin: { l: 50, r: 20, t: 40, b: 50 },
      xaxis: { title: scatterX },
      yaxis: { title: scatterY },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent'
    };

    Plotly.react(scatterRef.current, [trace], layout, { responsive: true, displayModeBar: false });
  }, [scatterX, scatterY, analysis]);

  if (!datasetInfo) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">No Dataset Uploaded</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Please upload a customer dataset or load a sample benchmark first to access Exploratory Data Analysis.
        </p>
        <button
          onClick={() => onNavigateTab('upload')}
          className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-500 transition"
        >
          Go to Dataset Upload
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Exploratory Data Analysis (EDA)</h2>
          <p className="text-xs text-slate-500">Uncover statistical distributions, feature correlations, and customer behavioral traits.</p>
        </div>

        <button
          onClick={() => onNavigateTab('segmentation')}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition shadow-sm self-start sm:self-auto"
        >
          <span>Proceed to Elbow & K-Means</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </button>
      </div>

      {/* Numerical Descriptive Statistics Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 mb-1 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-brand-600" />
          <span>Parametric Descriptive Statistics</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">Central tendency, spread, interquartile ranges, and asymmetry.</p>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Feature Name</th>
                <th className="py-2.5 px-3">Mean</th>
                <th className="py-2.5 px-3">Std Dev</th>
                <th className="py-2.5 px-3">Min</th>
                <th className="py-2.5 px-3">25% (Q1)</th>
                <th className="py-2.5 px-3">Median (Q2)</th>
                <th className="py-2.5 px-3">75% (Q3)</th>
                <th className="py-2.5 px-3">Max</th>
                <th className="py-2.5 px-3">Skewness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              {numericalCols.map((col) => {
                const s = numStats[col] || {};
                return (
                  <tr key={col} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{col}</td>
                    <td className="py-2.5 px-3">{s.mean ?? '—'}</td>
                    <td className="py-2.5 px-3">{s.std ?? '—'}</td>
                    <td className="py-2.5 px-3">{s.min ?? '—'}</td>
                    <td className="py-2.5 px-3">{s.q25 ?? '—'}</td>
                    <td className="py-2.5 px-3">{s.median ?? '—'}</td>
                    <td className="py-2.5 px-3">{s.q75 ?? '—'}</td>
                    <td className="py-2.5 px-3">{s.max ?? '—'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        Math.abs(s.skewness || 0) > 1 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.skewness ?? '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distributions Row: Feature Histogram & Demographics Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Feature Distribution Histogram */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <span>Feature Density Distribution</span>
            </h3>
            
            {/* Feature Picker */}
            <select
              value={selectedHistCol}
              onChange={(e) => setSelectedHistCol(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {numericalCols.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <div ref={histRef} className="w-full h-72" />
        </div>

        {/* Categorical Demographics or Secondary Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Demographic Breakdown</span>
          </h3>
          {Object.keys(catDistributions).length > 0 ? (
            <div ref={catRef} className="w-full h-72" />
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-slate-400 text-xs">
              <Grid className="w-8 h-8 mb-2 stroke-[1.5]" />
              <p>No categorical demographic attribute detected in this dataset.</p>
            </div>
          )}
        </div>

      </div>

      {/* Correlation Heatmap & Bivariate Pair Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Heatmap */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center space-x-2">
            <Grid className="w-4 h-4 text-brand-600" />
            <span>Inter-Feature Correlation Matrix</span>
          </h3>
          {correlationMatrix.columns && correlationMatrix.columns.length >= 2 ? (
            <div ref={corrRef} className="w-full h-80" />
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-400 text-xs">
              Requires at least 2 numerical attributes to compute correlation.
            </div>
          )}
        </div>

        {/* Feature Pair Scatter Explorer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="font-bold text-sm text-slate-900">Bivariate Scatter Explorer</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={scatterX}
                  onChange={(e) => setScatterX(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700"
                >
                  {numericalCols.map(col => <option key={col} value={col}>X: {col}</option>)}
                </select>
                <select
                  value={scatterY}
                  onChange={(e) => setScatterY(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700"
                >
                  {numericalCols.map(col => <option key={col} value={col}>Y: {col}</option>)}
                </select>
              </div>
            </div>
            <div ref={scatterRef} className="w-full h-80" />
          </div>
        </div>

      </div>

    </div>
  );
}
