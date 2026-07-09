Netlify Deployment

Steps to deploy the serverless backend and frontend to Netlify:

1. Push this repository to GitHub.

2. In Netlify, create a new Site from Git and connect the repository.

3. Set the following Environment Variables in the Netlify site settings (Settings → Build & deploy → Environment):

- `VITE_SUPABASE_URL` = https://<your-project>.supabase.co
- `VITE_SUPABASE_ANON_KEY` = <your-public-anon-key>
- `SUPABASE_SERVICE_ROLE_KEY` = <your-service-role-key>   # Keep SECRET, do NOT expose
- `VITE_API_BASE_URL` = https://<your-site>.netlify.app/.netlify/functions/api
- `DEV_ORIGIN` = https://<your-site>.netlify.app

4. Netlify will use the `netlify/functions` directory for serverless functions. The single function `api` exposes endpoints under:

- `/.netlify/functions/api/count`
- `/.netlify/functions/api/profile/:uid`
- `/.netlify/functions/api/register`
- `/.netlify/functions/api/login`

5. Build settings (defaults are fine):
- Build command: `npm run build`
- Publish directory: `dist`

6. After deploy, update your frontend environment (if needed) so `VITE_API_BASE_URL` points to the function path.

Security notes:
- Do not commit `SUPABASE_SERVICE_ROLE_KEY` to the repo. Use Netlify's environment UI or Vault integrations.
- Restrict `DEV_ORIGIN` to your Netlify site URL to limit CORS.
