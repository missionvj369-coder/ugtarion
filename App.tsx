import React, { useEffect, useState } from 'react';
import { createUGTAuthClient, UGTAuthClient } from './lib/ugt-auth-client';

function getDefaultAuthConfig() {
  return {
    authDomain: import.meta.env.VITE_AUTH_DOMAIN || 'auth.ugt.org',
    clientId: import.meta.env.VITE_PLATFORM_CLIENT_ID || 'ugt_portal_client',
    redirectUri:
      import.meta.env.VITE_PLATFORM_REDIRECT_URI ||
      (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback'),
    scope: 'profile email rankings',
    usePKCE: true,
  };
}

function App() {
  const [authClient, setAuthClient] = useState<UGTAuthClient | null>(null);

  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = createUGTAuthClient(getDefaultAuthConfig());
        setAuthClient(client);
      } catch (err) {
        console.warn('UGT Auth Client initialization failed:', err);
      }
    };
    initAuthClient();
  }, []);

  // The HTML file handles all routing natively (hash-based router in index.html).
  // React only initializes the auth client for QR/OAuth features; it does not
  // intercept any routes. Return null so the HTML's own Universal ID portal
  // at #/universal-id works without interference.
  return null;
}

export default App;
