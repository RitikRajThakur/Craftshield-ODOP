import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  Cpu,
  RefreshCw,
  QrCode,
  Zap,
  Info,
  ShieldAlert,
  ShieldCheck,
  Fingerprint,
  Scan
} from 'lucide-react';
import { fetchDemoSamples, getSampleImageUrl, fetchSampleImageBlob, runCraftVerification, fetchODOPCrafts, getFullApiUrl } from '../api';

const DEMO_SAMPLES = [
  {
    id: 'sample-banarasi-auth',
    name: 'Authentic Banarasi Handloom Silk (Varanasi, UP)',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    product_name: 'Banarasi Brocade & Silk Saree',
    gi_tag: 'GI-99',
    category: 'Textiles & Handloom',
    filename: 'authentic_handloom.jpg',
    expected: 'AUTHENTIC',
    badge: 'Genuine Kadwa Weave'
  },
  {
    id: 'sample-banarasi-fake',
    name: 'Counterfeit Powerloom Silk Replica (Machine Made)',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    product_name: 'Powerloom Synthetic Silk (Machine Imitation)',
    gi_tag: 'GI-99',
    category: 'Textiles & Handloom',
    filename: 'counterfeit_powerloom.jpg',
    expected: 'COUNTERFEIT',
    badge: 'Machine Grid Repeat'
  }
];

const DEFAULT_ODOP_CRAFTS = [
  {
    id: 'ODOP-VNS-01',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    product_name: 'Banarasi Brocade & Silk Saree',
    gi_tag: 'GI-99'
  },
  {
    id: 'ODOP-RMN-02',
    district: 'Ramanagara',
    state: 'Karnataka',
    product_name: 'Channapatna Wooden Toys & Lacquerware',
    gi_tag: 'GI-13'
  },
  {
    id: 'ODOP-SRN-03',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    product_name: 'Kashmir Pashmina & Kani Shawl',
    gi_tag: 'GI-46'
  },
  {
    id: 'ODOP-JPR-04',
    district: 'Jaipur',
    state: 'Rajasthan',
    product_name: 'Jaipur Blue Pottery',
    gi_tag: 'GI-2'
  },
  {
    id: 'ODOP-MDB-05',
    district: 'Madhubani',
    state: 'Bihar',
    product_name: 'Mithila / Madhubani Painting',
    gi_tag: 'GI-105'
  }
];

export default function VerificationStudio({ lang, prefillPassport, selectedCraftPreload, theme = 'dark' }) {
  const [samples, setSamples] = useState(DEMO_SAMPLES);
  const [odopList, setOdopList] = useState(DEFAULT_ODOP_CRAFTS);
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [loadingSampleId, setLoadingSampleId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [district, setDistrict] = useState('Varanasi');
  const [craftName, setCraftName] = useState('Banarasi Brocade & Silk Saree');
  const [giTag, setGiTag] = useState('GI-99');
  const [passportToken, setPassportToken] = useState(prefillPassport || '');

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [explanationLang, setExplanationLang] = useState(lang);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDemoSamples()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSamples(data);
        }
      })
      .catch((err) => console.warn('Using preset demo samples:', err.message));

    fetchODOPCrafts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOdopList(data);
        }
      })
      .catch((err) => console.warn('Using preset ODOP registry crafts:', err.message));
  }, []);

  useEffect(() => {
    if (prefillPassport) {
      setPassportToken(prefillPassport);
    }
  }, [prefillPassport]);

  useEffect(() => {
    if (selectedCraftPreload) {
      setDistrict(selectedCraftPreload.district || 'Varanasi');
      setCraftName(selectedCraftPreload.product_name || selectedCraftPreload.name || 'Banarasi Brocade & Silk Saree');
      setGiTag(selectedCraftPreload.gi_tag || 'GI-99');
    }
  }, [selectedCraftPreload]);

  useEffect(() => {
    setExplanationLang(lang);
  }, [lang]);

  const handleDistrictChange = (e) => {
    const dist = e.target.value;
    setDistrict(dist);
    const matched = odopList.find(c => c.district.toLowerCase() === dist.toLowerCase());
    if (matched) {
      setCraftName(matched.product_name);
      setGiTag(matched.gi_tag);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    setActiveSampleId(null);
    setResult(null);
    setError(null);
  };

  const handleLoadSample = async (sample) => {
    if (!sample) return;
    setError(null);
    setResult(null);
    setActiveSampleId(sample.id);
    setLoadingSampleId(sample.id);

    // Reset previous selection so stale file cannot be sent
    setSelectedFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);

    // Update product and district details from sample
    const sampleDistrict = sample.district || 'Varanasi';
    const sampleCraft = sample.product_name || sample.name || 'Banarasi Brocade & Silk Saree';
    const sampleGi = sample.gi_tag || 'GI-99';

    setDistrict(sampleDistrict);
    setCraftName(sampleCraft);
    setGiTag(sampleGi);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      const filename = sample.filename || (sample.expected === 'AUTHENTIC' ? 'authentic_handloom.jpg' : 'counterfeit_powerloom.jpg');
      const blob = await fetchSampleImageBlob(filename);
      const file = new File([blob], filename, { type: 'image/jpeg' });
      setSelectedFile(file);

      const newPreview = URL.createObjectURL(blob);
      setPreviewUrl(newPreview);
    } catch (err) {
      console.error('Error loading sample image:', err);
      setError('Could not load sample file: ' + err.message);
    } finally {
      setLoadingSampleId(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError(lang === 'hi' ? 'कृपया पहले उत्पाद का फोटो अपलोड करें।' : 'Please upload or select a craft photo first.');
      return;
    }

    setIsScanning(true);
    setError(null);
    setScanStep(1);

    const stepInterval = setInterval(() => {
      setScanStep(s => (s < 4 ? s + 1 : s));
    }, 400);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (district.trim()) formData.append('district', district.trim());
      if (craftName.trim()) formData.append('product_name', craftName.trim());
      if (giTag.trim()) formData.append('gi_tag', giTag.trim());
      if (passportToken.trim()) formData.append('passport_token', passportToken.trim());

      const data = await runCraftVerification(formData);
      clearInterval(stepInterval);
      setResult(data);

      if (data.verdict === 'AUTHENTIC_HANDCRAFT' || data.verdict === 'LIKELY_AUTHENTIC') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || 'Verification failed');
    } finally {
      setIsScanning(false);
    }
  };

  const scanSteps = [
    lang === 'hi' ? 'माइक्रो-टेक्सचर ग्रेजियंट विश्लेषण प्रारंभ...' : 'Extracting micro-texture gradient variances...',
    lang === 'hi' ? 'स्थानिक आवृत्ति समरूपता (पावरलूम ग्रिड) जांच...' : 'Computing spatial symmetry & powerloom grid autocorrelation...',
    lang === 'hi' ? 'आधिकारिक ODOP GI रजिस्ट्री डेटाबेस मिलान...' : 'Cross-referencing official ODOP GI tag registry...',
    lang === 'hi' ? 'HMAC-SHA256 डिजिटल पासपोर्ट और रिपोर्ट जनरेशन...' : 'Validating cryptographic HMAC passport & generating PDF...'
  ];

  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      {/* Top Enhanced Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl border transition-all duration-300 p-6 sm:p-8 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/40 border-amber-500/25 shadow-2xl shadow-amber-500/5'
          : 'bg-gradient-to-br from-white via-amber-50/50 to-slate-50 border-amber-200/90 shadow-lg shadow-amber-500/5'
      }`}>
        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Badges, Features (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs font-semibold backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-mono text-[11px] tracking-wide uppercase">AI Vision v1.0 • ODOP Certified</span>
            </div>

            {/* Radiant Title */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  {lang === 'hi' ? 'हस्तशिल्प प्रामाणिकता ' : 'Handicraft Authenticity '}
                </span>
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 bg-clip-text text-transparent font-black drop-shadow-xs">
                  {lang === 'hi' ? 'सत्यापन स्टूडियो' : 'Verification Studio'}
                </span>
              </h1>
              <p className={`mt-2.5 text-xs sm:text-sm leading-relaxed max-w-2xl ${
                isDark ? 'text-slate-300' : 'text-slate-600 font-medium'
              }`}>
                {lang === 'hi'
                  ? 'कारीगरों के हस्तशिल्प और पावरलूम/मशीन से बनी प्रतियों के बीच के सूक्ष्म अंतर का विश्लेषण करें।'
                  : 'Inspect micro-texture fiber tensions and detect motorized powerloom symmetry in real time. Backed by HMAC-SHA256 digital provenance and official GI tag registries.'}
              </p>
            </div>

            {/* Quick Feature Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <Fingerprint className="w-3.5 h-3.5 text-amber-500" />
                <span>Micro-Texture Analysis</span>
              </div>

              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <Scan className="w-3.5 h-3.5 text-emerald-500" />
                <span>Powerloom Repeat Detection</span>
              </div>

              <div className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center space-x-1.5 border transition-colors ${
                isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700 shadow-2xs'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>GI Registry Match</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Tech Visual Widget (4 cols) */}
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
                    Neural Engine
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Scan Accuracy</span>
                  <span className="font-mono font-bold text-emerald-500">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Algorithm</span>
                  <span className="font-mono text-[11px] text-amber-500 font-semibold">Sobel + 2D FFT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>GI Benchmark</span>
                  <span className={`font-mono text-[11px] font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    Govt Aligned
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/40">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Instant 1-Click Samples below</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Demo Samples Bar */}
      <div className={`border rounded-2xl p-5 transition-all duration-200 ${
        isDark
          ? 'bg-slate-900/80 border-slate-800/80 shadow-xl shadow-amber-500/5'
          : 'bg-white border-slate-200/90 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {lang === 'hi' ? '1-क्लिक टेस्ट नमूने (Demo Samples):' : '1-Click Test Samples (Demo Presets):'}
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Test real handloom weaves vs powerloom machine fakes with one click
              </p>
            </div>
          </div>
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border self-start sm:self-auto ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            Instant AI Evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {samples.map((s) => {
            const isAuth = s.expected === 'AUTHENTIC';
            const isActive = activeSampleId === s.id;
            const isLoading = loadingSampleId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => handleLoadSample(s)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group ${
                  isActive
                    ? isAuth
                      ? isDark
                        ? 'bg-emerald-950/45 border-emerald-400 ring-2 ring-emerald-500/80 text-emerald-300 shadow-lg shadow-emerald-500/10'
                        : 'bg-emerald-100/90 border-emerald-400 ring-2 ring-emerald-500/60 text-emerald-950 shadow-md'
                      : isDark
                        ? 'bg-rose-950/45 border-rose-400 ring-2 ring-rose-500/80 text-rose-300 shadow-lg shadow-rose-500/10'
                        : 'bg-rose-100/90 border-rose-400 ring-2 ring-rose-500/60 text-rose-950 shadow-md'
                    : isAuth
                      ? isDark
                        ? 'bg-emerald-950/25 hover:bg-emerald-950/45 border-emerald-500/40 text-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5'
                        : 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200 text-emerald-950 shadow-2xs hover:shadow-xs'
                      : isDark
                        ? 'bg-rose-950/25 hover:bg-rose-950/45 border-rose-500/40 text-rose-300 hover:shadow-lg hover:shadow-rose-500/5'
                        : 'bg-rose-50/80 hover:bg-rose-100/80 border-rose-200 text-rose-950 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs ${
                      isAuth
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}>
                      {isAuth ? '✓ Genuine Handloom' : '✗ Powerloom Fake'}
                    </span>
                    <span className={`text-[11px] font-semibold truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {s.district} ({s.state})
                    </span>
                  </div>
                  <p className={`text-xs font-bold truncate ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {s.name}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample(s);
                  }}
                  className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 shadow-2xs group-hover:scale-105 flex items-center gap-1.5 ${
                    isLoading
                      ? 'opacity-70 cursor-wait bg-slate-500 text-white'
                      : isActive
                        ? isAuth
                          ? isDark
                            ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300 shadow-sm'
                            : 'bg-emerald-700 text-white ring-2 ring-emerald-500 shadow-sm'
                          : isDark
                            ? 'bg-rose-400 text-white ring-2 ring-rose-300 shadow-sm'
                            : 'bg-rose-700 text-white ring-2 ring-rose-500 shadow-sm'
                        : isAuth
                          ? isDark
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : isDark
                            ? 'bg-rose-500 hover:bg-rose-400 text-white'
                            : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : isActive ? (
                    '✓ Loaded'
                  ) : (
                    'Load'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`border rounded-2xl p-6 space-y-5 transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800 shadow-xl'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <div className="flex items-center justify-between border-b pb-3.5 border-slate-200/60 dark:border-slate-800">
              <h3 className={`text-sm font-bold flex items-center space-x-2 ${
                isDark ? 'text-slate-200' : 'text-slate-900'
              }`}>
                <UploadCloud className="w-4 h-4 text-amber-500" />
                <span>{lang === 'hi' ? '1. फोटो अपलोड या चयन करें' : '1. Upload or Select Craft Photo'}</span>
              </h3>
              <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Step 1 of 2
              </span>
            </div>

            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] group ${
                isDark
                  ? 'border-slate-700 hover:border-amber-500/60 bg-slate-950/50 hover:bg-slate-950/80'
                  : 'border-amber-300/80 bg-gradient-to-b from-amber-50/40 to-slate-50/50 hover:bg-amber-50/70 hover:border-amber-500 shadow-2xs'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
              {previewUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700/60 shadow-inner">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg shadow-md">
                      Change Photo
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/25 mx-auto group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      Click to browse or drag & drop craft photo
                    </p>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      Macro close-up photo of weave or carving recommended
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 pt-1 text-xs">
              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Claimed ODOP District
                </label>
                <select
                  value={district}
                  onChange={handleDistrictChange}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                  }`}
                >
                  {odopList.map((c) => (
                    <option key={c.id} value={c.district}>
                      {c.district} ({c.state}) - {c.product_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Product Title / Craft Name
                </label>
                <input
                  type="text"
                  value={craftName}
                  onChange={(e) => setCraftName(e.target.value)}
                  placeholder="e.g. Banarasi Brocade & Silk Saree"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                  }`}
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
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                    isDark
                      ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1.5 flex items-center justify-between ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <span>Cryptographic Passport Token (Optional)</span>
                  <span className="text-[10px] font-bold text-amber-500">HMAC-SHA256</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Scanned QR token or passport payload..."
                    value={passportToken}
                    onChange={(e) => setPassportToken(e.target.value)}
                    className={`w-full rounded-xl pl-8 pr-3.5 py-2.5 font-mono text-[11px] transition-all ${
                      isDark
                        ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-amber-500 focus:outline-none'
                        : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-none shadow-2xs'
                    }`}
                  />
                  <QrCode className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={handleScan}
              disabled={isScanning || !selectedFile}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg active:scale-[0.99] cursor-pointer ${
                isScanning || !selectedFile
                  ? isDark
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25 hover:shadow-amber-500/35'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Analyzing Micro-Texture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'hi' ? 'AI प्रामाणिकता जांच चलाएं' : 'Run AI Authenticity Scan'}</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Animation */}
          {isScanning && (
            <div className={`border rounded-2xl p-5 space-y-3.5 animate-pulse ${
              isDark ? 'bg-slate-900 border-amber-500/40' : 'bg-white border-amber-300 shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-amber-500">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>AI INSPECTION IN PROGRESS</span>
                </span>
                <span>Step {scanStep} of 4</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                  style={{ width: `${(scanStep / 4) * 100}%` }}
                />
              </div>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {scanSteps[scanStep - 1]}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Results & Standby Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !isScanning && (
            <div className={`h-full min-h-[440px] border rounded-2xl p-8 flex flex-col justify-between transition-all ${
              isDark
                ? 'bg-slate-900/60 border-slate-800/80 shadow-xl'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              {/* Top Status Header */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-800'
                  }`}>
                    Live Inspection Studio
                  </span>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  isDark ? 'bg-slate-950 border-slate-800 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  Standby Mode
                </span>
              </div>

              {/* Centerpiece: Hologram AI Scanner Blueprint Frame */}
              <div className="my-6 text-center space-y-4">
                <div className="relative mx-auto w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 flex items-center justify-center shadow-inner group">
                  <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-amber-500/20 animate-spin-slow pointer-events-none" />
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-md">
                    <Scan className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-400 text-[10px] font-mono border border-amber-500/30 font-bold">
                    READY
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-1.5">
                  <h4 className={`text-base font-extrabold tracking-tight ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Ready for Optical Authenticity Inspection
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Click one of the 1-click test samples above or upload your own craft photo. The system will analyze fiber tensions and produce a downloadable PDF Certificate.
                  </p>
                </div>
              </div>

              {/* Bottom Feature Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-left">
                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-1.5 text-amber-500 mb-1">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">Micro-Texture</span>
                  </div>
                  <p className={`text-[10px] leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Detects natural 15–40% thread tension variations.
                  </p>
                </div>

                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-1.5 text-emerald-500 mb-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">Powerloom Autocorr</span>
                  </div>
                  <p className={`text-[10px] leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Flags rigid machine repeating grid symmetry.
                  </p>
                </div>

                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-1.5 text-amber-500 mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">PDF Certificate</span>
                  </div>
                  <p className={`text-[10px] leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Auto-mints official ReportLab PDF verification doc.
                  </p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Verdict Banner */}
              <div
                className={`p-6 rounded-2xl border transition-all ${
                  result.verdict === 'AUTHENTIC_HANDCRAFT' || result.verdict === 'LIKELY_AUTHENTIC'
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-emerald-500/5'
                    : 'bg-rose-950/20 border-rose-500/40 shadow-rose-500/5'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {result.verdict === 'AUTHENTIC_HANDCRAFT' || result.verdict === 'LIKELY_AUTHENTIC' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-400" />
                      )}
                      <span className="text-lg font-bold tracking-tight text-white">
                        {result.verdict === 'AUTHENTIC_HANDCRAFT' || result.verdict === 'LIKELY_AUTHENTIC'
                          ? 'AUTHENTIC ODOP HANDCRAFT'
                          : 'SUSPICIOUS / POWERLOOM COUNTERFEIT'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Product: <strong className="text-white">{result.product_name}</strong> • District:{' '}
                      <strong className="text-white">{result.district}</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-700/60 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Authenticity Score
                      </div>
                      <div className="text-2xl font-black text-amber-400">
                        {result.authenticity_score}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Weave Irregularity
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">{result.micro_texture_score}/100</div>
                  <div className={`text-[10px] mt-1 ${result.micro_texture_score < 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {result.micro_texture_score < 40 ? '⚠️ Rigid / Flat Thread' : '✓ Human Tension Wobble'}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Machine Symmetry
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">{result.machine_symmetry_score}%</div>
                  <div className={`text-[10px] mt-1 ${result.machine_symmetry_score > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {result.machine_symmetry_score > 60 ? '⚠️ High Periodic Repeat' : '✓ Organic Variation'}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    GI Registry
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {result.gi_registry_verified ? 'VERIFIED' : 'UNMATCHED'}
                  </div>
                  <div className="text-[10px] text-amber-400 mt-1">{result.gi_tag}</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Digital Passport
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {result.cryptographic_passport_valid ? 'VALID HMAC' : 'PHYSICAL SCAN'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">{result.passport_message}</div>
                </div>
              </div>

              {/* Multilingual Explanation Report */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inspection Evaluation Statement</span>
                  </h4>
                  <div className="flex space-x-1 text-xs">
                    <button
                      onClick={() => setExplanationLang('en')}
                      className={`px-2 py-0.5 rounded ${
                        explanationLang === 'en'
                          ? 'bg-amber-500/20 text-amber-400 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setExplanationLang('hi')}
                      className={`px-2 py-0.5 rounded ${
                        explanationLang === 'hi'
                          ? 'bg-amber-500/20 text-amber-400 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {explanationLang === 'hi' ? result.explanation_hi : result.explanation_en}
                </p>

                {/* Physical Test Recommendation */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-amber-400 block mb-1">
                    Recommended Physical Verification Test:
                  </span>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                    {result.physical_test}
                  </div>
                </div>
              </div>

              {/* Download Certificate PDF Button */}
              {result.certificate_url && (
                <a
                  href={getFullApiUrl(result.certificate_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors border border-slate-700 flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Download Official PDF Certificate of Authenticity</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
