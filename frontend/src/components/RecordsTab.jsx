import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Download, ArrowUpDown, ChevronLeft, 
  ChevronRight, AlertCircle, FileSpreadsheet, Users 
} from 'lucide-react';
import { getExportCsvUrl } from '../api';

export default function RecordsTab({ clusterResult, insights, onNavigateTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const clusteredData = clusterResult?.clustered_data_sample || [];
  const columns = clusteredData.length > 0 ? Object.keys(clusteredData[0]) : [];

  // Sort and Filter logic
  const filteredData = useMemo(() => {
    return clusteredData.filter((row) => {
      // Cluster filter
      if (clusterFilter !== 'all' && row['Cluster'] !== parseInt(clusterFilter)) {
        return false;
      }
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return Object.values(row).some(val => 
          String(val).toLowerCase().includes(query)
        );
      }
      return true;
    }).sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc' 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [clusteredData, clusterFilter, searchTerm, sortField, sortDirection]);

  // Pagination slice
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (col) => {
    if (sortField === col) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(col);
      setSortDirection('asc');
    }
  };

  if (!clusterResult) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">No Clustered Customer Records</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Train the K-Means clustering model in the Segmentation tab to generate customer labels and explorer data.
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
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Customer Records Explorer</h2>
          <p className="text-xs text-slate-500">
            Search, sort, filter, and inspect individual customer records with their machine-assigned cluster segment.
          </p>
        </div>

        {/* CSV Export Button */}
        <a
          href={getExportCsvUrl()}
          download
          className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          <span>Export Clustered Dataset (CSV)</span>
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by ID or attribute value..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Cluster filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="font-semibold text-slate-500">Segment:</span>
            <select
              value={clusterFilter}
              onChange={(e) => {
                setClusterFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="all">All Segments</option>
              {clusterResult.cluster_profiles.map(p => {
                const ins = insights?.find(i => i.cluster_id === p.cluster_id);
                return (
                  <option key={p.cluster_id} value={p.cluster_id}>
                    Cluster {p.cluster_id} ({ins ? ins.persona_name : 'Segment'})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Page Size */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="font-semibold text-slate-500">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                {columns.map((col) => (
                  <th 
                    key={col} 
                    onClick={() => handleSort(col)}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                ))}
                <th className="py-3 px-4">Assigned Persona</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => {
                  const cid = row['Cluster'];
                  const ins = insights?.find(i => i.cluster_id === cid);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      {columns.map(col => {
                        const val = row[col];
                        const isClusterCol = col === 'Cluster';

                        return (
                          <td key={col} className="py-3 px-4">
                            {isClusterCol ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-800">
                                Cluster {val}
                              </span>
                            ) : (
                              <span>{val !== null ? String(val) : '—'}</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-3 px-4 font-sans">
                        <span className="font-semibold text-slate-900 text-xs">
                          {ins ? ins.persona_name : `Segment ${cid}`}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400 font-sans">
                    No customer records matched your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
