# Universal Guard Trust - Fix Implementation Plan

## Issues to Fix

### 1. Blank Screen After ID Generation/Login
- **Root Cause**: `handleRegister` and `handleLogin` in `UniversalIdPortal.tsx` don't call `setView('id-card')` after successful registration/login
- **Fix**: Add `setView('id-card')` after `setCurrentUser(data)` in both handlers

### 2. Duplicate Phone Number Not Restricted
- **Root Cause**: Database schema has `UNIQUE` on email but NOT on phone; RPC function only checks email
- **Fix**: 
  - Add `UNIQUE` constraint on `phone` column in profiles table
  - Update `register_user_atomic` RPC to check for duplicate phone
  - Update frontend validation and error handling

### 3. Comprehensive Scenario Coverage
- Form validation (email format, phone format, required fields)
- Duplicate email error handling (already exists)
- Duplicate phone error handling (NEW)
- Network error handling with retry
- Loading states during API calls
- Race condition handling in ID generation
- Session persistence on page refresh

## Implementation Steps

### Phase 1: Frontend Fixes (UniversalIdPortal.tsx)
1. Fix blank screen - add `setView('id-card')` after successful register/login
2. Add loading states for register/login buttons
3. Add phone format validation
4. Add duplicate phone error handling
5. Add network error handling with user-friendly messages

### Phase 2: Database Migration
1. Create new migration for phone UNIQUE constraint
2. Update `register_user_atomic` RPC to check duplicate phone
3. Update `login_user_atomic` if needed

### Phase 3: API Core Updates
1. Update `api-core.ts` to handle phone duplicate errors
2. Update error messages for better UX

### Phase 4: Testing & Verification
1. Build and test locally
2. Verify all scenarios work
3. Deploy migration to Supabase