# Authentication System Setup Instructions

## Issues Identified

1. **Missing Database Functions**: The `register_user_with_password` function doesn't exist in your Supabase database
2. **Brevo API Key Not Configured**: Password reset emails won't send without a valid Brevo API key

## Solution

### Step 1: Run the Combined Migration in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `mgrdamgdpnbtxgxdxwbs`
3. Navigate to **SQL Editor** (in the left sidebar)
4. Copy the entire contents of `supabase/migrations/combined-auth-migration.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute

This will create all the required functions:
- `register_user_with_password`
- `login_with_password`
- `request_password_reset`
- `verify_password_reset_token`
- `reset_password`
- `hash_password`
- `verify_password`
- And more...

### Step 2: Configure Brevo API Key

1. Create a Brevo account at [https://app.brevo.com](https://app.brevo.com) (free tier available)
2. Get your API key from: **Settings → API Keys**
3. Update your `.env.server` file:
   ```
   BREVO_API_KEY=your_actual_brevo_api_key_here
   BREVO_SENDER_EMAIL=your_verified_sender@domain.com
   ```
4. For production on Netlify, add these as Environment Variables in:
   **Site Settings → Environment Variables**

### Step 3: Create Brevo Email Template

In Brevo dashboard, create a transactional email template with:
- Template ID: `1` (or update `BREVO_TEMPLATE_ID` in your env)
- Include a button/link using `{{ params.RESET_URL }}`
- Subject: "Reset Your Universal Guard Trust Password"

## Testing

After completing setup, test:
1. **Registration**: Create a new account with password
2. **Login**: Login with email/phone and password
3. **Password Reset**: Request reset email and verify it arrives

## Files Modified/Created

- `supabase/migrations/combined-auth-migration.sql` - Combined migration with all auth functions
- `.env.server` - Updated with Brevo configuration (needs real API key)
- `.env.local` - Updated with Brevo configuration (needs real API key)

## Troubleshooting

### "Function not found" error
→ Run the migration in Supabase SQL Editor (Step 1)

### "Email not sending" error
→ Check BREVO_API_KEY is set correctly and not the placeholder value

### "Invalid token" error on password reset
→ Token may have expired (1 hour) or already been used

## Need Help?

Check the Supabase SQL Editor for any error messages when running the migration.