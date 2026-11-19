import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Award,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Compass,
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { fetchODOPCrafts } from '../api';

export default function ODOPExplorer({ lang, theme = 'dark', onSelectCraftForVerification }) {
  const [crafts, setCrafts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    fetchODOPCrafts().then(setCrafts).catch(console.error);
  }, []);

  const categories = ['All', ...Array.from(new Set(crafts.map(c => c.category)))];

  const filteredCrafts = crafts.filter((c) => {
    const matchesSearch =
      c.product_name.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase()) ||
      c.gi_tag.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCategory || selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
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
              <span className="font-mono text-[11px] tracking-wide uppercase">National ODOP & GI Registry Directory</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  {lang === 'hi' ? 'ODOP जिला एवं ' : 'ODOP Districts & '}
                </span>
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 bg-clip-text text-transparent font-black drop-shadow-xs">
                  {lang === 'hi' ? 'जीआई टैग डायरेक्टरी' : 'GI Tag Directory'}
                </span>
              </h1>
              <p className={`mt-2.5 text-xs sm:text-sm leading-relaxed max-w-2xl ${
                isDark ? 'text-slate-300' : 'text-slate-600 font-medium'
              }`}>
                {lang === 'hi'
                  ? 'भारत के विभिन्न जिलों के पंजीकृत पारंपरिक शिल्पों, उनके प्रामाणिक लक्षणों एवं नकली उत्पादों की पहचान करने की संपूर्ण गाइड।'
                  : 'Explore official Geographical Indication (GI) tagged handicrafts across Indian districts, optical validation benchmarks, and counterfeit threat intelligence.'}
              </p>
            </div>

            {/* Quick feature tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>One District One Product</span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span>Geographical Indication</span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Counterfeit Red Flags</span>
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
                    Registry Status
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Verified
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Monitored Hubs</span>
                  <span className="font-mono font-bold text-amber-500">5 Districts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>GI Registry</span>
                  <span className="font-mono font-bold text-emerald-500">Ministry Aligned</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Counterfeit Risk</span>
                  <span className="font-mono text-[11px] font-bold text-rose-500">
                    High Alert
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/40">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Search & filter below</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 shadow-md' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Districts Monitored
          </div>
          <div className="text-2xl font-black text-amber-500 mt-1">5 Hubs</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Varanasi, Srinagar, Ramanagara...</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 shadow-md' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            GI Tag Registrations
          </div>
          <div className="text-2xl font-black text-emerald-500 mt-1">100% Certified</div>
          <p className="text-[11px] text-slate-400 mt-0.5">GI-99, GI-23, GI-46, GI-33...</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 shadow-md' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Indian States
          </div>
          <div className={`text-2xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            5 States / UT
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">UP, Karnataka, J&K, Rajasthan...</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 shadow-md' : 'bg-white border-slate-200/90 shadow-xs'
        }`}>
          <div className="text-[10px] text-rose-500 uppercase font-bold tracking-wider flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Threat Radar</span>
          </div>
          <div className="text-2xl font-black text-rose-500 mt-1">Powerlooms</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Machine knockoffs flagged</p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className={`p-5 rounded-2xl border space-y-3.5 ${
        isDark ? 'bg-slate-900 border-slate-800 shadow-md' : 'bg-white border-slate-200/90 shadow-xs'
      }`}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by District (e.g. Varanasi, Srinagar), Craft Name, State, or GI Tag Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-xl pl-10 pr-4 py-3 text-xs font-medium transition-all ${
              isDark
                ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
            }`}
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = (!selectedCategory && cat === 'All') || selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-extrabold'
                    : isDark
                      ? 'bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Crafts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCrafts.map((craft) => {
          const isExpanded = expandedId === craft.id;
          return (
            <div
              key={craft.id}
              className={`border rounded-2xl p-6 space-y-4 transition-all duration-200 hover:shadow-lg ${
                isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-amber-500/30 shadow-xl'
                  : 'bg-white border-slate-200/90 hover:border-amber-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/25">
                      {craft.gi_tag} ({craft.registered_year})
                    </span>
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {craft.category}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {craft.product_name}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-amber-500 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{craft.district}, {craft.state}</span>
                  </div>
                </div>

                <div className="shrink-0 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <Award className="w-5 h-5 stroke-[2]" />
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {craft.description}
              </p>

              {/* Collapsible Inspection Details */}
              {isExpanded && (
                <div className="space-y-3.5 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                  <div>
                    <h5 className="font-bold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>Authentic Handcrafted Markers:</span>
                    </h5>
                    <ul className="space-y-1.5 pl-2">
                      {craft.authenticity_markers.map((marker, idx) => (
                        <li key={idx} className={`flex items-start space-x-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                          <span>{marker}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-bold text-rose-600 dark:text-rose-400 mb-1.5 flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>Counterfeit & Powerloom Red Flags:</span>
                    </h5>
                    <ul className="space-y-1.5 pl-2">
                      {craft.counterfeit_red_flags.map((flag, idx) => (
                        <li key={idx} className={`flex items-start space-x-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="text-rose-500 font-bold mt-0.5">✗</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-amber-50/60 border-amber-200/80'
                  }`}>
                    <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                      Physical Verification Test:
                    </span>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {craft.physical_test}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => toggleExpand(craft.id)}
                  className={`w-full py-2.5 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isExpanded
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                      : isDark
                        ? 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{isExpanded ? 'Hide Details' : 'Inspection Markers'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {onSelectCraftForVerification && (
                  <button
                    type="button"
                    onClick={() => onSelectCraftForVerification(craft)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Verify in Studio</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
