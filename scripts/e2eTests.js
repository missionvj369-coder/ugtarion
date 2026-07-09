const fetch = globalThis.fetch || require('node-fetch');

async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const txt = await res.text();
  let json;
  try { json = JSON.parse(txt); } catch (e) { json = txt; }
  return { status: res.status, body: json };
}

async function get(url) {
  const res = await fetch(url);
  const txt = await res.text();
  try { return { status: res.status, body: JSON.parse(txt) }; } catch (e) { return { status: res.status, body: txt }; }
}

(async () => {
  const base = 'http://localhost:4000/api';
  const timestamp = Date.now();
  // 1) Register
  const regPayload = {
    name: `E2E User ${timestamp}`,
    dob: '1990-01-01',
    email: `e2e+${timestamp}@example.com`,
    phone: '+10000000000',
    pincode: '123456',
    city: 'TestCity',
    district: 'TestDistrict',
    state: 'TestState',
    nation: 'TestNation'
  };

  console.log('1) Registering new user...');
  const reg = await post(`${base}/register`, regPayload);
  console.log('   status', reg.status);
  if (reg.status !== 200) return process.exit(2);
  const created = reg.body;

  console.log('2) Attempt duplicate register with same email...');
  const dup = await post(`${base}/register`, { ...regPayload, name: 'Duplicate' });
  console.log('   status', dup.status);
  if (dup.status === 200) { console.error('Duplicate registration unexpectedly succeeded'); return process.exit(3); }

  console.log('3) Login with identifier (email or universal id)...');
  const login = await post(`${base}/login`, { identifier: regPayload.email });
  console.log('   status', login.status);
  if (login.status !== 200) { console.error('Login failed'); return process.exit(4); }

  console.log('4) Fetch count endpoint...');
  const count = await get(`${base}/count`);
  console.log('   status', count.status, 'body', count.body);
  if (count.status !== 200) return process.exit(5);

  console.log('5) Fetch created profile by uid...');
  const uid = created.id;
  const profile = await get(`${base}/profile/${uid}`);
  console.log('   status', profile.status);
  if (profile.status !== 200) return process.exit(6);

  console.log('All tests passed.');
  process.exit(0);
})();
