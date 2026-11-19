'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VerificationStudio from './components/VerificationStudio';
import ArtisanPortal from './components/ArtisanPortal';
import ODOPExplorer from './components/ODOPExplorer';
import HowItWorksModal from './components/HowItWorksModal';
import { ShieldCheck, Heart, Cpu, FileCode, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { getBackendBaseUrl } from './api';

const LIVE_TICKER_ITEMS = [
  { id: 1, craft: 'Varanasi Banarasi Silk', district: 'Varanasi, UP', badge: 'Authentic 94.2%', status: 'auth', time: '2m ago' },
  { id: 2, craft: 'Channapatna Wooden Toy', district: 'Ramanagara, KA', badge: 'Natural Lac Confirmed', status: 'auth', time: '5m ago' },
  { id: 3, craft: 'Kashmir Pashmina Shawl', district: 'Srinagar, JK', badge: 'Fiber 14.8µm Verified', status: 'auth', time: '8m ago' },
  { id: 4, craft: 'Surat Synthetic Brocade', district: 'Surat, GJ', badge: 'Machine Powerloom Flagged', status: 'fake', time: '12m ago' },
  { id: 5, craft: 'Pochampally Ikat Weave', district: 'Yadadri, TS', badge: 'Hand-weft Tension OK', status: 'auth', time: '17m ago' },
  { id: 6, craft: 'Jaipur Blue Pottery', district: 'Jaipur, RJ', badge: 'Authentic Quartz Glaze', status: 'auth', time: '22m ago' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [lang, setLang] = useState('en');
  const [prefillPassport, setPrefillPassport] = useState('');
  const [selectedCraftFromExplorer, setSelectedCraftFromExplorer] = useState(null);

  // Day / Night Theme State (persisted in localStorage)
  const [theme, setTheme] = useState('dark');
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('craftshield_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
    setThemeLoaded(true);
  }, []);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (!themeLoaded) return;
    localStorage.setItem('craftshield_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme, themeLoaded]);

  // Handle URL query parameters (e.g., when a user scans the QR code)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pass = params.get('passport');
    if (pass) {
      setPrefillPassport(pass);
      setActiveTab('studio');
    }
  }, []);

  const handleTestPassportFromRegistry = (passportId) => {
    setPrefillPassport(passportId);
    setActiveTab('studio');
  };

  const handleSelectCraftFromExplorer = (craft) => {
    setSelectedCraftFromExplorer(craft);
    setActiveTab('studio');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-amber-500 selection:text-slate-950 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Navigation Bar with Theme Toggle */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 🔴 Live ODOP Real-Time Verification Marquee */}
      <div className={`border-b overflow-hidden py-1.5 transition-colors ${
        isDark ? 'bg-slate-900/70 border-slate-800 text-slate-400' : 'bg-amber-50/60 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center space-x-3 text-xs max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-1.5 shrink-0 pr-3 border-r border-slate-700/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
              Live Feed
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee flex items-center space-x-8 text-[11px]">
              {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, idx) => (
                <div key={idx} className="inline-flex items-center space-x-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'auth' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {item.craft}
                  </span>
                  <span className="text-[10px] opacity-70">({item.district})</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    item.status === 'auth'
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                  }`}>
                    {item.badge}
                  </span>
                  <span className="text-[10px] opacity-50">{item.time}</span>
                  <span className="opacity-30">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'studio' && (
          <VerificationStudio
            lang={lang}
            prefillPassport={prefillPassport}
            selectedCraftPreload={selectedCraftFromExplorer}
            theme={theme}
          />
        )}
        {activeTab === 'registry' && (
          <ArtisanPortal lang={lang} onTestPassport={handleTestPassportFromRegistry} theme={theme} />
        )}
        {activeTab === 'explorer' && (
          <ODOPExplorer
            lang={lang}
            theme={theme}
            onSelectCraftForVerification={handleSelectCraftFromExplorer}
          />
        )}
        {activeTab === 'howitworks' && (
          <HowItWorksModal lang={lang} theme={theme} />
        )}
      </main>

      {/* Comprehensive Placement-Grade Footer */}
      <footer className={`border-t py-12 text-xs transition-colors duration-200 ${
        isDark ? 'border-slate-900 bg-slate-950/95 text-slate-400' : 'border-slate-200 bg-white text-slate-600 shadow-inner'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800/60 dark:border-slate-800">
            {/* Col 1: Brand & National Mission */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className={`font-black text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  CraftShield ODOP
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded">
                  Govt of India Aligned
                </span>
              </div>
              <p className={`text-xs leading-relaxed max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                An AI-powered authenticity verification platform built for Indian handicrafts under the One District One Product (ODOP) and Geographical Indications (GI) initiative. Protects authentic master artisans from industrial powerloom counterfeits using micro-texture computer vision and cryptographic passports.
              </p>
              <div className="flex items-center space-x-3 text-[11px] pt-1 font-medium">
                <span className="text-amber-500">Ministry of Textiles Aligned</span>
                <span>•</span>
                <span className="text-emerald-500">GI Tag Act 1999 Compliant</span>
              </div>
            </div>

            {/* Col 2: Navigation & Tools */}
            <div className="space-y-2.5">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                Platform Navigation
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setActiveTab('studio')} className="hover:text-amber-500 transition-colors">
                    Authenticity Verification Studio
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('registry')} className="hover:text-amber-500 transition-colors">
                    Artisan Digital Passport Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('explorer')} className="hover:text-amber-500 transition-colors">
                    ODOP & GI Tag Directory (5 States)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('howitworks')} className="hover:text-amber-500 transition-colors">
                    Computer Vision Architecture
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Technology Stack */}
            <div className="space-y-2.5">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                Underlying Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  FastAPI 0.115
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  Next.js App Router + Tailwind
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  Sobel + Spatial Autocorr
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  HMAC-SHA256 Token
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  ReportLab PDF Engine
                </span>
              </div>
              <div className="pt-2">
                <a
                  href={`${getBackendBaseUrl()}/docs`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-amber-500 hover:text-amber-400 font-semibold text-xs"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Interactive Swagger API Docs (/docs)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Viva Acknowledgement */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p className="flex items-center space-x-1.5">
              <span>© {new Date().getFullYear()} CraftShield ODOP. Developed for Academic Project & Placement Evaluation.</span>
            </p>
            <div className={`flex items-center space-x-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for Indian Master Weavers & Artisans</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
