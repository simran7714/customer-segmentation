import React, { useState, useEffect } from 'react';
import { 
  Database, History, Calendar, Layers, Sparkles, 
  Download, Printer, Trash2, Edit3, CheckCircle2, 
  ExternalLink, ArrowRight, RefreshCw, AlertCircle, 
  HardDrive, FileSpreadsheet, Eye, Save
} from 'lucide-react';
import { 
  fetchAnalysisHistory, 
  fetchDatabaseStats, 
  deleteAnalysisFromHistory, 
  updateAnalysisNotes,
  getHistoricalExportCsvUrl,
  getHistoricalReportHtmlUrl
} from '../api';

export default function HistoryTab({ onLoadAnalysis, onNavigateTab }) {
  const [history, setHistory] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Load history and stats
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [histRes, statsRes] = await Promise.all([
        fetchAnalysisHistory(),
        fetchDatabaseStats()
      ]);
      setHistory(histRes.history || []);
      setDbStats(statsRes);
    } catch (err) {
      console.error('Failed to load DB history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Delete an analysis
  const handleDelete = async (analysisId, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from SQLite? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteAnalysisFromHistory(analysisId);
      setActionMessage(`Deleted analysis #${analysisId} successfully.`);
      setTimeout(() => setActionMessage(''), 3000);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete record');
    }
  };

  // Start editing title/notes
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditTitle(item.analysis_name);
    setEditNotes(item.notes || '');
  };

  // Save edited title/notes
  const saveEditing = async (analysisId) => {
    try {
      await updateAnalysisNotes(analysisId, editTitle, editNotes);
      setEditingId(null);
      setActionMessage('Analysis notes updated successfully.');
      setTimeout(() => setActionMessage(''), 3000);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update analysis');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <History className="w-5 h-5 text-brand-600" />
            <span>Analysis History & SQLite Database</span>
          </h2>
          <p className="text-xs text-slate-500">
            Persistent local relational database storing datasets, clustering model checkpoints, and business personas.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="inline-flex items-center px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition shadow-sm self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Database Diagnostics Card */}
      {dbStats && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Persistent Database Health & Telemetry
              </h3>
            </div>
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-700">SQLite 3 Online</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Datasets</span>
              <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{dbStats.total_datasets}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Saved Analyses</span>
              <span className="text-xl font-extrabold text-brand-600 mt-0.5 block">{dbStats.total_analyses}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Identified Personas</span>
              <span className="text-xl font-extrabold text-purple-600 mt-0.5 block">{dbStats.total_clusters}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Customer Records</span>
              <span className="text-xl font-extrabold text-indigo-600 mt-0.5 block">{dbStats.total_customer_records.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Database Size</span>
              <span className="text-xl font-extrabold text-slate-900 mt-0.5 block font-mono">{dbStats.file_size_formatted}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-mono truncate max-w-md">
              <strong>Storage Path:</strong> {dbStats.persistent_path}
            </span>
            <span className="text-slate-400">Write-Ahead Logging (WAL) Enabled</span>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
          <Database className="w-4 h-4 text-brand-600" />
          <span>Historical Clustering Runs ({history.length})</span>
        </h3>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-base text-slate-800">No Saved Analyses in SQLite Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Every time you run K-Means clustering, the complete model state, customer records, and persona insights are automatically saved to your persistent SQLite database.
            </p>
            <button
              onClick={() => onNavigateTab('upload')}
              className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-500 transition shadow-sm"
            >
              Upload Dataset & Run First Clustering
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              const isEditing = editingId === item.id;
              const dateStr = new Date(item.created_at).toLocaleString();

              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
                >
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2 mb-2 max-w-lg">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Analysis Name"
                            className="w-full text-sm font-bold px-3 py-1.5 border border-brand-500 rounded-lg focus:outline-none"
                          />
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add research notes or tags..."
                            rows="2"
                            className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEditing(item.id)}
                              className="px-3 py-1 bg-brand-600 text-white text-xs font-semibold rounded hover:bg-brand-500 transition flex items-center space-x-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save Notes</span>
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded hover:bg-slate-200 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                              Analysis #{item.id}
                            </span>
                            <h4 className="font-extrabold text-base text-slate-900">{item.analysis_name}</h4>
                            <button
                              onClick={() => startEditing(item)}
                              title="Edit Title & Research Notes"
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                            <span className="flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {dateStr}
                            </span>
                            <span>&bull;</span>
                            <span className="font-semibold text-slate-700 font-mono">
                              {item.dataset_filename} ({item.dataset_rows} rows)
                            </span>
                            <span>&bull;</span>
                            <span className="capitalize text-slate-600">Scaler: {item.scaler_type}</span>
                          </div>

                          {item.notes && (
                            <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 max-w-2xl italic">
                              "{item.notes}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quality Badges */}
                    <div className="flex sm:flex-col sm:items-end gap-1.5 self-start">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                        <span>K = {item.k_value} Clusters</span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Silhouette: <strong>{item.silhouette_score ?? 'N/A'}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Personas Chips */}
                  {item.clusters_summary && item.clusters_summary.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Identified Segments ({item.clusters_summary.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.clusters_summary.map((c) => (
                          <span 
                            key={c.cluster_id}
                            className="inline-flex items-center text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-1.5" />
                            <span>{c.persona_name}</span>
                            <span className="ml-1 text-slate-400 font-mono">({c.customer_percentage}%)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    
                    {/* Primary Load Button */}
                    <button
                      onClick={() => onLoadAnalysis(item.id)}
                      className="inline-flex items-center px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition shadow-sm shadow-brand-500/20"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      <span>Load into Dashboard & Visualizations</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </button>

                    {/* Secondary Actions */}
                    <div className="flex items-center space-x-2">
                      {/* View Report */}
                      <a
                        href={getHistoricalReportHtmlUrl(item.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition"
                        title="View Saved Report"
                      >
                        <Printer className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        <span>Report</span>
                        <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                      </a>

                      {/* Export CSV */}
                      <a
                        href={getHistoricalExportCsvUrl(item.id)}
                        download
                        className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition"
                        title="Download Clustered Customers"
                      >
                        <Download className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        <span>CSV</span>
                      </a>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item.id, item.analysis_name)}
                        className="p-1.5 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition"
                        title="Delete from SQLite"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
