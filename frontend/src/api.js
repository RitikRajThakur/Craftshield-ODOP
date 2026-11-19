const API_BASE = '/api';

export async function fetchODOPCrafts() {
  const res = await fetch(`${API_BASE}/odop/crafts`);
  if (!res.ok) throw new Error('Failed to fetch ODOP crafts');
  return res.json();
}

export async function fetchDemoSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to fetch demo samples');
  return res.json();
}

export function getSampleImageUrl(filename) {
  return `${API_BASE}/sample-image/${filename}`;
}

export async function fetchSampleImageBlob(filename) {
  const candidateUrls = [
    `/samples/${filename}`,
    `/${filename}`,
    `${API_BASE}/sample-image/${filename}`
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
      // try next URL candidate
    }
  }
  throw new Error(`Unable to fetch sample image "${filename}" from server or local assets`);
}

export async function runCraftVerification(formData) {
  const res = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Verification scan failed');
  }
  return res.json();
}

export async function mintProductPassport(passportData) {
  const res = await fetch(`${API_BASE}/passport/mint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(passportData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to mint passport');
  }
  return res.json();
}
