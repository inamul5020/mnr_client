// Smart API URL detection utility
// Automatically chooses localhost for development or production URL based on hostname

export const getApiBaseUrl = (): string => {
  // Check for environment variable first (highest priority)
  const envUrl = (import.meta as any).env?.VITE_API_URL as string | undefined;
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  
  if (envUrl) {
    // SAFEGUARD: If running on mnrlk.com but env points to localhost, override to production
    if ((hostname.includes('mnrlk.com') || hostname.includes('mnr')) && envUrl.includes('localhost')) {
      console.log('Overriding localhost VITE_API_URL on production domain -> https://api.mnrlk.com');
      return 'https://api.mnrlk.com';
    }
    console.log('Using VITE_API_URL:', envUrl);
    return envUrl;
  }
  
  // Auto-detect based on current hostname
  console.log('Detected hostname:', hostname);
  
  // Development environments
  if (
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') ||
    hostname.includes('local') ||
    hostname.includes('dev')
  ) {
    console.log('Using localhost API URL');
    return 'http://localhost:3021';
  }
  
  // Production environment
  if (hostname.includes('mnrlk.com') || hostname.includes('mnr')) {
    console.log('Using production API URL');
    return 'https://api.mnrlk.com';
  }
  
  // Default to production for any other scenario
  console.log('Using default production API URL');
  return 'https://api.mnrlk.com';
};

// Export a function that gets the URL at runtime, not build time
export const API_BASE_URL = getApiBaseUrl();
