import React from 'react';
import { 
  FileText, Download, Printer, ExternalLink, AlertTriangle, 
  Lightbulb, Sparkles, CheckCircle2, ShieldCheck, Database, Layers 
} from 'lucide-react';
import { getReportHtmlUrl, getExportCsvUrl, downloadClientCsv, openClientReportWindow } from '../api';

export default function ReportsTab({ datasetInfo, clusterResult, insights, onNavigateTab }) {
  if (!clusterResult || !insights) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">No Analysis Report Available Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Please run the K-Means clustering algorithm in the Segmentation tab to generate the downloadable executive report.
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

  const handleOpenReportWindow = () => {
    openClientReportWindow(clusterResult, datasetInfo?.filename || 'Mall_Customers.csv');
  };

  const handleDownloadCsv = () => {
    if (clusterResult?.clustered_data_sample) {
      downloadClientCsv(clusterResult.clustered_data_sample, `${(datasetInfo?.filename || 'clustered').replace(/\.[^/.]+$/, '')}_segmented.csv`);
    } else {
      window.open(getExportCsvUrl(), '_blank');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analysis Reports & Export Center</h2>
          <p className="text-xs text-slate-500">
            Export publication-ready documentation, executive PDF briefs, and clustered customer datasets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Print / View PDF Report */}
          <button
            onClick={handleOpenReportWindow}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            <span>Open & Print PDF Report</span>
            <ExternalLink className="w-3 h-3 ml-1.5 text-brand-200" />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Download Clustered CSV</span>
          </button>
        </div>
      </div>

      {/* Embedded Live Report Preview Frame */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span className="font-bold text-xs text-slate-800">Executive Report Document Preview</span>
          </div>
          <button
            onClick={handleOpenReportWindow}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center"
          >
            <span>Open in Full Tab</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </button>
        </div>
        <div className="h-[520px] w-full bg-slate-100">
          <iframe
            src={getReportHtmlUrl()}
            title="Analysis Report Preview"
            className="w-full h-full border-0"
          />
        </div>
      </div>

      {/* Methodological Context & Academic Evaluation (Part 11, 12, 13) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Project Limitations (PART 12) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Algorithm Limitations & Assumptions</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Factors to consider when evaluating unsupervised K-Means partitioning.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <span><strong>Data Quality Requirement:</strong> K-Means is heavily sensitive to noisy data, missing features, and extreme distribution skews.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <span><strong>Outlier Sensitivity:</strong> Centroid positions are arithmetic means, causing extreme outliers to pull cluster centers away from true modes.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <span><strong>A-Priori Specification of K:</strong> Requires careful heuristic validation via the Elbow Method (WCSS) and Silhouette Coefficients.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <span><strong>Feature Scaling Dependency:</strong> Unscaled features with larger numeric ranges disproportionately dominate Euclidean distance metrics.</span>
            </li>
          </ul>
        </div>

        {/* Future Enhancements (PART 13) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-brand-600" />
            <span>Future Academic & Industrial Enhancements</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Extending the system architecture into production enterprise platforms.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span><strong>Density-Based & Hierarchical Clustering:</strong> Integrating DBSCAN to isolate arbitrary non-convex clusters and noisy outliers automatically.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span><strong>Streaming Real-Time Segmentation:</strong> Mini-Batch K-Means execution across real-time Kafka / WebSocket user transaction streams.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span><strong>Enterprise CRM Connectors:</strong> Direct bi-directional API synchronisation with Salesforce, HubSpot, and Klaviyo audiences.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <span><strong>AI Next-Best-Action Recommender:</strong> Neural collaborative filtering tailored to each customer segment's purchase probability.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
