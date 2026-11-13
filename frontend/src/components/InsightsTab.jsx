import React from 'react';
import { 
  Award, TrendingUp, Users, Target, ShieldAlert, CheckCircle2, 
  Send, Sparkles, AlertCircle, ArrowRight, Lightbulb 
} from 'lucide-react';

export default function InsightsTab({ clusterResult, insights, onNavigateTab }) {
  if (!clusterResult || !insights) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">No Business Insights Available</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Train the K-Means clustering model in the Segmentation tab to generate actionable business intelligence.
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
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Business Insights & Marketing Strategies</h2>
          <p className="text-xs text-slate-500">
            Automated customer profiling, purchasing behavior diagnostics, and targeted engagement tactics.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('reports')}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition shadow-sm self-start sm:self-auto"
        >
          <span>Export Full Analytical Report</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </button>
      </div>

      {/* Strategic Value Summary Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-base">Strategic Customer Portfolio Distribution</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              K-Means has partitioned your customer base into <strong className="text-white">{clusterResult.k} distinct behavioral segments</strong>. Each segment exhibits unique sensitivity to price, promotional incentives, brand prestige, and communication frequency.
            </p>
          </div>
        </div>
      </div>

      {/* Persona Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((ins) => {
          const riskColor = 
            ins.retention_risk === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            ins.retention_risk === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200';

          return (
            <div 
              key={ins.cluster_id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-100 text-brand-800 uppercase tracking-wider">
                        Cluster {ins.cluster_id}
                      </span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${riskColor}`}>
                        {ins.retention_risk} Risk
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-900 mt-2">
                      {ins.persona_name}
                    </h3>
                    <p className="text-xs text-slate-500 italic mt-0.5">{ins.tagline}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900">{ins.percentage}%</span>
                    <span className="block text-[11px] text-slate-500 font-medium">{ins.count} customers</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 text-xs text-slate-700 flex-1">
                
                {/* Characteristics */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                    Behavioral Profile & Spending Habits:
                  </h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    {ins.characteristics}
                  </p>
                </div>

                {/* Demographic Nuance if available */}
                {ins.demographic_note && (
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                      Demographic Pattern:
                    </h4>
                    <p className="text-slate-600 bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100 text-[11px]">
                      {ins.demographic_note}
                    </p>
                  </div>
                )}

                {/* Business Opportunities */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                    Growth Opportunities:
                  </h4>
                  <p className="text-slate-600">
                    {ins.opportunities}
                  </p>
                </div>

                {/* Suggested Marketing Strategies */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-brand-600" />
                    <span>Recommended Marketing Actions:</span>
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {ins.strategies.map((strat, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{strat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Optimal Channels */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center space-x-1.5">
                    <Send className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Target Communication Channels:</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {ins.channels.map((chan, idx) => (
                      <span 
                        key={idx} 
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200 transition"
                      >
                        {chan}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Card Footer: Role */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Strategic Contribution:</span>
                <span className="font-bold text-brand-700">{ins.business_value}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
