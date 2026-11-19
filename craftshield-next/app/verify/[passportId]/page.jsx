'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Award,
  Fingerprint,
  Calendar,
  Layers,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Copy,
  Check,
  QrCode,
  Share2,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { verifyPassport } from '../../api';

function PassportVerificationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const passportId = params?.passportId || '';
  const token = searchParams?.get('token') || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : '') || '';

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedSig, setCopiedSig] = useState(false);

  useEffect(() => {
    if (!passportId) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    verifyPassport(passportId, token)
      .then((data) => {
        if (isMounted) {
          setResult(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Unable to verify passport');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [passportId, token]);

  const copyUrlToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copySignatureToClipboard = (sig) => {
    if (typeof window !== 'undefined' && sig) {
      navigator.clipboard.writeText(sig);
      setCopiedSig(true);
      setTimeout(() => setCopiedSig(false), 2000);
    }
  };

  const passport = result?.passport;
  const isAuthentic = result?.status === 'AUTHENTIC' && result?.is_valid;
  const isInvalid = result?.status === 'INVALID' || (result && !result.is_valid);
  const isNotFound = result?.status === 'NOT_FOUND' || error?.includes('not found');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar with National ODOP Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-500" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-amber-500" />
            <span>CraftShield ODOP Home</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-bold">
              Ledger Node #8000
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
              <ShieldCheck className="w-8 h-8 text-amber-500 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h2 className="text-lg font-extrabold text-white">Verifying Digital Passport</h2>
              <p className="text-xs text-slate-400 font-mono break-all">{passportId}</p>
              <p className="text-xs text-amber-400/90 pt-1">
                Checking HMAC-SHA256 cryptographic signature & official GI registry records...
              </p>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {!loading && (isNotFound || (!result && error)) && (
          <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 sm:p-8 text-center space-y-5 backdrop-blur-md">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 mx-auto flex items-center justify-center text-red-400">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/30">
                Passport Not Found
              </span>
              <h1 className="text-2xl font-black text-white pt-1">Invalid or Unregistered Passport</h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                No official digital passport record was found for ID <code className="font-mono text-amber-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded">{passportId}</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs text-slate-300 space-y-2 max-w-md mx-auto">
              <p className="font-semibold text-amber-400 flex items-center space-x-1.5">
                <Info className="w-4 h-4" />
                <span>Possible Explanations:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>This product does not have an authentic ODOP Digital Passport.</li>
                <li>The QR code or passport ID may be counterfeit or mistyped.</li>
                <li>The passport has not yet been registered in the ODOP master ledger.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Return to Portal
              </button>
              <button
                onClick={() => router.push(`/?passport=${passportId}`)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-colors"
              >
                Scan Physical Fabric in Studio
              </button>
            </div>
          </div>
        )}

        {/* Counterfeit / Tampered State */}
        {!loading && isInvalid && !isNotFound && (
          <div className="rounded-3xl border-2 border-red-500 bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6 shadow-2xl shadow-red-500/10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 shrink-0">
                <XCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-red-500/20 border border-red-500 text-red-400 text-xs font-black uppercase tracking-wider">
                  <span>COUNTERFEIT ALERT • SIGNATURE FORGED</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Cryptographic Verification Failed</h1>
                <p className="text-xs text-red-300 font-medium">
                  {result?.message || 'SIGNATURE MISMATCH: Passport metadata has been tampered with or altered!'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-xs space-y-2 text-slate-300">
              <p className="font-bold text-red-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Security Notice for Buyers:</span>
              </p>
              <p className="text-[11px] leading-relaxed text-slate-300">
                The cryptographic hash embedded in this tag does not match the product information. This indicates that someone has copied an authentic QR code or modified fields such as material composition or GI registry details. Do not purchase as authentic handloom.
              </p>
            </div>

            {passport && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-xs">
                <h3 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Intercepted Metadata</h3>
                <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px]">
                  <div><strong className="text-slate-300">Claimed Craft:</strong> {passport.product_name}</div>
                  <div><strong className="text-slate-300">Claimed Artisan:</strong> {passport.artisan_name}</div>
                  <div><strong className="text-slate-300">Claimed Material:</strong> {passport.material}</div>
                  <div><strong className="text-slate-300">District:</strong> {passport.district}, {passport.state}</div>
                </div>
              </div>
            )}

            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Return to CraftShield ODOP Home
            </button>
          </div>
        )}

        {/* Authentic & Verified Passport State */}
        {!loading && isAuthentic && passport && (
          <div className="space-y-6">
            {/* Top Verification Hero Card */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/80 bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold tracking-wide uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>AUTHENTIC ODOP DIGITAL PASSPORT</span>
                  </div>

                  <span className="font-mono text-[11px] bg-slate-900/90 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                    {passport.passport_id}
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {passport.product_name}
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-300/90 font-medium mt-1 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{passport.district}, {passport.state} • Certified Geographical Indication</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start space-x-3 text-xs text-emerald-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">Cryptographically Signed & Untampered</p>
                    <p className="text-[11px] text-emerald-300/80">
                      HMAC-SHA256 verified against master key. Product provenance, artisan guild credentials, and material composition are authentic.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Passport Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Master Artisan & Guild */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3.5">
                <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
                  <Award className="w-4 h-4" />
                  <span>Master Artisan & Provenance</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Master Artisan</span>
                    <span className="font-bold text-white text-sm">{passport.artisan_name}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Pehchan / Artisan ID</span>
                    <span className="font-mono text-amber-400 text-xs font-semibold">{passport.artisan_id}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">District & Origin</span>
                    <span className="text-slate-200 font-medium">{passport.district}, {passport.state}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Batch & Material Composition */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3.5">
                <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
                  <Layers className="w-4 h-4" />
                  <span>Batch & Material Composition</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Material Composition</span>
                    <span className="font-bold text-white text-xs">{passport.material}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Batch Number</span>
                      <span className="font-mono text-slate-200 font-semibold">{passport.batch_no}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Production Date</span>
                      <span className="text-slate-200 font-medium">{passport.production_date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Official GI Tag Registry */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3.5">
                <div className="flex items-center space-x-2 text-emerald-500 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Official ODOP GI Registration</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Geographical Indication</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">{passport.gi_tag}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      VERIFIED
                    </span>
                  </div>
                  {result?.gi_details && (
                    <div className="text-[11px] text-slate-400 pt-1 space-y-1">
                      <p><strong className="text-slate-300">Category:</strong> {result.gi_details.category}</p>
                      <p><strong className="text-slate-300">Registry Match:</strong> {result.gi_details.registered_product}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 4: Cryptographic Proof */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3.5">
                <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
                  <Fingerprint className="w-4 h-4" />
                  <span>HMAC-SHA256 Cryptographic Signature</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Algorithm</span>
                    <span className="font-mono text-slate-200 text-xs">HMAC-SHA256</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Signature Hash</span>
                      <button
                        onClick={() => copySignatureToClipboard(passport.signature)}
                        className="text-amber-500 hover:text-amber-400 font-semibold inline-flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedSig ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSig ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-slate-300 break-all select-all border border-slate-800">
                      {passport.signature}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Test Advisory */}
            {result?.gi_details?.physical_test && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-4 h-4" />
                  <span>Quick Physical Test (Traditional Verification)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {result.gi_details.physical_test}
                </p>
              </div>
            )}

            {/* Action Bar (Mobile Responsive) */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => router.push(`/?passport=${passport.passport_id}`)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-950" />
                  <span>Test Micro-Texture in Verification Studio</span>
                </button>

                <button
                  onClick={copyUrlToClipboard}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-colors border border-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-500" />}
                  <span>{copied ? 'Verification Link Copied!' : 'Share / Copy Verification Link'}</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={() => router.push('/')}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ← Return to CraftShield ODOP Portal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <p>CraftShield ODOP • Government of India One District One Product Initiative</p>
        <p className="text-[10px] text-slate-600 mt-1">Cryptographic Digital Product Passport Architecture • HMAC-SHA256</p>
      </footer>
    </div>
  );
}

export default function PassportVerificationPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-amber-500">
        <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading CraftShield Ledger...</p>
      </div>
    }>
      <PassportVerificationContent />
    </React.Suspense>
  );
}
