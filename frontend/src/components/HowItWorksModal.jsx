import React from 'react';
import { Cpu, ShieldCheck, QrCode, Sparkles, Database, FileText, CheckCircle2, Layers, Zap, Fingerprint, Scan, Award } from 'lucide-react';

export default function HowItWorksModal({ lang, theme = 'dark' }) {
  const isDark = theme === 'dark';

  const steps = [
    {
      num: '01',
      icon: <Cpu className="w-6 h-6 text-amber-500" />,
      tag: 'Computer Vision',
      title: 'Micro-Texture & Gradient Extraction (Computer Vision)',
      desc: 'Converts macro craft photographs into high-resolution gradient maps. Computes local patch variance across warp and weft fibers. Handloom items display natural human tension variances (15% to 40%), whereas powerlooms exhibit flat artificial uniformity (<10%).'
    },
    {
      num: '02',
      icon: <Scan className="w-6 h-6 text-emerald-500" />,
      tag: 'Signal Processing',
      title: 'Spatial Autocorrelation & Symmetry Analysis',
      desc: 'Calculates 2D spatial autocorrelation signals across horizontal (weft) and vertical (warp) profiles. Automated motorized powerlooms produce sharp periodic spike repeats (>65% symmetry), whereas traditional pit looms produce soft harmonic decays (<40%).'
    },
    {
      num: '03',
      icon: <QrCode className="w-6 h-6 text-amber-500" />,
      tag: 'Cryptography',
      title: 'Cryptographic Digital Product Passport (HMAC-SHA256)',
      desc: 'Each artisan batch is cryptographically bound to its Pehchan card ID, production timestamp, and official GI Tag registration using HMAC-SHA256. Tampering with any material attribute instantly breaks the cryptographic signature.'
    },
    {
      num: '04',
      icon: <Database className="w-6 h-6 text-emerald-500" />,
      tag: 'Government Registry',
      title: 'ODOP & GI Registry Cross-Referencing',
      desc: 'Validates claimed craft origin against official Government of India ODOP benchmarks (e.g. Kadwa weave for Banarasi Silk, Wrightia tinctoria vegetable lacquer for Channapatna Toys, 12-15 micron fineness for Kashmir Pashmina).'
    },
    {
      num: '05',
      icon: <FileText className="w-6 h-6 text-amber-500" />,
      tag: 'Document Minting',
      title: 'Bilingual AI Reasoning & Official PDF Minting',
      desc: 'Synthesizes optical metrics into human-readable inspector reports in English and Hindi (देवनागरी), and generates an official downloadable PDF Certificate of Authenticity via ReportLab.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Enhanced Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl border transition-all duration-300 p-6 sm:p-8 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/40 border-amber-500/25 shadow-2xl shadow-amber-500/5'
          : 'bg-gradient-to-br from-white via-amber-50/50 to-slate-50 border-amber-200/90 shadow-lg shadow-amber-500/5'
      }`}>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs font-semibold backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-mono text-[11px] tracking-wide uppercase">System Architecture • Placement Ready</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  How CraftShield AI{' '}
                </span>
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 bg-clip-text text-transparent font-black drop-shadow-xs">
                  Protects ODOP Crafts
                </span>
              </h1>
              <p className={`mt-2.5 text-xs sm:text-sm leading-relaxed max-w-2xl ${
                isDark ? 'text-slate-300' : 'text-slate-600 font-medium'
              }`}>
                A 5-stage verification pipeline combining deep computer vision signal processing, official GI Tag knowledge bases, and cryptographic provenance ledgers.
              </p>
            </div>

            {/* Quick feature tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <Fingerprint className="w-3.5 h-3.5 text-amber-500" />
                <span>Sobel Texture Variance</span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <Scan className="w-3.5 h-3.5 text-emerald-500" />
                <span>Spatial Autocorrelation</span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>HMAC-SHA256 Token</span>
              </div>
            </div>
          </div>

          {/* Right Column: Status Card (4 cols) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className={`relative p-5 rounded-2xl border backdrop-blur-md w-full max-w-[280px] space-y-3.5 transition-all ${
              isDark
                ? 'bg-slate-950/80 border-amber-500/25 shadow-xl shadow-amber-500/5'
                : 'bg-white/90 border-amber-200/90 shadow-md shadow-amber-500/10'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-700/40 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    Pipeline Pipeline
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  5 Stages
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Inference Time</span>
                  <span className="font-mono font-bold text-emerald-500">&lt; 180 ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Security</span>
                  <span className="font-mono text-[11px] font-bold text-amber-500">256-bit Cryptographic</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Documentation</span>
                  <span className={`font-mono text-[11px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Swagger /docs
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/40">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>5 verification stages below</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Pipeline Steps */}
      <div className="space-y-4">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all duration-200 hover:shadow-lg ${
              isDark
                ? 'bg-slate-900 border-slate-800 hover:border-amber-500/40 shadow-xl'
                : 'bg-white border-slate-200/90 hover:border-amber-300 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-3 sm:flex-col sm:space-x-0 sm:space-y-2 shrink-0">
              <span className="font-mono text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                STAGE {s.num}
              </span>
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-inner ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {s.icon}
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  {s.tag}
                </span>
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {s.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Placement & Viva Technical Reference Card */}
      <div className={`border rounded-3xl p-6 sm:p-8 space-y-5 transition-all ${
        isDark
          ? 'bg-slate-900/90 border-amber-500/30 shadow-2xl shadow-amber-500/5'
          : 'bg-white border-amber-300/80 shadow-md shadow-amber-500/5'
      }`}>
        <div className="flex items-center justify-between border-b pb-3.5 border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Placement & Viva Technical Stack Reference</span>
          </h3>
          <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Full-Stack CSE Portfolio
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-bold block mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Backend Framework
            </span>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              FastAPI (Python async REST API, Pydantic validation, CORS middleware, auto Swagger docs at /docs)
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-bold block mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Computer Vision
            </span>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              NumPy & Pillow (Sobel edge gradient kernels, 2D spatial autocorrelation, patch-based CV ratio)
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-bold block mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Cryptographic Security
            </span>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              HMAC-SHA256 signed Digital Product Passports with QR code encoding and tamper detection
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-bold block mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Frontend Layer
            </span>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              React 19 + Vite + Tailwind CSS v4 + Lucide Icons + Canvas-Confetti + Day/Night Theme
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
