const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function generatePlan(idea) {
  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Erreur serveur (${response.status})`);
  }

  const data = await response.json();
  return data.plan;
}
