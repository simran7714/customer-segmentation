const API_BASE = '/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchSampleDatasets() {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to load sample datasets');
  return res.json();
}

export async function uploadDataset(file, sampleId, missingStrategy = 'drop') {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  } else if (sampleId) {
    formData.append('sample_id', sampleId);
  }
  formData.append('missing_strategy', missingStrategy);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to upload dataset');
  }
  return res.json();
}

export async function calculateElbow(features, scaler = 'standard', maxK = 10) {
  const res = await fetch(`${API_BASE}/elbow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features, scaler, max_k: maxK })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to calculate elbow curve');
  }
  return res.json();
}

export async function runClustering(features, k, scaler = 'standard') {
  const res = await fetch(`${API_BASE}/cluster`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features, k, scaler })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Clustering execution failed');
  }
  return res.json();
}

export function getReportHtmlUrl() {
  return `${API_BASE}/report/html`;
}

export function getExportCsvUrl() {
  return `${API_BASE}/export/csv`;
}
