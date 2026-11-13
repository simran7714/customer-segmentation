import React, { useState } from 'react';
import { 
  Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, 
  ArrowRight, RefreshCw, FileText, Database, Layers, Search
} from 'lucide-react';

export default function UploadTab({ 
  datasetInfo, 
  onUploadFile, 
  onLoadSample, 
  isLoading,
  onNavigateTab 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [missingStrategy, setMissingStrategy] = useState('drop');
  const [searchFilter, setSearchFilter] = useState('');
  const [previewPage, setPreviewPage] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0], missingStrategy);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0], missingStrategy);
    }
  };

  const analysis = datasetInfo?.analysis;
  const previewRecords = analysis?.preview_records || [];
  const columnMeta = analysis?.column_meta || {};
  const numStats = analysis?.num_stats || {};

  // Filter preview records
  const filteredPreview = previewRecords.filter(row => {
    if (!searchFilter) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchFilter.toLowerCase())
    );
  });

  const PAGE_SIZE = 5;
  const paginatedPreview = filteredPreview.slice(previewPage * PAGE_SIZE, (previewPage + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dataset Upload & Preprocessing</h2>
          <p className="text-xs text-slate-500">Ingest CSV or Excel customer records, validate schema, and clean missing values.</p>
        </div>

        {/* Missing Value Strategy Picker */}
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <span className="font-semibold text-slate-600">Missing Values:</span>
          <select 
            value={missingStrategy} 
            onChange={(e) => setMissingStrategy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="drop">Drop Missing Rows (Recommended)</option>
            <option value="mean">Impute with Feature Mean</option>
            <option value="median">Impute with Feature Median</option>
          </select>
        </div>
      </div>

      {/* Upload Zone & Quick Sample Loaders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Drag & Drop Upload Zone (2 Columns) */}
        <div className="lg:col-span-2">
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition flex flex-col items-center justify-center min-h-[220px] ${
              dragActive 
                ? 'border-brand-500 bg-brand-50/50' 
                : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          >
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileChange}
              id="file-upload" 
              className="hidden" 
            />

            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Upload className="w-7 h-7" />
            </div>

            <h3 className="font-bold text-base text-slate-900">
              Drag & Drop your customer dataset here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Supports <strong className="text-slate-700">CSV</strong>, <strong className="text-slate-700">XLSX</strong>, and <strong className="text-slate-700">XLS</strong> formats. Data is cleaned and verified automatically.
            </p>

            <label 
              htmlFor="file-upload"
              className="mt-4 cursor-pointer inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition shadow-sm"
            >
              Browse Local File
            </label>

            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="flex items-center space-x-2 text-brand-600 font-semibold text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Validating & Preprocessing Dataset...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pre-packaged Benchmark Datasets (1 Column) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Database className="w-4 h-4 text-brand-600" />
              <span>Bundled Benchmark Datasets</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Test the full clustering pipeline immediately with validated academic datasets.
            </p>

            <div className="mt-4 space-y-3">
              {/* Mall Customers */}
              <div 
                onClick={() => onLoadSample('Mall_Customers.csv', missingStrategy)}
                className="cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-brand-700">
                    Mall Customers Benchmark
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                    200 Rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Age, Annual Income (k$), Spending Score (1-100)
                </p>
              </div>

              {/* Ecommerce RFM */}
              <div 
                onClick={() => onLoadSample('Ecommerce_Customer_Data.csv', missingStrategy)}
                className="cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-brand-700">
                    E-Commerce Multi-Feature Dataset
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                    100 Rows
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Income, Spending Score, Order Frequency, Total Spend
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Click any benchmark above to load instantly into memory.
          </div>
        </div>

      </div>

      {/* Dataset Validation Summary Banner */}
      {datasetInfo && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base text-slate-900">
                  Dataset Successfully Validated: <span className="text-brand-600 font-mono">{datasetInfo.filename}</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Schema validated &bull; {datasetInfo.total_rows.toLocaleString()} instances &bull; {datasetInfo.total_cols} attributes
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('analysis')}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition shadow-sm"
            >
              <span>Explore Data Analytics (EDA)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>

          {/* Validation Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Instances</span>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">{datasetInfo.total_rows.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Numerical Features</span>
              <p className="text-xl font-extrabold text-brand-600 mt-0.5">{analysis?.numerical_cols?.length || 0}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Categorical Attributes</span>
              <p className="text-xl font-extrabold text-indigo-600 mt-0.5">{analysis?.categorical_cols?.length || 0}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Missing Values Cleaned</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-0.5">0 (Clean)</p>
            </div>
          </div>

          {/* Column Metadata Table */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-3">
              Attribute Schema & Descriptive Profile
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Column Name</th>
                    <th className="py-2.5 px-3">Attribute Type</th>
                    <th className="py-2.5 px-3">Role / Status</th>
                    <th className="py-2.5 px-3">Unique Values</th>
                    <th className="py-2.5 px-3">Min</th>
                    <th className="py-2.5 px-3">Mean</th>
                    <th className="py-2.5 px-3">Max</th>
                    <th className="py-2.5 px-3">Skewness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {analysis?.columns?.map((col) => {
                    const meta = columnMeta[col] || {};
                    const stats = numStats[col] || {};
                    const isRec = analysis?.recommended_features?.includes(col);

                    return (
                      <tr key={col} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{col}</td>
                        <td className="py-2.5 px-3 capitalize">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            meta.type === 'numerical' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                          }`}>
                            {meta.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {meta.is_id ? (
                            <span className="text-[11px] font-semibold text-slate-500">Identifier (Excluded)</span>
                          ) : isRec ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              ★ Recommended Feature
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-600">Standard Feature</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono">{meta.unique_count ?? '—'}</td>
                        <td className="py-2.5 px-3 font-mono">{stats.min !== undefined ? stats.min : '—'}</td>
                        <td className="py-2.5 px-3 font-mono">{stats.mean !== undefined ? stats.mean : '—'}</td>
                        <td className="py-2.5 px-3 font-mono">{stats.max !== undefined ? stats.max : '—'}</td>
                        <td className="py-2.5 px-3 font-mono">{stats.skewness !== undefined ? stats.skewness : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Preview Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                Dataset Live Preview (First 15 Records)
              </h4>
              <div className="relative w-48">
                <input 
                  type="text"
                  placeholder="Filter preview..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full text-xs pl-7 pr-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
                  <tr>
                    {analysis?.columns?.map(col => (
                      <th key={col} className="py-2 px-3">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {paginatedPreview.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {analysis?.columns?.map(col => (
                        <td key={col} className="py-2 px-3">{row[col] ?? '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredPreview.length > PAGE_SIZE && (
              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <span>Showing {paginatedPreview.length} of {filteredPreview.length} rows</span>
                <div className="space-x-2">
                  <button 
                    disabled={previewPage === 0}
                    onClick={() => setPreviewPage(p => p - 1)}
                    className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-sans"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={(previewPage + 1) * PAGE_SIZE >= filteredPreview.length}
                    onClick={() => setPreviewPage(p => p + 1)}
                    className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-sans"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
