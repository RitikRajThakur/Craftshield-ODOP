const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:8000'
).replace(/\/$/, '');

const API_BASE = `${BACKEND_URL}/api`;

export function getBackendBaseUrl() {
  return BACKEND_URL;
}

export function getFullApiUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${clean}`;
}

export async function fetchODOPCrafts() {
  const candidateUrls = [`/api/odop/crafts`, `${API_BASE}/odop/crafts`];
  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // try next candidate
    }
  }
  throw new Error('Failed to fetch ODOP crafts');
}

export async function fetchDemoSamples() {
  const candidateUrls = [`/api/samples`, `${API_BASE}/samples`];
  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // try next candidate
    }
  }
  throw new Error('Failed to fetch demo samples');
}

export function getSampleImageUrl(filename) {
  return `${API_BASE}/sample-image/${encodeURIComponent(filename)}`;
}

export async function fetchSampleImageBlob(filename) {
  const candidateUrls = [
    `/samples/${filename}`,
    `/${filename}`,
    `${API_BASE}/sample-image/${encodeURIComponent(filename)}`,
    `/api/sample-image/${encodeURIComponent(filename)}`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 0 && !blob.type.includes('text/html')) {
          return blob;
        }
      }
    } catch {
      // try next candidate
    }
  }
  throw new Error(`Unable to fetch sample image "${filename}" from server or local assets`);
}

export async function runCraftVerification(formData) {
  const candidateUrls = [`/api/verify`, `${API_BASE}/verify`];
  let lastError = null;

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        return await res.json();
      }
      const errorData = await res.json().catch(() => ({}));
      lastError = new Error(errorData.detail || `Verification scan failed (${res.status})`);
      break; // Specific HTTP error returned by server, do not retry blindly
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Backend verification service is unreachable at ' + API_BASE);
}

export async function mintProductPassport(passportData) {
  const candidateUrls = [`/api/passport/mint`, `${API_BASE}/passport/mint`];
  let lastError = null;

  // Never send localhost or 127.0.0.1 as app_url for QR codes;
  // let backend resolve the host LAN IP (192.168.1.3) or production domain
  let clientAppUrl = undefined;
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      clientAppUrl = origin;
    }
  }

  const payload = {
    ...passportData,
    app_url: passportData.app_url || process.env.NEXT_PUBLIC_APP_URL || clientAppUrl,
  };

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
      const errorData = await res.json().catch(() => ({}));
      lastError = new Error(errorData.detail || `Failed to mint passport (${res.status})`);
      break;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to mint passport');
}

export async function verifyPassport(passportId, token = null) {
  const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';
  const candidateUrls = [
    `/api/passport/verify/${encodeURIComponent(passportId)}${tokenQuery}`,
    `${API_BASE}/passport/verify/${encodeURIComponent(passportId)}${tokenQuery}`
  ];

  let lastError = null;
  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
      const data = await res.json().catch(() => ({}));
      lastError = new Error(data.message || data.detail || `Failed to verify passport (${res.status})`);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Verification service is unreachable');
}

export async function getPassportById(passportId) {
  const candidateUrls = [
    `/api/passport/${encodeURIComponent(passportId)}`,
    `${API_BASE}/passport/${encodeURIComponent(passportId)}`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // try next candidate
    }
  }
  throw new Error(`Passport ${passportId} not found`);
}
