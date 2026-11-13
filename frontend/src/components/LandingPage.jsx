import React, { useState, useEffect } from 'react';
import LightTunnel from './LightTunnel';
import { 
  Target, Layers, BarChart3, Database, Sparkles, Cpu, 
  PieChart as PieIcon, TrendingUp, Users, ArrowRight, 
  ChevronRight, CheckCircle2, ShieldCheck, FileText, 
  Activity, Code2, ExternalLink, Zap, Compass, 
  HelpCircle, Mail, DollarSign, Award, ChevronDown,
  Sun, Moon
} from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cs_landing_theme');
    return saved || 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('cs_landing_theme', next);
  };

  const isDark = theme === 'dark';
  const [heroVisualMode, setHeroVisualMode] = useState('tunnel'); // 'tunnel' or 'scatter'

  return (
    <div className={`min-h-screen font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#070B14] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Background Ambient Glows */}
      <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-300 ${
        isDark ? 'bg-brand-600/15 opacity-100' : 'bg-brand-500/10 opacity-70'
      }`} />
      <div className={`absolute top-[20%] right-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-300 ${
        isDark ? 'bg-purple-600/15 opacity-100' : 'bg-purple-500/10 opacity-70'
      }`} />
      <div className={`absolute top-[50%] left-10 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none transition-opacity duration-300 ${
        isDark ? 'bg-cyan-600/10 opacity-100' : 'bg-cyan-500/10 opacity-60'
      }`} />
      <div className={`absolute bottom-10 right-1/4 w-[700px] h-[700px] rounded-full blur-[180px] pointer-events-none transition-opacity duration-300 ${
        isDark ? 'bg-indigo-600/15 opacity-100' : 'bg-indigo-500/10 opacity-60'
      }`} />

      {/* ========================================================================= */}
      {/* A. NAVIGATION BAR                                                         */}
      {/* ========================================================================= */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-[#070B14]/85 border-white/[0.08]' 
          : 'bg-white/90 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-extrabold text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Customer<span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">Segmentation</span>
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    isDark 
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' 
                      : 'bg-brand-50 text-brand-700 border border-brand-200'
                  }`}>
                    ML 2.0
                  </span>
                </div>
                <p className={`text-[11px] font-medium hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  K-Means Clustering Intelligence System
                </p>
              </div>
            </div>

            {/* Nav Links */}
            <div className={`hidden md:flex items-center space-x-8 text-sm font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <a href="#about" className={`hover:text-brand-500 transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>About</a>
              <a href="#features" className={`hover:text-brand-500 transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Features</a>
              <a href="#how-it-works" className={`hover:text-brand-500 transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>How It Works</a>
              <a href="#segments" className={`hover:text-brand-500 transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Segments</a>
              <a href="#technology" className={`hover:text-brand-500 transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Technology</a>
              <a href="#contact" className={`hover:text-brand-500 transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Contact</a>
            </div>

            {/* Right Controls: Theme Toggle & Launch CTA */}
            <div className="flex items-center space-x-3">
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                  isDark
                    ? 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
                )}
              </button>

              {/* Launch CTA */}
              <button
                onClick={() => onGetStarted('dashboard')}
                className="relative group inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm text-white overflow-hidden shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 group-hover:from-brand-500 group-hover:to-purple-500 transition-all duration-300" />
                <span className="relative flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* B. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full backdrop-blur-md mb-6 animate-pulse border ${
              isDark
                ? 'bg-white/[0.05] border-white/10 text-slate-300'
                : 'bg-brand-50/80 border-brand-200 text-brand-800'
            }`}>
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                Machine Learning &bull; Data Analytics &bull; Business Intelligence
              </span>
            </div>

            {/* Main Headline */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Understand Your Customers.{' '}
              <span className="bg-gradient-to-r from-brand-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Discover Business Opportunities.
              </span>
            </h1>

            {/* Description */}
            <p className={`mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Transform raw customer transaction records into actionable business intelligence using the <strong>K-Means Clustering Algorithm</strong>. Automatically identify customer patterns, uncover valuable segments, and make smarter, data-driven decisions.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onGetStarted('dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <a
                href="#features"
                className={`w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-semibold text-sm backdrop-blur-md transition-all border ${
                  isDark
                    ? 'text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] border-white/10 hover:border-white/20'
                    : 'text-slate-700 bg-white hover:bg-slate-100 border-slate-300 shadow-sm'
                }`}
              >
                Explore Features
              </a>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
              <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>100%</span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Automated ML Clustering</p>
              </div>

              <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className="text-2xl font-black text-brand-500">Elbow & Silhouette</span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Optimal K Validation</p>
              </div>

              <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className="text-2xl font-black text-purple-500">2D & 3D</span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Interactive Visualizations</p>
              </div>

              <div className={`p-4 rounded-xl border backdrop-blur-sm ${
                isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className="text-2xl font-black text-emerald-500">Actionable</span>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Business Persona Tactics</p>
              </div>
            </div>

          </div>

          {/* Hero Clustering Scatter & Mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className={`absolute inset-0 rounded-3xl blur-2xl -z-10 ${
              isDark ? 'bg-gradient-to-t from-brand-600/20 via-purple-600/10 to-transparent' : 'bg-brand-500/10'
            }`} />
            
            <div className={`rounded-2xl border shadow-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-2xl transition-colors ${
              isDark 
                ? 'bg-slate-900/90 border-white/15' 
                : 'bg-white border-slate-200'
            }`}>
              
              {/* Window Header */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 mb-6 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className={`ml-2 text-xs font-mono hidden sm:inline ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    kmeans_clustering_engine.py &bull; 5 Identified Clusters &bull; WCSS Converged
                  </span>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center p-1 rounded-xl border ${
                    isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-300'
                  }`}>
                    <button
                      onClick={() => setHeroVisualMode('tunnel')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                        heroVisualMode === 'tunnel'
                          ? 'bg-brand-600 text-white shadow'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>3D Vector Tunnel (WebGL)</span>
                    </button>
                    <button
                      onClick={() => setHeroVisualMode('scatter')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                        heroVisualMode === 'scatter'
                          ? 'bg-brand-600 text-white shadow'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>2D Centroid Space</span>
                    </button>
                  </div>

                  <div className={`hidden md:flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-lg border ${
                    isDark ? 'text-slate-400 border-white/10 bg-white/[0.02]' : 'text-slate-600 border-slate-200 bg-slate-50'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Optimal K: 5 &bull; Silhouette: 0.553</span>
                  </div>
                </div>
              </div>

              {/* View Content */}
              {heroVisualMode === 'tunnel' ? (
                /* 3D WebGL Neural LightTunnel View */
                <div className="space-y-6">
                  <div className={`relative rounded-2xl overflow-hidden border shadow-inner ${
                    isDark ? 'border-white/10 bg-black/60' : 'border-slate-300 bg-slate-900'
                  }`}>
                    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
                      <LightTunnel
                        cableColor={isDark ? "#ffffff" : "#4338ca"}
                        pulseColor={isDark ? "#ffffff" : "#6366f1"}
                        cableCount={56}
                        pulseDensity={0.5}
                        flowDirection="inward"
                        mouseInteraction
                        clickSurge
                        tunnelColor={isDark ? "#ffffff" : "#0f172a"}
                        tunnelOpacity={0}
                        speed={0.1}
                        pulseSpeed={2}
                        pulseLength={0.28}
                        pulseBlend={0.6}
                        pulseWidth={1}
                        thickness={0.35}
                        rimWidth={0.15}
                        waviness={0.3}
                        sway={0.5}
                        bend={0.4}
                        glow={1}
                        size={1}
                        fadeNear={0.5}
                        fadeFar={2}
                        brightness={1}
                        colorVariance
                        grain={false}
                        mouseStrength={0.1}
                        intro
                        lightMode={!isDark}
                      />
                    </div>

                    {/* HUD Top Info Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between pointer-events-none gap-2 z-10">
                      <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg ${
                        isDark 
                          ? 'bg-slate-950/75 text-white border-white/15' 
                          : 'bg-white/90 text-slate-900 border-slate-300'
                      }`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                        <span>Interactive High-Dimensional Customer Vector Tunnel</span>
                      </div>

                      <div className={`hidden sm:flex items-center space-x-3 px-3.5 py-1.5 rounded-full text-[11px] font-mono backdrop-blur-md border shadow-lg ${
                        isDark 
                          ? 'bg-slate-950/75 text-slate-300 border-white/15' 
                          : 'bg-white/90 text-slate-700 border-slate-300'
                      }`}>
                        <span className="text-cyan-400 font-semibold">Hover to Steer</span>
                        <span className="text-slate-500">&bull;</span>
                        <span className="text-amber-400 font-semibold">Click for Data Surge</span>
                      </div>
                    </div>

                    {/* HUD Bottom Info Overlay */}
                    <div className={`absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between px-4 py-2.5 rounded-xl backdrop-blur-md border pointer-events-none text-xs z-10 ${
                      isDark 
                        ? 'bg-slate-950/80 border-white/15 text-slate-300' 
                        : 'bg-white/95 border-slate-200 text-slate-800 shadow-md'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-brand-400">Multi-Feature Vectors:</span>
                        <span className="hidden md:inline">Annual Income (k$) &bull; Spending Score &bull; Purchase Frequency &bull; Customer Age</span>
                        <span className="md:hidden">Income &bull; Score &bull; Frequency</span>
                      </div>
                      <div className="font-mono text-[11px] text-emerald-400 font-bold flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>K=5 Centroid Convergence Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Below-tunnel Quick Controls & Insights Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl border ${
                      isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Algorithm
                        </span>
                        <span className="text-[10px] font-mono text-brand-400 font-semibold">k-means++</span>
                      </div>
                      <h4 className={`font-extrabold text-sm mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Lloyd's Iterative Solver
                      </h4>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Calculates Euclidean distance across multi-dimensional customer features to converge on optimal cluster centroids.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border ${
                      isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Optimal Centroids
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold">Silhouette 0.553</span>
                      </div>
                      <h4 className={`font-extrabold text-sm mt-1 text-emerald-400`}>
                        K = 5 Distinct Segments
                      </h4>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Verified mathematically with Elbow Method WCSS minimum inflection and Silhouette cluster cohesion metrics.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                      isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Live Action
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <h4 className={`font-extrabold text-sm mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Launch Segmentation
                        </h4>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Upload real customer data and partition cohorts in seconds.
                        </p>
                      </div>
                      <button
                        onClick={() => onGetStarted('segmentation')}
                        className="mt-3 w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2"
                      >
                        <span>Start Clustering</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Graphic Clustering Scatter Canvas Visual */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  
                  {/* 2D Illustrative Multi-Cluster Visual Canvas */}
                  <div className={`lg:col-span-2 relative rounded-xl border p-5 overflow-hidden ${
                    isDark 
                      ? 'bg-[#060A12] border-white/10' 
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Customer Multi-Cluster Scatter Space (Annual Income vs Spending Score)
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isDark 
                          ? 'text-brand-400 bg-brand-500/10 border-brand-500/20' 
                          : 'text-brand-700 bg-brand-50 border-brand-200'
                      }`}>
                        Live Centroid Preview
                      </span>
                    </div>

                    {/* SVG Cluster Plot */}
                    <svg viewBox="0 0 500 280" className="w-full h-64 overflow-visible">
                      <defs>
                        <radialGradient id="gradCluster0" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="gradCluster1" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="gradCluster2" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="gradCluster3" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                        </radialGradient>
                        <radialGradient id="gradCluster4" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
                        </radialGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="40" y2="250" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="40" y1="250" x2="480" y2="250" stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />
                      <line x1="40" y1="135" x2="480" y2="135" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="1" strokeDasharray="3 3" />
                      <line x1="260" y1="20" x2="260" y2="250" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="1" strokeDasharray="3 3" />

                      {/* Axis Labels */}
                      <text x="250" y="272" fill={isDark ? '#64748b' : '#475569'} fontSize="10" textAnchor="middle" fontWeight="600">Annual Income (k$) &rarr;</text>
                      <text x="18" y="140" fill={isDark ? '#64748b' : '#475569'} fontSize="10" transform="rotate(-90 18,140)" textAnchor="middle" fontWeight="600">Spending Score &rarr;</text>

                      {/* Cluster 0: Moderate Balancers (Middle) */}
                      <circle cx="260" cy="135" r="45" fill="url(#gradCluster0)" />
                      <circle cx="250" cy="130" r="3.5" fill="#818cf8" />
                      <circle cx="270" cy="140" r="4" fill="#818cf8" />
                      <circle cx="240" cy="145" r="3" fill="#818cf8" />
                      <circle cx="275" cy="125" r="3.5" fill="#818cf8" />
                      <circle cx="255" cy="150" r="3" fill="#818cf8" />
                      {/* Centroid 0 */}
                      <polygon points="260,130 265,135 260,140 255,135" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />

                      {/* Cluster 1: VIP Affluent (Top Right) */}
                      <circle cx="400" cy="60" r="45" fill="url(#gradCluster1)" />
                      <circle cx="390" cy="50" r="4" fill="#34d399" />
                      <circle cx="410" cy="70" r="3.5" fill="#34d399" />
                      <circle cx="420" cy="55" r="3" fill="#34d399" />
                      <circle cx="385" cy="65" r="3.5" fill="#34d399" />
                      <circle cx="405" cy="45" r="4" fill="#34d399" />
                      {/* Centroid 1 */}
                      <polygon points="400,55 405,60 400,65 395,60" fill="#ffffff" stroke="#10b981" strokeWidth="2" />

                      {/* Cluster 2: Aspirational (Top Left) */}
                      <circle cx="110" cy="60" r="45" fill="url(#gradCluster2)" />
                      <circle cx="100" cy="55" r="3.5" fill="#fbbf24" />
                      <circle cx="120" cy="70" r="4" fill="#fbbf24" />
                      <circle cx="95" cy="65" r="3" fill="#fbbf24" />
                      <circle cx="125" cy="50" r="3.5" fill="#fbbf24" />
                      {/* Centroid 2 */}
                      <polygon points="110,55 115,60 110,65 105,60" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />

                      {/* Cluster 3: Cautious Savers (Bottom Right) */}
                      <circle cx="400" cy="205" r="45" fill="url(#gradCluster3)" />
                      <circle cx="390" cy="215" r="3.5" fill="#22d3ee" />
                      <circle cx="415" cy="195" r="4" fill="#22d3ee" />
                      <circle cx="380" cy="200" r="3" fill="#22d3ee" />
                      <circle cx="420" cy="210" r="3.5" fill="#22d3ee" />
                      {/* Centroid 3 */}
                      <polygon points="400,200 405,205 400,210 395,205" fill="#ffffff" stroke="#06b6d4" strokeWidth="2" />

                      {/* Cluster 4: Budget Seekers (Bottom Left) */}
                      <circle cx="110" cy="205" r="45" fill="url(#gradCluster4)" />
                      <circle cx="105" cy="195" r="3.5" fill="#f472b6" />
                      <circle cx="120" cy="215" r="4" fill="#f472b6" />
                      <circle cx="95" cy="210" r="3" fill="#f472b6" />
                      <circle cx="125" cy="200" r="3" fill="#f472b6" />
                      {/* Centroid 4 */}
                      <polygon points="110,200 115,205 110,210 105,205" fill="#ffffff" stroke="#ec4899" strokeWidth="2" />
                    </svg>

                    {/* Legend Footer */}
                    <div className={`flex flex-wrap items-center justify-between text-[11px] pt-2 border-t ${
                      isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-600'
                    }`}>
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        <span>VIP Spenders</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        <span>Aspirational</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                        <span>Cautious Savers</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" />
                        <span>Budget Seekers</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                        <span>Core Balancers</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Interactive Actions & Real-Time Stats */}
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${
                      isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>Algorithm Pipeline</span>
                      <h4 className={`font-extrabold text-sm mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Lloyd's K-Means ++
                      </h4>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Optimizes Within-Cluster Sum of Squares (WCSS) to partition customers into distinct behavioral centroids.
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border ${
                      isDark ? 'bg-white/[0.04] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>Optimal K Selection</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-bold text-emerald-500">K = 5 Clusters</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded border font-mono ${
                          isDark 
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                            : 'text-emerald-700 bg-emerald-50 border-emerald-200 font-semibold'
                        }`}>
                          Elbow Verified
                        </span>
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Detected via maximum second-derivative knee projection.
                      </p>
                    </div>

                    <button
                      onClick={() => onGetStarted('segmentation')}
                      className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2"
                    >
                      <span>Run Clustering Engine</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* C. ABOUT SECTION                                                          */}
      {/* ========================================================================= */}
      <section id="about" className={`py-24 border-t transition-colors ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${
                isDark 
                  ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' 
                  : 'bg-brand-50 text-brand-700 border-brand-200'
              }`}>
                <Compass className="w-3.5 h-3.5" />
                <span>Unsupervised Machine Learning for Enterprise</span>
              </div>

              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Turn Customer Data Into <br />
                <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
                  Business Intelligence
                </span>
              </h2>

              <p className={`mt-4 text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                In modern commerce, treating all customers identically leads to wasted marketing budgets and missed conversion opportunities. Traditional demographic filters rely on subjective rules of thumb that fail to capture subtle multi-feature correlations.
              </p>

              <p className={`mt-3 text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Our <strong>Customer Segmentation System</strong> leverages the mathematical rigor of <strong>K-Means Clustering</strong> to discover natural groupings without supervision. By evaluating vectors of income, spending tendencies, and demographic characteristics, the system uncovers distinct behavioral personas with precision.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Objective Grouping</h4>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Minimizes intra-cluster variance using Euclidean distance geometry.</p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <CheckCircle2 className="w-5 h-5 text-brand-500 mb-2" />
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Automated Personas</h4>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Assigns actionable business personas and marketing strategies dynamically.</p>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className={`rounded-2xl p-6 sm:p-8 border backdrop-blur-md ${
              isDark 
                ? 'bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/10' 
                : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}>
              <h3 className={`font-extrabold text-lg mb-2 flex items-center space-x-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Award className="w-5 h-5 text-purple-500" />
                <span>The Value of Machine Learning Segmentation</span>
              </h3>
              <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                How algorithmic customer classification outclasses manual cohort heuristics.
              </p>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  isDark ? 'bg-[#090D18] border-white/[0.06]' : 'bg-white border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Precision Targeting</h5>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Direct luxury offerings exclusively to high-income affluent spenders while presenting budget promotions to value-sensitive customers.
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  isDark ? 'bg-[#090D18] border-white/[0.06]' : 'bg-white border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Optimized Customer Lifetime Value</h5>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Identify high-income conservative savers and activate targeted incentive campaigns to unlock dormant spending power.
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                  isDark ? 'bg-[#090D18] border-white/[0.06]' : 'bg-white border-slate-200'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Reduced Churn via Proactive Retention</h5>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Continuously track cluster health and flag at-risk segments before customer attrition impacts bottom-line revenues.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* D. FEATURES SECTION                                                       */}
      {/* ========================================================================= */}
      <section id="features" className={`py-24 border-t transition-colors ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${
              isDark 
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              <Zap className="w-3.5 h-3.5" />
              <span>Full-Stack Machine Learning Capabilities</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Engineered for Comprehensive Analytics
            </h2>
            <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Every tool required to ingest, analyze, cluster, and translate raw data into profitable decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 group ${
              isDark 
                ? 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-brand-500/30' 
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-lg transition-colors ${
                isDark ? 'text-white group-hover:text-brand-300' : 'text-slate-900 group-hover:text-brand-600'
              }`}>
                Customer Data Analysis
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Ingest CSV and Excel files with automated schema detection, missing value imputation (Mean, Median, or Drop), and descriptive parametric statistics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 group ${
              isDark 
                ? 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-purple-500/30' 
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-lg transition-colors ${
                isDark ? 'text-white group-hover:text-purple-300' : 'text-slate-900 group-hover:text-purple-600'
              }`}>
                Intelligent Customer Segmentation
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Partition customer records dynamically based on multidimensional feature vectors without prior label requirements or hardcoded thresholds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 group ${
              isDark 
                ? 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-cyan-500/30' 
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-lg transition-colors ${
                isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-cyan-600'
              }`}>
                K-Means Clustering & Elbow Method
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Scientific determination of optimal cluster count ($K$) using Within-Cluster Sum of Squares (WCSS) and Silhouette Coefficient curves with knee detection.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 group ${
              isDark 
                ? 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-emerald-500/30' 
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-lg transition-colors ${
                isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-600'
              }`}>
                Interactive Data Visualization
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Immersive 2D projections with marked cluster centroids (◆) alongside full 360-degree rotating 3D WebGL spatial models and profile radar charts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 group ${
              isDark 
                ? 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-amber-500/30' 
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-lg transition-colors ${
                isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-600'
              }`}>
                Customer Behaviour Analysis
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Analyze income vs spending elasticity, purchasing frequency, age-demographic patterns, and inter-attribute Pearson correlation matrices.
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 group ${
              isDark 
                ? 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-rose-500/30' 
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:shadow-md'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className={`font-bold text-lg transition-colors ${
                isDark ? 'text-white group-hover:text-rose-300' : 'text-slate-900 group-hover:text-rose-600'
              }`}>
                Business Insights and Reports
              </h3>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Generate downloadable executive analytical reports formatted for PDF printing, export clustered CSV datasets, and receive tailored marketing actions.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* E. HOW IT WORKS SECTION                                                   */}
      {/* ========================================================================= */}
      <section id="how-it-works" className={`py-24 border-t transition-colors ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${
              isDark 
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                : 'bg-cyan-50 text-cyan-700 border-cyan-200'
            }`}>
              <Layers className="w-3.5 h-3.5" />
              <span>Step-by-Step Architecture</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              How the Segmentation Pipeline Works
            </h2>
            <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              A systematic 6-stage machine learning workflow from raw file upload to strategic commercial deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark ? 'bg-[#090E1A] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-500 font-extrabold text-xs flex items-center justify-center mb-4 ring-1 ring-brand-500/40">
                01
              </div>
              <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Upload Customer Dataset</h4>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Ingest your customer database via drag-and-drop CSV or Excel (.xlsx) file, or load pre-packaged benchmark datasets with 1-click.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark ? 'bg-[#090E1A] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 font-extrabold text-xs flex items-center justify-center mb-4 ring-1 ring-indigo-500/40">
                02
              </div>
              <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Data Preprocessing</h4>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Automated identification of customer ID columns, handling missing values via imputation or removal, and removing duplicate entries.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark ? 'bg-[#090E1A] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 font-extrabold text-xs flex items-center justify-center mb-4 ring-1 ring-purple-500/40">
                03
              </div>
              <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Feature Selection & Scaling</h4>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Select relevant behavioral features (Annual Income, Spending Score, Age) and apply normalization (`StandardScaler` or `MinMaxScaler`).
              </p>
            </div>

            {/* Step 4 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark ? 'bg-[#090E1A] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 font-extrabold text-xs flex items-center justify-center mb-4 ring-1 ring-cyan-500/40">
                04
              </div>
              <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>K-Means Clustering & Elbow</h4>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Execute Elbow Method to observe inertia drop, identify optimal elbow point, and initialize centroids using `k-means++`.
              </p>
            </div>

            {/* Step 5 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark ? 'bg-[#090E1A] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 font-extrabold text-xs flex items-center justify-center mb-4 ring-1 ring-emerald-500/40">
                05
              </div>
              <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Customer Segmentation</h4>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Convergence of centroids, label assignment to all customer rows, and interactive 2D / 3D spatial visualization.
              </p>
            </div>

            {/* Step 6 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark ? 'bg-[#090E1A] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 font-extrabold text-xs flex items-center justify-center mb-4 ring-1 ring-rose-500/40">
                06
              </div>
              <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Business Insights & Reports</h4>
              <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Generate strategic marketing tactics, assess customer retention risk, review persona archetypes, and export printable PDF reports.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* F. CUSTOMER SEGMENTS PREVIEW                                              */}
      {/* ========================================================================= */}
      <section id="segments" className={`py-24 border-t transition-colors ${
        isDark ? 'border-white/[0.08] bg-white/[0.01]' : 'border-slate-200 bg-slate-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${
              isDark 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <Users className="w-3.5 h-3.5" />
              <span>Persona Archetypes</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Customer Segments Preview
            </h2>
            <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Illustrative customer personas identified across income and spending dimensions.
            </p>
          </div>

          {/* Illustrative Preview Notice Banner */}
          <div className={`mb-10 p-4 rounded-xl text-xs flex items-center justify-center space-x-2 max-w-3xl mx-auto text-center border ${
            isDark 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' 
              : 'bg-amber-50 border-amber-200 text-amber-900 font-medium'
          }`}>
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Illustrative Preview:</strong> The cards below demonstrate representative archetypes. Actual segment boundaries and percentages will dynamically compute from your uploaded dataset.
            </span>
          </div>

          {/* 5 Archetype Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Persona 1 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark 
                ? 'bg-gradient-to-b from-white/[0.05] to-transparent border-emerald-500/20' 
                : 'bg-white border-emerald-200 shadow-sm'
            }`}>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider mb-3">
                High Value Segment
              </span>
              <h4 className={`font-extrabold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                VIP / Affluent Spenders
              </h4>
              <p className={`text-xs italic mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                High Income &bull; High Spending
              </p>
              <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Customers with elevated financial resources and active purchasing velocity. They value brand prestige, early collection access, concierge service, and premium experiences over discounts.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Strategy: VIP Loyalty Programs & Bespoke Concierge
              </div>
            </div>

            {/* Persona 2 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark 
                ? 'bg-gradient-to-b from-white/[0.05] to-transparent border-cyan-500/20' 
                : 'bg-white border-cyan-200 shadow-sm'
            }`}>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 uppercase tracking-wider mb-3">
                Untapped Potential
              </span>
              <h4 className={`font-extrabold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Cautious Savers
              </h4>
              <p className={`text-xs italic mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                High Income &bull; Low Spending
              </p>
              <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Financially affluent patrons who maintain disciplined, conservative spending habits. They evaluate utility, warranties, and longevity before committing to transactions.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">
                Strategy: Value-Centric Educational Proof & Guarantees
              </div>
            </div>

            {/* Persona 3 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark 
                ? 'bg-gradient-to-b from-white/[0.05] to-transparent border-amber-500/20' 
                : 'bg-white border-amber-200 shadow-sm'
            }`}>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wider mb-3">
                High Velocity Volume
              </span>
              <h4 className={`font-extrabold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Aspirational Trend-Seekers
              </h4>
              <p className={`text-xs italic mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Low Income &bull; High Spending
              </p>
              <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Younger, trend-responsive buyers who allocate a high percentage of discretionary income toward lifestyle and viral collections.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                Strategy: Flexible BNPL Financing & Flash Drops
              </div>
            </div>

            {/* Persona 4 */}
            <div className={`p-6 rounded-2xl border relative ${
              isDark 
                ? 'bg-gradient-to-b from-white/[0.05] to-transparent border-slate-500/20' 
                : 'bg-white border-slate-300 shadow-sm'
            }`}>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/30 uppercase tracking-wider mb-3">
                Price Sensitive
              </span>
              <h4 className={`font-extrabold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Budget-Conscious Seekers
              </h4>
              <p className={`text-xs italic mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Low Income &bull; Low Spending
              </p>
              <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Frugal buyers focused on essential utility and bargain opportunities. Highly responsive to discount coupons and bundle clearances.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                Strategy: Bundle Promotions & Referral Rewards
              </div>
            </div>

            {/* Persona 5 */}
            <div className={`p-6 rounded-2xl border relative lg:col-span-2 ${
              isDark 
                ? 'bg-gradient-to-b from-white/[0.05] to-transparent border-indigo-500/20' 
                : 'bg-white border-indigo-200 shadow-sm'
            }`}>
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30 uppercase tracking-wider mb-3">
                Core Revenue Anchor
              </span>
              <h4 className={`font-extrabold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Core Mainstream Balancers
              </h4>
              <p className={`text-xs italic mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Moderate Income &bull; Moderate Spending
              </p>
              <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                The largest and most stable customer cohort. Reliable routine shoppers who appreciate dependability, fair pricing, and predictable product standards.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                Strategy: Milestone Loyalty Perks & Cross-Selling
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* G. TECHNOLOGY SECTION                                                     */}
      {/* ========================================================================= */}
      <section id="technology" className={`py-24 border-t transition-colors ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${
              isDark 
                ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' 
                : 'bg-brand-50 text-brand-700 border-brand-200'
            }`}>
              <Code2 className="w-3.5 h-3.5" />
              <span>Modern Engineering Stack</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Technologies & Libraries Used
            </h2>
            <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Built on industry-standard Machine Learning frameworks and modern web architectures.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            
            <div className={`p-4 rounded-xl border text-center transition ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}>
              <span className={`font-bold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>Python 3.11</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Core Runtime</span>
            </div>

            <div className={`p-4 rounded-xl border text-center transition ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}>
              <span className={`font-bold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>Scikit-Learn</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>K-Means & PCA</span>
            </div>

            <div className={`p-4 rounded-xl border text-center transition ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}>
              <span className={`font-bold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>Pandas & NumPy</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Matrix Processing</span>
            </div>

            <div className={`p-4 rounded-xl border text-center transition ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}>
              <span className={`font-bold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>FastAPI</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>REST API Server</span>
            </div>

            <div className={`p-4 rounded-xl border text-center transition ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}>
              <span className={`font-bold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>React.js 18</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dynamic User Interface</span>
            </div>

            <div className={`p-4 rounded-xl border text-center transition ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}>
              <span className={`font-bold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>Tailwind CSS</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Design System</span>
            </div>

            <div className={`p-4 rounded-xl border text-center transition ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}>
              <span className={`font-bold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>Plotly.js</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>2D & 3D WebGL Charts</span>
            </div>

            <div className={`p-4 rounded-xl border text-center transition ${
              isDark ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}>
              <span className={`font-bold text-sm block ${isDark ? 'text-white' : 'text-slate-900'}`}>OpenPyXL</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Excel Spreadsheets</span>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* H. FINAL CALL-TO-ACTION SECTION                                           */}
      {/* ========================================================================= */}
      <section className={`py-24 border-t relative overflow-hidden transition-colors ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200'
      }`}>
        <div className={`absolute inset-0 pointer-events-none ${
          isDark 
            ? 'bg-gradient-to-tr from-brand-900/30 via-purple-900/20 to-transparent' 
            : 'bg-gradient-to-tr from-brand-100/50 via-purple-100/30 to-transparent'
        }`} />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          
          <div className={`p-8 sm:p-14 rounded-3xl border shadow-2xl backdrop-blur-xl ${
            isDark 
              ? 'bg-gradient-to-r from-brand-900/50 via-indigo-900/50 to-purple-900/50 border-white/15' 
              : 'bg-gradient-to-r from-brand-50 via-indigo-50 to-purple-50 border-brand-200'
          }`}>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Ready to Discover Your Customer Segments?
            </h2>
            <p className={`mt-4 text-base max-w-xl mx-auto leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Upload your dataset or explore bundled benchmark records to unlock predictive behavioral grouping and revenue opportunities.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onGetStarted('dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 hover:from-brand-400 hover:to-purple-400 shadow-xl shadow-brand-500/30 transition-all hover:scale-[1.03]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <button
                onClick={() => onGetStarted('upload')}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base backdrop-blur-md transition-all border ${
                  isDark 
                    ? 'text-slate-200 bg-white/10 hover:bg-white/20 border-white/15' 
                    : 'text-slate-800 bg-white hover:bg-slate-100 border-slate-300 shadow-sm'
                }`}
              >
                <span>Upload Custom Dataset</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* I. FOOTER & CONTACT SECTION                                               */}
      {/* ========================================================================= */}
      <footer id="contact" className={`py-12 border-t text-xs transition-colors ${
        isDark 
          ? 'bg-[#05080F] border-white/[0.08] text-slate-400' 
          : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Col 1 */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                  <Target className="w-4 h-4" />
                </div>
                <span className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Customer<span className="text-brand-500">Segmentation</span> System
                </span>
              </div>
              <p className={`mt-2 text-xs italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                "Understand Your Customers. Discover Business Opportunities."
              </p>
              <p className={`mt-3 text-xs max-w-md leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                A major academic capstone project focusing on Unsupervised Machine Learning, Data Analytics, 3D Data Visualizations, and Automated Business Intelligence.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <h5 className={`font-bold uppercase tracking-wider text-[11px] mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Navigation
              </h5>
              <ul className="space-y-2">
                <li><a href="#about" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>About Methodology</a></li>
                <li><a href="#features" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Core Features</a></li>
                <li><a href="#how-it-works" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Pipeline Workflow</a></li>
                <li><a href="#segments" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Customer Personas</a></li>
                <li><a href="#technology" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`}>Technology Stack</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h5 className={`font-bold uppercase tracking-wider text-[11px] mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Project Demonstration
              </h5>
              <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Computer Science and Engineering (CSE) &bull; Major Project
              </p>
              <button
                onClick={() => onGetStarted('dashboard')}
                className="inline-flex items-center text-xs font-semibold text-brand-500 hover:text-brand-600"
              >
                <span>Enter Live Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

          </div>

          <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'border-white/[0.06] text-slate-400' : 'border-slate-200 text-slate-500'
          }`}>
            <p className="text-[11px]">
              &copy; {new Date().getFullYear()} Customer Segmentation System Using K-Means Clustering Algorithm. All rights reserved.
            </p>
            <p className="text-[11px]">
              Designed with React 18, Tailwind CSS, FastAPI, and Scikit-Learn.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
