import React from 'react';
import { Target, Layers, Database, Sparkles, CheckCircle2, AlertCircle, Home } from 'lucide-react';

export default function Navbar({ datasetInfo, clusterResult, isConnected, onGoHome }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Project Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={onGoHome}
            title="Return to Landing Page"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  Customer<span className="text-brand-600">Segmentation</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  K-Means ML
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                "Understand Your Customers. Discover Business Opportunities."
              </p>
            </div>
          </div>

          {/* Right Status Information */}
          <div className="flex items-center space-x-3 text-sm">
            {/* Back to Home Button */}
            <button
              onClick={onGoHome}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
              title="Return to Landing Page"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>

            {/* Backend Connectivity Status */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="hidden md:inline">{isConnected ? 'ML Engine Online' : 'Connecting Engine...'}</span>
            </div>

            {/* SQLite DB Status Badge */}
            <div 
              className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
              title="Persistent SQLite Local Database"
            >
              <Database className="w-3 h-3 text-emerald-600" />
              <span>SQLite Persistent</span>
            </div>

            {/* Current Loaded Dataset Info */}
            {datasetInfo ? (
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-lg bg-brand-50 border border-brand-200 text-brand-900 text-xs">
                <Database className="w-3.5 h-3.5 text-brand-600" />
                <span className="font-semibold truncate max-w-[150px]">{datasetInfo.filename}</span>
                <span className="text-brand-400">&bull;</span>
                <span>{datasetInfo.total_rows.toLocaleString()} Records</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>No dataset uploaded</span>
              </div>
            )}

            {/* Clustering Status Badge */}
            {clusterResult && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{clusterResult.k} Segments Fitted</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
