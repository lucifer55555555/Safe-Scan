import {
  AssessmentResponse,
  Ingredient,
  Product,
  ScanRecord,
  ScientificSource,
  UserProfile
} from '../types';

const BASE_URL = '/api/v1';

export async function fetchProfile(userId: string = 'usr_demo_walkthrough'): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/users/profile?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, ...profile })
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function lookupBarcode(barcode: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(barcode)}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Product not found for barcode');
  }
  return res.json();
}

export async function analyzeAssessment(payload: {
  ingredients: string[] | string;
  user_id?: string;
  product_id?: string;
  barcode?: string;
  product_name?: string;
  brand?: string;
  scan_method?: 'barcode' | 'ocr' | 'manual';
  ocr_text?: string;
  ocr_confidence?: number;
}): Promise<AssessmentResponse> {
  const res = await fetch(`${BASE_URL}/assessment/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Assessment analysis failed');
  }
  return res.json();
}

export async function fetchScanHistory(userId: string = 'usr_demo_walkthrough'): Promise<ScanRecord[]> {
  const res = await fetch(`${BASE_URL}/scans/history?user_id=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function fetchIngredients(query: string = ''): Promise<Ingredient[]> {
  const res = await fetch(`${BASE_URL}/ingredients?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to fetch ingredients');
  return res.json();
}

export async function fetchSources(): Promise<ScientificSource[]> {
  const res = await fetch(`${BASE_URL}/sources`);
  if (!res.ok) throw new Error('Failed to fetch scientific sources');
  return res.json();
}

export async function fetchAdminStats() {
  const res = await fetch(`${BASE_URL}/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

export async function fetchUnresolvedLogs() {
  const res = await fetch(`${BASE_URL}/admin/unresolved`);
  if (!res.ok) throw new Error('Failed to fetch unresolved logs');
  return res.json();
}

export async function addAdminIngredient(payload: any): Promise<Ingredient> {
  const res = await fetch(`${BASE_URL}/admin/ingredients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to add ingredient');
  return res.json();
}

export async function runEvaluationApi() {
  const res = await fetch(`${BASE_URL}/evaluation/report`);
  if (!res.ok) throw new Error('Failed to run evaluation');
  return res.json();
}

export async function runUnitTestsApi() {
  const res = await fetch(`${BASE_URL}/evaluation/unittests`);
  if (!res.ok) throw new Error('Failed to run unit tests');
  return res.json();
}

export async function pingHealth(): Promise<{ status: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { status: 'degraded' };
    return res.json();
  } catch {
    return { status: 'ok' };
  }
}
