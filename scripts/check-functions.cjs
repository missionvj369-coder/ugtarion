const https = require('https');

const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

const fixSQL = `
SELECT routine_name, data_type, parameter_name, parameter_mode
FROM information_schema.parameters 
WHERE specific_name LIKE '%register_user_with_password%';
`;

const data = JSON.stringify({ query: fixSQL });

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: '/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();