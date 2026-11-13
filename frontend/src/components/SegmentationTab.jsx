import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { 
  Sparkles, Layers, Sliders, CheckCircle2, TrendingUp, 
  HelpCircle, ArrowRight, RefreshCw, AlertCircle, Award 
} from 'lucide-react';
import { calculateElbow, runClustering } from '../api';

export default function SegmentationTab({ 
  datasetInfo, 
  clusterResult, 
  onClusteringComplete, 
  onNavigateTab 
}) {
  const analysis = datasetInfo?.analysis;
  const numericalCols = analysis?.numerical_cols || [];
  const recommendedFeatures = analysis?.recommended_features || [];

  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [scaler, setScaler] = useState('standard');
  const [kValue, setKValue] = useState(5);
  
  const [elbowData, setElbowData] = useState(null);
  const [isElbowLoading, setIsElbowLoading] = useState(false);
  const [isClusteringLoading, setIsClusteringLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const elbowChartRef = useRef(null);
  const silChartRef = useRef(null);

  // Initialize selected features with recommended or first 2 numerical cols
  useEffect(() => {
    if (selectedFeatures.length === 0 && numericalCols.length > 0) {
      if (recommendedFeatures.length >= 2) {
        setSelectedFeatures(recommendedFeatures.slice(0, 3));
      } else {
        setSelectedFeatures(numericalCols.slice(0, Math.min(3, numericalCols.length)));
      }
    }
  }, [numericalCols, recommendedFeatures]);

  // Handle Feature Checkbox Toggle
  const toggleFeature = (col) => {
    if (selectedFeatures.includes(col)) {
      if (selectedFeatures.length <= 1) {
        setErrorMessage('At least 1 feature required (2 or more recommended).');
        return;
      }
      setSelectedFeatures(selectedFeatures.filter(f => f !== col));
    } else {
      setSelectedFeatures([...selectedFeatures, col]);
      setErrorMessage('');
    }
  };

  // Run Elbow Analysis
  const handleCalculateElbow = async () => {
    if (selectedFeatures.length < 1) {
      setErrorMessage('Please select at least 2 features for clustering.');
      return;
    }
    setErrorMessage('');
    setIsElbowLoading(true);
    try {
      const res = await calculateElbow(selectedFeatures, scaler, 10);
      setElbowData(res.elbow_data);
      if (res.elbow_data.recommended_k) {
        setKValue(res.elbow_data.recommended_k);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsElbowLoading(false);
    }
  };

  // Run K-Means Clustering
  const handleExecuteClustering = async () => {
    if (selectedFeatures.length < 1) {
      setErrorMessage('Please select at least 2 features.');
      return;
    }
    setErrorMessage('');
    setIsClusteringLoading(true);
    try {
      const result = await runClustering(selectedFeatures, kValue, scaler);
      onClusteringComplete(result);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsClusteringLoading(false);
    }
  };

  // Render Elbow Curve & Silhouette Curve with Plotly
  useEffect(() => {
    if (!elbowData) return;

    // 1. WCSS Elbow Chart
    if (elbowChartRef.current) {
      const recK = elbowData.recommended_k;
      const recIdx = elbowData.k_values.indexOf(recK);
      const recWCSS = recIdx !== -1 ? elbowData.wcss[recIdx] : null;

      const lineTrace = {
        x: elbowData.k_values,
        y: elbowData.wcss,
        mode: 'lines+markers',
        type: 'scatter',
        name: 'WCSS (Inertia)',
        line: { color: '#4f46e5', width: 3 },
        marker: { size: 8, color: '#312e81' }
      };

      const elbowPointTrace = recWCSS !== null ? {
        x: [recK],
        y: [recWCSS],
        mode: 'markers+text',
        type: 'scatter',
        name: 'Optimal Elbow Point',
        text: [`Elbow Point (K=${recK})`],
        textposition: 'top right',
        textfont: { color: '#dc2626', size: 12, weight: 700 },
        marker: { size: 14, color: '#dc2626', symbol: 'star' }
      } : null;

      const traces = elbowPointTrace ? [lineTrace, elbowPointTrace] : [lineTrace];

      const layout = {
        title: { text: 'Elbow Method: WCSS vs Number of Clusters (K)', font: { size: 14, color: '#1e293b' } },
        xaxis: { title: 'Number of Clusters (K)', dtick: 1 },
        yaxis: { title: 'Within-Cluster Sum of Squares (WCSS)' },
        margin: { l: 60, r: 20, t: 40, b: 50 },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent'
      };

      Plotly.react(elbowChartRef.current, traces, layout, { responsive: true, displayModeBar: false });
    }

    // 2. Silhouette Score Progression Chart
    if (silChartRef.current) {
      const validK = elbowData.k_values.slice(1);
      const validSil = elbowData.silhouette_scores.slice(1);

      const silTrace = {
        x: validK,
        y: validSil,
        mode: 'lines+markers',
        type: 'scatter',
        name: 'Silhouette Score',
        line: { color: '#059669', width: 3 },
        marker: { size: 8, color: '#065f46' }
      };

      const layout = {
        title: { text: 'Silhouette Coefficient Progression across K', font: { size: 14, color: '#1e293b' } },
        xaxis: { title: 'Number of Clusters (K)', dtick: 1 },
        yaxis: { title: 'Silhouette Score' },
        margin: { l: 60, r: 20, t: 40, b: 50 },
        showlegend: false,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent'
      };

      Plotly.react(silChartRef.current, [silTrace], layout, { responsive: true, displayModeBar: false });
    }

  }, [elbowData]);

  if (!datasetInfo) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">No Dataset Uploaded</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Please upload a dataset or choose a benchmark to train the K-Means algorithm.
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
      <div>
        <h2 className="text-xl font-bold text-slate-900">Optimal Cluster Selection & K-Means Training</h2>
        <p className="text-xs text-slate-500">
          Determine optimal K via the Elbow Method and Silhouette Analysis, then train the K-Means clustering algorithm.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Configuration Controls Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        
        {/* Step 1: Feature Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              <span>Step 1: Select Features for Clustering</span>
            </h3>
            <span className="text-xs text-slate-500">
              {selectedFeatures.length} feature(s) active
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Select 2 or more numerical attributes. Features are transformed based on the selected scaler.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {numericalCols.map((col) => {
              const isChecked = selectedFeatures.includes(col);
              const isRec = recommendedFeatures.includes(col);

              return (
                <div
                  key={col}
                  onClick={() => toggleFeature(col)}
                  className={`cursor-pointer p-3 rounded-xl border transition flex items-center justify-between ${
                    isChecked
                      ? 'border-brand-500 bg-brand-50/60 text-brand-900 font-semibold shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                    />
                    <span className="text-xs truncate">{col}</span>
                  </div>

                  {isRec && (
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Rec
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Feature Scaler & Elbow Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Feature Preprocessing Scaler
            </label>
            <select
              value={scaler}
              onChange={(e) => setScaler(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="standard">StandardScaler (Zero mean, Unit variance - Recommended)</option>
              <option value="minmax">MinMaxScaler (Rescale to [0, 1] range)</option>
              <option value="none">Raw Features (No scaling)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCalculateElbow}
              disabled={isElbowLoading}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-sm disabled:opacity-50"
            >
              {isElbowLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Computing WCSS & Silhouette across K...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>Run Elbow Method & Find Optimal K</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Elbow Method Results Section */}
      {elbowData && (
        <div className="space-y-6">
          
          {/* Recommendation Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                K={elbowData.recommended_k}
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950">
                  Optimal Cluster Recommendation: <span className="underline">K = {elbowData.recommended_k} Clusters</span>
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Identified via geometric knee detection on WCSS curve &bull; Best Silhouette K: {elbowData.best_silhouette_k}
                </p>
              </div>
            </div>

            <button
              onClick={() => setKValue(elbowData.recommended_k)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition shadow-sm"
            >
              Apply Recommended K ({elbowData.recommended_k})
            </button>
          </div>

          {/* Dual Charts: Elbow vs Silhouette */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div ref={elbowChartRef} className="w-full h-72" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div ref={silChartRef} className="w-full h-72" />
            </div>
          </div>

        </div>
      )}

      {/* Step 3: Model Execution Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 mb-1 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-brand-600" />
          <span>Step 2: Train K-Means Clustering Model</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Specify number of clusters K and train the Scikit-Learn model to partition the customer base.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Number of Clusters (K): <span className="text-brand-600 text-sm font-extrabold">{kValue}</span>
              </label>
              <span className="text-[11px] text-slate-500">Range: 2 to 10</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={kValue}
              onChange={(e) => setKValue(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
            </div>
          </div>

          <div>
            <button
              onClick={handleExecuteClustering}
              disabled={isClusteringLoading}
              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {isClusteringLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Fitting K-Means Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Fit K-Means (K={kValue})</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

      {/* Clustering Results Metric Callout */}
      {clusterResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-2">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-base text-slate-900">
                Model Successfully Trained with {clusterResult.k} Clusters!
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('visualizations')}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition shadow-sm"
            >
              <span>Explore Visualizations & Segments</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Silhouette Score</span>
              <p className="text-2xl font-extrabold text-brand-600 mt-0.5">{clusterResult.silhouette_score}</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Optimal cohesion & separation (&gt;0.5 is strong)</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Davies-Bouldin Index</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">{clusterResult.davies_bouldin_score}</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Cluster similarity index (Lower is superior)</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Calinski-Harabasz Index</span>
              <p className="text-2xl font-extrabold text-purple-600 mt-0.5">{clusterResult.calinski_harabasz_score}</p>
              <span className="text-[10px] text-slate-500 mt-1 block">Variance ratio criterion (Higher is superior)</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
