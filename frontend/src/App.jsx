import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Upload, BarChart2, Layers, 
  Award, Table, FileText, CheckCircle2, AlertCircle, RefreshCw,
  PieChart as PieIcon, Sparkles, History
} from 'lucide-react';

import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DashboardTab from './components/DashboardTab';
import UploadTab from './components/UploadTab';
import AnalysisTab from './components/AnalysisTab';
import SegmentationTab from './components/SegmentationTab';
import VisualizationsTab from './components/VisualizationsTab';
import InsightsTab from './components/InsightsTab';
import RecordsTab from './components/RecordsTab';
import ReportsTab from './components/ReportsTab';
import HistoryTab from './components/HistoryTab';

import { checkHealth, uploadDataset, runClustering, loadAnalysisFromHistory } from './api';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Dataset Upload', icon: Upload },
  { id: 'analysis', label: 'Data Analysis (EDA)', icon: BarChart2 },
  { id: 'segmentation', label: 'Customer Segmentation', icon: Layers },
  { id: 'visualizations', label: 'Cluster Visualizations', icon: Sparkles },
  { id: 'insights', label: 'Business Insights', icon: Award },
  { id: 'records', label: 'Customer Records', icon: Table },
  { id: 'reports', label: 'Reports & Exports', icon: FileText },
  { id: 'history', label: 'History & SQLite', icon: History }
];

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'dashboard'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [clusterResult, setClusterResult] = useState(null);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // Initial connection check and load default benchmark
  useEffect(() => {
    async function initializeSystem() {
      try {
        await checkHealth();
        setIsConnected(true);
        // Automatically load benchmark dataset for seamless immediate demonstration
        await loadSampleBenchmark('Mall_Customers.csv', 'drop', true);
      } catch (err) {
        console.error('Initial health check failed:', err);
        setIsConnected(false);
      }
    }
    initializeSystem();
  }, []);

  // Upload user file
  const handleUploadFile = async (file, missingStrategy) => {
    setIsLoading(true);
    setGlobalError('');
    try {
      const res = await uploadDataset(file, null, missingStrategy);
      setDatasetInfo({
        filename: res.filename,
        total_rows: res.analysis.total_rows,
        total_cols: res.analysis.total_cols,
        analysis: res.analysis
      });
      setClusterResult(null);
      setInsights(null);
    } catch (err) {
      setGlobalError(err.message || 'File upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Load sample benchmark dataset
  const loadSampleBenchmark = async (sampleId, missingStrategy = 'drop', autoCluster = false) => {
    setIsLoading(true);
    setGlobalError('');
    try {
      const res = await uploadDataset(null, sampleId, missingStrategy);
      const newDatasetInfo = {
        filename: res.filename,
        total_rows: res.analysis.total_rows,
        total_cols: res.analysis.total_cols,
        analysis: res.analysis
      };
      setDatasetInfo(newDatasetInfo);

      // If autoCluster requested, run K-Means on recommended features with K=5
      if (autoCluster && res.analysis.recommended_features.length >= 2) {
        const clusterRes = await runClustering(
          res.analysis.recommended_features.slice(0, 2),
          5,
          'standard'
        );
        setClusterResult(clusterRes);
        setInsights(clusterRes.insights);
      } else {
        setClusterResult(null);
        setInsights(null);
      }
    } catch (err) {
      setGlobalError(err.message || 'Failed to load sample dataset');
    } finally {
      setIsLoading(false);
    }
  };

  // Update state when clustering succeeds
  const handleClusteringComplete = (result) => {
    setClusterResult(result);
    setInsights(result.insights);
  };

  // Restore past analysis from SQLite Database into active dashboard state
  const handleLoadHistoryAnalysis = async (analysisId) => {
    setIsLoading(true);
    setGlobalError('');
    try {
      const res = await loadAnalysisFromHistory(analysisId);
      setClusterResult(res);
      setInsights(res.insights);
      setDatasetInfo({
        filename: res.dataset_filename,
        total_rows: res.total_clustered_count,
        total_cols: res.features.length,
        analysis: {
          total_rows: res.total_clustered_count,
          total_cols: res.features.length,
          columns: res.features,
          numerical_cols: res.features,
          recommended_features: res.features,
          num_stats: {},
          preview_records: res.clustered_data_sample
        }
      });
      setActiveTab('visualizations');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setGlobalError(err.message || 'Failed to restore analysis from SQLite');
    } finally {
      setIsLoading(false);
    }
  };

  // If in landing view, render the dedicated Landing Page
  if (currentView === 'landing') {
    return (
      <LandingPage
        onGetStarted={(targetTab = 'dashboard') => {
          setCurrentView('dashboard');
          if (targetTab) setActiveTab(targetTab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar 
        datasetInfo={datasetInfo} 
        clusterResult={clusterResult} 
        isConnected={isConnected} 
        onGoHome={() => {
          setCurrentView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Global Error Banner if any */}
      {globalError && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{globalError}</span>
          </div>
          <button 
            onClick={() => setGlobalError('')} 
            className="text-rose-500 hover:text-rose-700 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Primary Tab Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            datasetInfo={datasetInfo}
            clusterResult={clusterResult}
            insights={insights}
            onNavigateTab={setActiveTab}
            onLoadSample={(id) => loadSampleBenchmark(id, 'drop', true)}
          />
        )}

        {activeTab === 'upload' && (
          <UploadTab
            datasetInfo={datasetInfo}
            onUploadFile={handleUploadFile}
            onLoadSample={(id, strategy) => loadSampleBenchmark(id, strategy, false)}
            isLoading={isLoading}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisTab
            datasetInfo={datasetInfo}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'segmentation' && (
          <SegmentationTab
            datasetInfo={datasetInfo}
            clusterResult={clusterResult}
            onClusteringComplete={handleClusteringComplete}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'visualizations' && (
          <VisualizationsTab
            clusterResult={clusterResult}
            insights={insights}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsTab
            clusterResult={clusterResult}
            insights={insights}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'records' && (
          <RecordsTab
            clusterResult={clusterResult}
            insights={insights}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            datasetInfo={datasetInfo}
            clusterResult={clusterResult}
            insights={insights}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            onLoadAnalysis={handleLoadHistoryAnalysis}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            Customer Segmentation System Using K-Means Clustering Algorithm
          </p>
          <p className="text-slate-400">
            Major Academic Project &bull; Machine Learning & Business Intelligence
          </p>
        </div>
      </footer>

    </div>
  );
}
