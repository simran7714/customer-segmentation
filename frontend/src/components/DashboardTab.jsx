import React from 'react';
import { 
  Users, Layers, DollarSign, TrendingUp, Sparkles, 
  ArrowRight, ShieldAlert, Award, FileText, CheckCircle2,
  PieChart as PieIcon, BarChart3, Database
} from 'lucide-react';

export default function DashboardTab({ 
  datasetInfo, 
  clusterResult, 
  insights, 
  onNavigateTab,
  onLoadSample 
}) {
  const analysis = datasetInfo?.analysis;
  const numStats = analysis?.num_stats || {};

  // Find income and spending keys if present
  const incomeKey = Object.keys(numStats).find(k => k.toLowerCase().includes('income') || k.toLowerCase().includes('salary'));
  const spendKey = Object.keys(numStats).find(k => k.toLowerCase().includes('spend') || k.toLowerCase().includes('score') || k.toLowerCase().includes('amount'));
  const ageKey = Object.keys(numStats).find(k => k.toLowerCase().includes('age'));

  const totalCustomers = datasetInfo ? datasetInfo.total_rows : 0;
  const clusterCount = clusterResult ? clusterResult.k : 0;
  const avgIncome = incomeKey && numStats[incomeKey] ? numStats[incomeKey].mean : null;
  const avgSpend = spendKey && numStats[spendKey] ? numStats[spendKey].mean : null;
  const avgAge = ageKey && numStats[ageKey] ? numStats[ageKey].mean : null;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-brand-200 border border-white/10 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Academic Capstone System &bull; Machine Learning & BI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Customer Segmentation Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Harness Scikit-Learn K-Means Clustering and multidimensional statistical analytics to group customer records into high-impact personas, detect purchasing behaviors, and optimize targeted marketing strategies.
          </p>
          
          <div className="mt-5 flex flex-wrap gap-3">
            {!datasetInfo ? (
              <>
                <button
                  onClick={() => onNavigateTab('upload')}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition shadow-lg shadow-brand-600/30"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Upload Customer Dataset
                </button>
                <button
                  onClick={() => onLoadSample('Mall_Customers.csv')}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm border border-white/20 transition"
                >
                  Load Mall Customers Benchmark
                </button>
              </>
            ) : !clusterResult ? (
              <button
                onClick={() => onNavigateTab('segmentation')}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition shadow-lg shadow-emerald-600/30"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Configure & Run K-Means Clustering
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigateTab('visualizations')}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition shadow-lg"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Explore 2D / 3D Cluster Visualizations
                </button>
                <button
                  onClick={() => onNavigateTab('insights')}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Review Business Personas
                </button>
                <button
                  onClick={() => onNavigateTab('reports')}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm border border-white/20 transition"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export Analysis Report
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Customers */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Customers</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {totalCustomers > 0 ? totalCustomers.toLocaleString() : '—'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {datasetInfo ? `${datasetInfo.filename}` : 'Dataset pending'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Identified Segments */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Identified Segments</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {clusterCount > 0 ? `${clusterCount} Clusters` : 'Not Fitted'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {clusterResult ? `Algorithm: K-Means (k=${clusterCount})` : 'Run segmentation module'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Average Annual Income */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Annual Income</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {avgIncome !== null ? `$${avgIncome.toLocaleString()}k` : '—'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {incomeKey ? incomeKey : 'Calculated across cohort'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Average Spending Score / Performance */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Spending Score</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {avgSpend !== null ? `${avgSpend} / 100` : '—'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {clusterResult ? `Silhouette: ${clusterResult.silhouette_score}` : (spendKey || 'Cohort baseline')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Cluster Overview if available */}
      {clusterResult && insights && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Identified Customer Segments Overview</h2>
              <p className="text-xs text-slate-500">Actionable business personas derived from cluster centroids</p>
            </div>
            <button
              onClick={() => onNavigateTab('insights')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center"
            >
              View Full Insights Engine <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((ins) => (
              <div 
                key={ins.cluster_id} 
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Cluster {ins.cluster_id}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      ins.retention_risk === 'Low' ? 'bg-emerald-50 text-emerald-700' :
                      ins.retention_risk === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {ins.retention_risk} Risk
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 mt-2 text-base">{ins.persona_name}</h3>
                  <p className="text-xs text-slate-500 italic mt-0.5">{ins.tagline}</p>

                  <div className="mt-3 text-xs text-slate-600 line-clamp-3">
                    {ins.characteristics}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{ins.count} Customers</span>
                  <span className="font-bold text-brand-600">{ins.percentage}% Share</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Machine Learning Methodology & Architecture Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-1">System Architecture & Workflow Pipeline</h3>
        <p className="text-xs text-slate-500 mb-6">End-to-end Machine Learning customer intelligence lifecycle</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          
          <div 
            onClick={() => onNavigateTab('upload')}
            className="cursor-pointer p-4 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition text-center group"
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs group-hover:scale-110 transition">
              1
            </div>
            <h4 className="font-bold text-xs text-slate-800 mt-2">Data Ingestion</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">CSV/Excel parsing & cleaning</p>
          </div>

          <div 
            onClick={() => onNavigateTab('analysis')}
            className="cursor-pointer p-4 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition text-center group"
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs group-hover:scale-110 transition">
              2
            </div>
            <h4 className="font-bold text-xs text-slate-800 mt-2">EDA & Stats</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Distributions & Correlations</p>
          </div>

          <div 
            onClick={() => onNavigateTab('segmentation')}
            className="cursor-pointer p-4 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition text-center group"
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs group-hover:scale-110 transition">
              3
            </div>
            <h4 className="font-bold text-xs text-slate-800 mt-2">Elbow Method</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">WCSS & Optimal K Detection</p>
          </div>

          <div 
            onClick={() => onNavigateTab('segmentation')}
            className="cursor-pointer p-4 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition text-center group"
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs group-hover:scale-110 transition">
              4
            </div>
            <h4 className="font-bold text-xs text-slate-800 mt-2">K-Means Fit</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Scaling & Centroids</p>
          </div>

          <div 
            onClick={() => onNavigateTab('visualizations')}
            className="cursor-pointer p-4 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition text-center group"
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs group-hover:scale-110 transition">
              5
            </div>
            <h4 className="font-bold text-xs text-slate-800 mt-2">Visualizations</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">2D/3D Scatter & Radar</p>
          </div>

          <div 
            onClick={() => onNavigateTab('insights')}
            className="cursor-pointer p-4 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 transition text-center group"
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs group-hover:scale-110 transition">
              6
            </div>
            <h4 className="font-bold text-xs text-slate-800 mt-2">Business Insights</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Personas & Targeting</p>
          </div>

        </div>
      </div>

    </div>
  );
}
