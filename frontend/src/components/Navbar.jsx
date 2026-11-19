import React from 'react';
import { ShieldCheck, Sparkles, MapPin, Award, BookOpen, Globe, Sun, Moon, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, lang, setLang, theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-50 transition-colors duration-200">
      {/* 🇮🇳 Top National Government Trust Ribbon */}
      <div className={`text-[11px] font-medium border-b py-1 px-4 transition-colors ${
        isDark
          ? 'bg-slate-950 border-slate-800/80 text-slate-400'
          : 'bg-gradient-to-r from-orange-50 via-white to-emerald-50 border-slate-200 text-slate-600 shadow-2xs'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">🇮🇳</span>
            <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              भारत सरकार • Government of India
            </span>
            <span className="hidden md:inline text-slate-400">•</span>
            <span className="hidden md:inline">
              Ministry of Textiles & DPIIT • One District One Product (ODOP)
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[10px] font-mono">
            <span className="flex items-center space-x-1 text-emerald-500 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Engine v2.4: Online</span>
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className={`hidden sm:inline font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              GI Registry Act 1999 Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`backdrop-blur-md transition-colors duration-200 border-b ${
        isDark
          ? 'bg-slate-950/90 border-slate-800/80 text-slate-100'
          : 'bg-white/95 border-slate-200/90 text-slate-800 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Branding */}
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('studio')}>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/25 ring-1 ring-amber-300/40 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.2]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-black text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    CraftShield
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-gradient-to-r from-amber-500/15 to-amber-600/15 text-amber-500 border border-amber-500/30 rounded-md">
                    ODOP AI
                  </span>
                </div>
                <p className={`text-[11px] font-medium hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {lang === 'hi' ? 'हस्तशिल्प प्रामाणिकता सहायक' : 'Handicraft Authenticity Assistant'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setActiveTab('studio')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'studio'
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lang === 'hi' ? 'जांच स्टूडियो' : 'Authenticity Studio'}</span>
              </button>

              <button
                onClick={() => setActiveTab('registry')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'registry'
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>{lang === 'hi' ? 'कारीगर पासपोर्ट' : 'Artisan Passport'}</span>
              </button>

              <button
                onClick={() => setActiveTab('explorer')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'explorer'
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>{lang === 'hi' ? 'ODOP डायरेक्टरी' : 'ODOP Explorer'}</span>
              </button>

              <button
                onClick={() => setActiveTab('howitworks')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'howitworks'
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-xs font-bold'
                    : isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>{lang === 'hi' ? 'तकनीक' : 'Architecture'}</span>
              </button>
            </nav>

            {/* Action Controls: Day/Night Theme Toggle & Language */}
            <div className="flex items-center space-x-2">
              {/* Day / Night Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-400 hover:border-slate-600 shadow-inner'
                    : 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-amber-600 shadow-xs'
                }`}
                title={isDark ? 'Switch to Day Mode (Light)' : 'Switch to Night Mode (Dark)'}
                aria-label="Toggle Day / Night theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
                )}
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                }`}
                title="Toggle English / हिंदी"
              >
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
