// Test script to verify API detection logic
const { getApiBaseUrl } = require('./frontend/src/lib/apiConfig.ts');

// Mock window.location for testing
global.window = {
  location: {
    hostname: 'localhost'
  }
};

console.log('Testing localhost detection:');
console.log('API URL:', getApiBaseUrl());

// Test production domain
global.window.location.hostname = 'client.mnrlk.com';
console.log('\nTesting production domain detection:');
console.log('API URL:', getApiBaseUrl());

// Test with localhost env var on production domain
process.env.VITE_API_URL = 'http://localhost:3001';
global.window.location.hostname = 'client.mnrlk.com';
console.log('\nTesting safeguard (localhost env on production domain):');
console.log('API URL:', getApiBaseUrl());
