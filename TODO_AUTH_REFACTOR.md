# Auth System Refactor - Email/Mobile/UID + Password with Forgot Password

## Task List

### Backend (Already Done - netlify/functions/auth.js)
- [x] Added `/auth/register` endpoint - Register with password
- [x] Added `/auth/login` endpoint - Login with identifier (email/phone/UID) + password
- [x] Added `/auth/forgot-password` endpoint - Request password reset
- [x] Added `/auth/verify-reset-token` endpoint - Verify reset token
- [x] Added `/auth/reset-password` endpoint - Reset password with token
- [x] Password strength validation (8+ chars, uppercase, lowercase, number)
- [x] Password hashing with bcrypt (via Supabase RPC)

### Database (Already Done - supabase/migrations/005_password_auth_and_reset.sql)
- [x] Added password_hash column to profiles
- [x] Added password_reset_tokens table
- [x] Created register_user_with_password RPC
- [x] Created login_with_password RPC
- [x] Created request_password_reset RPC
- [x] Created verify_password_reset_token RPC
- [x] Created reset_password RPC

### Client Library (Already Done - lib/ugt-auth-client.ts)
- [x] Added registerWithPassword method
- [x] Added loginWithPassword method
- [x] Added requestPasswordReset method
- [x] Added verifyResetToken method
- [x] Added resetPassword method
- [x] Added TypeScript types for all new methods

### Frontend - UniversalIdPortal.tsx (TO DO)
- [ ] Remove "Email OTP" tab from navigation
- [ ] Add "Forgot Password" tab/flow
- [ ] Update Register form to include password field with strength validation
- [ ] Update Login form to use identifier (email/phone/UID) + password
- [ ] Add Forgot Password flow:
  - Step 1: Enter identifier (email/phone/UID) to request reset
  - Step 2: Verify reset token (enter token received via email)
  - Step 3: Set new password with strength validation
- [ ] Update handleRegister to use registerWithPassword API
- [ ] Update handleLogin to use loginWithPassword API
- [ ] Add handleForgotPassword, handleVerifyResetToken, handleResetPassword handlers
- [ ] Remove OTP-related state (otpStep, otpMode, otpEmail, otpCode, otpSent, otpResendCooldown)
- [ ] Remove OTP-related handlers (handleOtpEmailSubmit, handleOtpVerifySubmit, handleResendOtp)
- [ ] Update tab navigation to: Register | Login | Forgot Password
- [ ] Add password strength indicator UI
- [ ] Add proper error/success handling for password flows
- [ ] Update client API calls to use ugt-auth-client methods

### Testing
- [ ] Test registration with password
- [ ] Test login with email/phone/UID + password
- [ ] Test forgot password flow
- [ ] Test reset password flow
- [ ] Verify OTP is completely removed from UI
- [ ] Test password strength validation