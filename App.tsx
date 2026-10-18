import React, { useEffect, useState } from 'react';
import { createUGTAuthClient, UGTAuthClient } from './lib/ugt-auth-client';

function App() {
  const [authClient, setAuthClient] = useState<UGTAuthClient | null>(null);

  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = await createUGTAuthClient();
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
