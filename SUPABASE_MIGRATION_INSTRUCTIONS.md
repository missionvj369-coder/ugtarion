# Supabase Migration Instructions

## Problem Summary
The provided Supabase key is a **JWT** (starts with "eyJ"), but Supabase's REST API requires the **service_role secret key** in **sb_secret_xxx** format.

## Key Format Differences
| Format | Prefix | Purpose | Works for REST API? |
|--------|--------|---------|---------------------|
| JWT | "eyJ..." | Auth API (Authorization: Bearer) | ❌ No |
| Publishable | "sb_publishable_xxx" | Client-side | ❌ No |
| **Secret** | **"sb_secret_xxx"** | **Server-side (service_role)** | **✅ Yes** |

## Files Modified/Created
- `.env.server` - Updated with key format documentation
- `scripts/check-key-format.mjs` - Validates key format
- `scripts/run-migrations-direct.mjs` - Now validates key before migration
- `scripts/execute-migration.mjs` - Now loads key from environment

## What You Need to Do
1. Go to: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/settings/api-keys
2. Find the **service_role** secret key (sb_secret_xxx format)
3. Update `.env.server` with the correct key
4. Run: `node scripts/check-key-format.mjs` to verify
5. Run: `node scripts/run-migrations-direct.mjs` to apply migrations

## If You Need Help
- Supabase Documentation: https://supabase.com/docs/guides/platforms/supabase-cli#database-migrations
- API Keys Guide: https://supabase.com/docs/guides/getting-started/api-keys

## Current State
The JWT provided is only useful for:
- Auth API calls (Authorization: Bearer)
- Client-side Supabase clients (not for server)

It will NOT work with:
- `/pg` endpoint for raw SQL
- `/rest/v1/rpc/exec_sql` for RPC calls
- Any REST API with apikey header
