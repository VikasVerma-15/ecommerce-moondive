/**
 * Base URL for backend API calls.
 * Set NEXT_PUBLIC_API_URL in Vercel to your Render backend, e.g.:
 * https://your-app.onrender.com/api/v1
 */
export function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001/api/v1';
  }
  // Server-side on Vercel needs an absolute URL (relative /backend fails in Node fetch)
  const siteUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  if (siteUrl) {
    return `${siteUrl.replace(/\/$/, '')}/backend`;
  }
  return '/backend';
}

export function getApiUrl(path = '') {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  if (!normalizedPath) return base;
  return `${base}/${normalizedPath}`;
}
