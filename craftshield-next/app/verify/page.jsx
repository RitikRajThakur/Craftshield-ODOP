'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  QrCode,
  Search,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';

const RECENT_DEMOS = [
  {
    id: 'ODOP-VAR-466E3C66',
    craft: 'Banarasi Brocade & Silk Saree',
    district: 'Varanasi, UP',
    gi: 'GI-99',
    badge: 'Authentic Handloom'
  },
  {
    id: 'ODOP-RAM-7B1A2C3D',
    craft: 'Channapatna Wooden Toys & Dolls',
    district: 'Ramanagara, KA',
    gi: 'GI-23',
    badge: 'Natural Lac Dye'
  },
  {
    id: 'ODOP-SRI-9F8E7D6C',
    craft: 'Kashmir Pashmina Shawl',
    district: 'Srinagar, JK',
    gi: 'GI-46',
    badge: '14.8µm Pashm Fiber'
  }
];

export default function VerifyPortalHome() {
  const [passportIdInput, setPassportIdInput] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanId = passportIdInput.trim().toUpperCase();
    if (cleanId) {
      router.push(`/verify/${encodeURIComponent(cleanId)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col">
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-500" />

      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-amber-500" />
            <span>CraftShield ODOP Home</span>
          </button>

          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-bold">
            Public Verification Portal
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-8 flex flex-col justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Verify Artisan Digital Passport
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Scan an official CraftShield ODOP QR tag using your phone camera, or enter the unique Passport ID below to check cryptographic authenticity and GI registration.
          </p>
        </div>

        {/* Passport ID Search Form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={passportIdInput}
              onChange={(e) => setPassportIdInput(e.target.value)}
              placeholder="e.g. ODOP-VAR-466E3C66"
              className="w-full rounded-2xl bg-slate-900 border-2 border-slate-700 focus:border-amber-500 px-4 py-3.5 pl-11 text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
              required
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Verify Passport Provenance</span>
          </button>
        </form>

        {/* Demo Passports to Try */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Or Test a Sample Passport:</span>
          </div>

          <div className="space-y-2">
            {RECENT_DEMOS.map((demo) => (
              <div
                key={demo.id}
                onClick={() => router.push(`/verify/${demo.id}`)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-400 group-hover:text-amber-300">
                      {demo.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                      {demo.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium">{demo.craft}</p>
                  <p className="text-[11px] text-slate-400">{demo.district} • {demo.gi}</p>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <p>CraftShield ODOP • Government of India One District One Product Initiative</p>
      </footer>
    </div>
  );
}
