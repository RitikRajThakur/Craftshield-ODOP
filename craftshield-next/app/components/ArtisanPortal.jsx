import React, { useState, useEffect } from 'react';
import {
  Award,
  PlusCircle,
  QrCode,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Fingerprint,
  Zap,
  Sparkles,
  FileBadge
} from 'lucide-react';
import { fetchODOPCrafts, mintProductPassport, getFullApiUrl } from '../api';

export default function ArtisanPortal({ lang, onTestPassport, theme = 'dark' }) {
  const [odopCrafts, setOdopCrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Mint Form State
  const [artisanId, setArtisanId] = useState('UP-VNS-WEAVER-7821');
  const [artisanName, setArtisanName] = useState('Master Weaver Ramprasad Ansari');
  const [productName, setProductName] = useState('Banarasi Brocade & Silk Saree');
  const [district, setDistrict] = useState('Varanasi');
  const [state, setState] = useState('Uttar Pradesh');
  const [giTag, setGiTag] = useState('GI-99');
  const [batchNo, setBatchNo] = useState(`BATCH-${new Date().getFullYear()}-01`);
  const [material, setMaterial] = useState('Pure Katan Silk with Gold/Silver Zari');

  const [lastMinted, setLastMinted] = useState(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchODOPCrafts().then(setOdopCrafts).catch(console.error);
  }, []);

  const handleCraftSelection = (e) => {
    const craftId = e.target.value;
    const craft = odopCrafts.find(c => c.id === craftId);
    if (craft) {
      setProductName(craft.product_name);
      setDistrict(craft.district);
      setState(craft.state);
      setGiTag(craft.gi_tag);
    }
  };

  const handleMintPassport = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const minted = await mintProductPassport({
        artisan_id: artisanId,
        artisan_name: artisanName,
        product_name: productName,
        district: district,
        state: state,
        gi_tag: giTag,
        batch_no: batchNo,
        production_date: new Date().toISOString().split('T')[0],
        material: material
      });

      setLastMinted(minted);
      setMessage(`Digital Passport ${minted.passport_id} minted successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
              <span className="font-mono text-[11px] tracking-wide uppercase">DPP Minting Engine • HMAC-SHA256</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  {lang === 'hi' ? 'कारीगर डिजिटल ' : 'Artisan Digital '}
                </span>
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 bg-clip-text text-transparent font-black drop-shadow-xs">
                  {lang === 'hi' ? 'पासपोर्ट पोर्टल' : 'Passport Portal'}
                </span>
              </h1>
              <p className={`mt-2.5 text-xs sm:text-sm leading-relaxed max-w-2xl ${
                isDark ? 'text-slate-300' : 'text-slate-600 font-medium'
              }`}>
                {lang === 'hi'
                  ? 'कारीगरों के लिए अद्वितीय HMAC-SHA256 डिजिटल पासपोर्ट और QR टैग जारी करें, जिससे बिचौलियों और नकली उत्पादों से सुरक्षा मिलती है।'
                  : 'Issue tamper-proof HMAC-SHA256 cryptographically signed Digital Product Passports and printable QR tags to protect master artisans from counterfeiting.'}
              </p>
            </div>

            {/* Quick feature tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <Fingerprint className="w-3.5 h-3.5 text-amber-500" />
                <span>Pehchan Card Aligned</span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <QrCode className="w-3.5 h-3.5 text-emerald-500" />
                <span>Printable Vector QR</span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Zero Forgery Proof</span>
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
                    Crypto Mint
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  Online
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cryptographic Hash</span>
                  <span className="font-mono text-[11px] font-bold text-amber-500">SHA-256 (256-bit)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Key Length</span>
                  <span className="font-mono font-bold text-emerald-500">Master Secret</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Registry Format</span>
                  <span className={`font-mono text-[11px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    ODOP DPP v1
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/40">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Instant QR Generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center space-x-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span className="font-medium">{message}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, QR Passport on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (7 cols) */}
        <div className={`lg:col-span-7 border rounded-2xl p-6 space-y-5 transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 shadow-xl'
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="flex items-center justify-between border-b pb-3.5 border-slate-200/60 dark:border-slate-800">
            <h3 className={`text-sm font-bold flex items-center space-x-2 ${
              isDark ? 'text-slate-200' : 'text-slate-900'
            }`}>
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Craft Batch Information</span>
            </h3>
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              HMAC Metadata Payload
            </span>
          </div>

          <form onSubmit={handleMintPassport} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Artisan Pehchan ID Card
                </label>
                <input
                  type="text"
                  value={artisanId}
                  onChange={(e) => setArtisanId(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 font-medium transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Artisan / Guild Name
                </label>
                <input
                  type="text"
                  value={artisanName}
                  onChange={(e) => setArtisanName(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 font-medium transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                ODOP Certified Craft Template
              </label>
              <select
                onChange={handleCraftSelection}
                className={`w-full rounded-xl px-3.5 py-2.5 font-medium transition-all ${
                  isDark
                    ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                }`}
              >
                {odopCrafts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.product_name} ({c.district}, {c.state}) - {c.gi_tag}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Product Title
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 font-medium transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  GI Tag Application No.
                </label>
                <input
                  type="text"
                  value={giTag}
                  onChange={(e) => setGiTag(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 font-medium transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                  }`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  District & State
                </label>
                <input
                  type="text"
                  value={`${district}, ${state}`}
                  readOnly
                  className={`w-full rounded-xl px-3.5 py-2.5 font-medium cursor-not-allowed ${
                    isDark ? 'bg-slate-950/60 border border-slate-800 text-slate-400' : 'bg-slate-100 border border-slate-200 text-slate-500'
                  }`}
                />
              </div>
              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Batch Number
                </label>
                <input
                  type="text"
                  value={batchNo}
                  onChange={(e) => setBatchNo(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 font-medium transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Material Composition
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className={`w-full rounded-xl px-3.5 py-2.5 font-medium transition-all ${
                  isDark
                    ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                }`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/25 active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Mint Tamper-Proof Cryptographic Passport</span>
            </button>
          </form>
        </div>

        {/* Right Column: Display Generated QR / Standby Blueprint (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {lastMinted ? (
            <div className={`rounded-2xl border p-6 space-y-4 transition-all ${
              isDark
                ? 'bg-slate-900 border-amber-500/40 shadow-xl shadow-amber-500/5'
                : 'bg-white border-amber-300/80 shadow-md shadow-amber-500/10'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileBadge className="w-4 h-4" />
                  <span>Minted Cryptographic Passport</span>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>

              <div className="flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <img
                  src={getFullApiUrl(lastMinted.qr_url)}
                  alt="Passport QR"
                  className="w-44 h-44 object-contain"
                />
                <p className="text-xs font-mono font-bold text-slate-900 mt-2.5 bg-slate-100 px-3 py-1 rounded-md">
                  {lastMinted.passport_id}
                </p>
              </div>

              <div className={`space-y-1.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <p><strong>Craft:</strong> {lastMinted.product_name}</p>
                <p><strong>Artisan:</strong> {lastMinted.artisan_name}</p>
                <p><strong>District:</strong> {lastMinted.district}, {lastMinted.state}</p>
                <p><strong>GI Tag:</strong> {lastMinted.gi_tag}</p>
                <p className="font-mono text-[10px] opacity-75 truncate">
                  <strong>HMAC Sig:</strong> {lastMinted.signature}
                </p>
              </div>

              {/* Mobile QR Verification Link Preview */}
              {lastMinted.verify_url && (
                <div className={`p-3 rounded-xl border text-[11px] space-y-1.5 transition-colors ${
                  isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center justify-between font-mono text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                    <span>Mobile QR Target URL</span>
                    <span className="text-emerald-500 font-semibold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      <span>Phone Camera Ready</span>
                    </span>
                  </div>
                  <p className="font-mono text-[10px] break-all opacity-85 select-all bg-black/20 dark:bg-black/40 p-1.5 rounded-md">
                    {lastMinted.verify_url}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                    💡 Connect your phone to this Wi-Fi network to scan and verify instantly.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <a
                  href={getFullApiUrl(lastMinted.qr_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`qr_${lastMinted.passport_id}.png`}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors border ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span>Download QR</span>
                </a>
                <a
                  href={lastMinted.verify_url || `/verify/${lastMinted.passport_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Page</span>
                </a>
                <button
                  onClick={() => onTestPassport(lastMinted.passport_id)}
                  className="py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <FileBadge className="w-3.5 h-3.5" />
                  <span>Studio Scan</span>
                </button>
              </div>
            </div>
          ) : (
            <div className={`h-full min-h-[440px] border rounded-2xl p-8 flex flex-col justify-between transition-all ${
              isDark
                ? 'bg-slate-900/60 border-slate-800/80 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div className="flex items-center justify-between border-b pb-4 border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    Digital Passport Blueprint
                  </span>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  isDark ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  Awaiting Input
                </span>
              </div>

              <div className="my-6 text-center space-y-4">
                <div className="relative mx-auto w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-amber-500/20 animate-spin-slow pointer-events-none" />
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-md">
                    <QrCode className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400 text-[10px] font-mono border border-amber-500/30 font-bold">
                    HMAC-SHA256
                  </div>
                </div>

                <div className="max-w-xs mx-auto space-y-1.5">
                  <h4 className={`text-base font-extrabold tracking-tight ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Mint Cryptographic Provenance
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Fill the form on the left to generate an authentic digital passport and a high-resolution printable QR code sticker for physical packaging.
                  </p>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border text-center text-xs ${
                isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                🔐 Cryptographic signatures bind the artisan ID, district, and GI tag number forever.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
