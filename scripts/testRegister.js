(async () => {
  const fetch = globalThis.fetch;
  // Hits the Cloudflare Worker directly (run `npx wrangler dev` first).
  const url = process.env.API_BASE
    ? `${process.env.API_BASE}/register`
    : 'http://localhost:8787/api/register';
  const timestamp = Date.now();
  const payload = {
    name: `Test User ${timestamp}`,
    dob: '1990-01-01',
    email: `test+${timestamp}@example.com`,
    phone: '+10000000000',
    pincode: '000000',
    city: 'Testville',
    district: 'Testdistrict',
    state: 'Teststate',
    nation: 'Testland',
    password: 'Str0ngPass!xyz',
  };

  const maxAttempts = 25;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      console.log('STATUS', res.status);
      console.log('BODY', text);
      if (res.ok) {
        console.log('Registration test succeeded.');
        process.exit(0);
      } else {
        console.error('Registration failed with status', res.status);
        process.exit(2);
      }
    } catch (err) {
      if (i === maxAttempts - 1) {
        console.error('Failed to reach backend after retries:', err);
        process.exit(3);
      }
      // wait 1s
      await new Promise(r => setTimeout(r, 1000));
    }
  }
})();
