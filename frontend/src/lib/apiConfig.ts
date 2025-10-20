// Smart API URL detection utility
// Automatically chooses localhost for development or production URL based on hostname

export const getApiBaseUrl = (): string => {
  // Check for environment variable first (highest priority)
  if ((import.meta as any).env?.VITE_API_URL) {
    console.log('Using VITE_API_URL:', (import.meta as any).env.VITE_API_URL);
    return (import.meta as any).env.VITE_API_URL;
  }
  
  // Auto-detect based on current hostname
  const hostname = window.location.hostname;
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
    return 'http://localhost:3001';
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

// Export the detected URL for easy access
export const API_BASE_URL = getApiBaseUrl();
