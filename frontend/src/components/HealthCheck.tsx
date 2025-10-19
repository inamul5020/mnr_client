import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function HealthCheck() {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 
          (window.location.hostname === 'client.mnrlk.com' ? 'https://api.mnrlk.com' : 'http://localhost:3001');
        
        setApiUrl(API_BASE_URL);
        
        // Use direct fetch since health endpoint is not under /api
        const response = await fetch(`${API_BASE_URL}/health`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'OK') {
            setStatus('healthy');
          } else {
            setStatus('error');
            setError(`API returned: ${data.status}`);
          }
        } else {
          setStatus('error');
          setError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Connection failed');
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <div className="flex items-center space-x-2">
        {status === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
        {status === 'healthy' && <CheckCircle className="h-4 w-4 text-green-500" />}
        {status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
        
        <div>
          <div className="text-sm font-medium">
            {status === 'checking' && 'Checking API...'}
            {status === 'healthy' && 'API Connected'}
            {status === 'error' && 'API Error'}
          </div>
          <div className="text-xs text-gray-500">
            API: {apiUrl}
          </div>
          {error && (
            <div className="text-xs text-red-500 mt-1">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
