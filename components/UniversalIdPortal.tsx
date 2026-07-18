import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  User,
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  LogOut,
  QrCode,
  Share2,
  Download,
  ChevronRight,
  Milestone,
  Loader2,
  X,
  LogIn,
  UserPlus,
  Shield,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  WifiOff,
  Server,
  Copy,
  Printer,
  Eye,
  EyeOff,
  MapPin,
  Hash,
  Award,
  Star,
  Layers,
  Fingerprint,
  Lock,
  Unlock,
  Zap,
  Crown,
  Target,
  Compass,
  Home,
  Building2,
  Map,
  Grid,
  Settings,
  RefreshCw,
  ExternalLink,
  Maximize2,
  Minimize2,
  Flag
} from 'lucide-react';
import {
  getRegistryCount,
  registerUser,
  getActiveUser,
  setActiveUserId,
  loginUser,
  getProfileById
} from '../lib/apiClient';
import type { UniversalIdRecord } from '../lib/apiClient';
import SectionWrapper from './SectionWrapper';
import { createUGTAuthClient, UGTAuthClient } from '../lib/ugt-auth-client';
import { registerUserWithPassword, loginWithPassword, signOutSupabase, requestPasswordReset, verifyPasswordResetToken, resetPassword } from '../lib/supabaseClient';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

interface ApiError extends Error {
  code?: string;
  status?: number;
  isNetworkError?: boolean;
  isAuthError?: boolean;
  isServerError?: boolean;
}

function classifyError(error: any): ApiError {
  const apiError: ApiError = new Error(error?.message || 'Unknown error');
  apiError.message = error?.message || 'Unknown error';
  apiError.code = error?.code;
  apiError.status = error?.status;
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    apiError.isNetworkError = true;
    apiError.message = 'Network error: Unable to connect to the registry. Please check your internet connection.';
  }
  else if (error?.message?.includes('JWT') || error?.message?.includes('auth') || error?.status === 401) {
    apiError.isAuthError = true;
    apiError.message = 'Authentication failed. Please try logging in again.';
  }
  else if (error?.message?.includes('row-level security') || error?.message?.includes('permission') || error?.status === 403) {
    apiError.isAuthError = true;
    apiError.message = 'Access denied. Please check your credentials or contact support.';
  }
  else if (error?.status >= 500 || error?.message?.includes('500') || error?.message?.includes('server')) {
    apiError.isServerError = true;
    apiError.message = 'Registry server error. Please try again in a moment.';
  }
  else if (error?.message?.includes('duplicate') || error?.message?.includes('already exists') || error?.code === '23505') {
    apiError.message = 'This email or phone is already registered. Please use a different one or log in.';
  }
  else if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
    apiError.isNetworkError = true;
    apiError.message = 'Request timed out. Please check your connection and try again.';
  }
  
  return apiError;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY_MS
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const apiError = classifyError(error);
    
    if (apiError.isAuthError || (apiError.status && apiError.status >= 400 && apiError.status < 500)) {
      throw apiError;
    }
    
    if (retries <= 0) {
      throw apiError;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

interface UniversalIdPortalProps {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onAuthChange?: (user: UniversalIdRecord | null) => void;
  authClient?: UGTAuthClient | null;
}

  // Professional ID Card Component - Memoized for performance
  // Premium design following ISO 7810 ID-1 standard (credit card format)
  const ProfessionalIdCard = React.memo(({ 
    user, 
    onCopy, 
    onPrint, 
    copied,
    showQR = true 
  }: { 
    user: UniversalIdRecord; 
    onCopy: () => void;
    onPrint: () => void;
    copied: boolean;
    showQR?: boolean;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    
    // Generate QR code data URL
    const qrDataUrl = useMemo(() => {
      if (!showQR) return '';
      const qrText = `${window.location.origin}/verify/${user.id}`;
      // Using a simple QR code service - in production, use a proper QR library
      return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(qrText)}&margin=2&color=0f0f1a&bgcolor=transparent`;
    }, [user.id, showQR]);

    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch {
        return dateStr;
      }
    };

    const formatRank = (rank: number) => `#${rank.toLocaleString()}`;

    return (
      <div 
        ref={cardRef}
        className="relative w-full max-w-sm aspect-[1.586/1] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/60 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] print:shadow-none print:border-0"
        style={{ 
          // Credit card aspect ratio (ISO 7810 ID-1: 85.60 × 53.98 mm)
          width: '100%',
          maxWidth: '340px',
        }}
        role="img"
        aria-label={`Universal ID Card for ${user.name}, ID: ${user.id}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCopy();
          }
        }}
      >
      {/* ===== LAYER 1: Base Card Material (Carbon Fiber Texture) ===== */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-zinc-950" />
        {/* Carbon fiber micro-pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v4H0V0zm4 4h4v4H4V4z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: '16px 16px'
        }} />
        {/* Subtle vertical grain */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1' height='4' viewBox='0 0 1 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0V0zm0 2h1v1H0V2z' fill='%23ffffff'/%3E%3C/svg%3E")`,
          backgroundSize: '2px 8px'
        }} />
      </div>

      {/* ===== LAYER 2: Security Guilloche Pattern (Fine Line Work) ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 340 214" preserveAspectRatio="none">
          <defs>
            <pattern id="guilloche" patternUnits="userSpaceOnUse" width="40" height="40">
              <path d="M0,20 Q20,0 40,20 Q20,40 0,20" fill="none" stroke="currentColor" strokeWidth="0.3"/>
              <path d="M20,0 Q40,20 20,40 Q0,20 20,0" fill="none" stroke="currentColor" strokeWidth="0.3"/>
            </pattern>
          </defs>
          <rect width="340" height="214" fill="url(#guilloche)" stroke="none" />
        </svg>
        {/* Rainbow holographic foil strip */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-amber-500/15" />
        {/* Holographic shimmer sweep */}
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/5 to-transparent animate-shimmer" style={{ animationDuration: '4s' }} />
      </div>

      {/* ===== LAYER 3: UV Security Features (Visible in print) ===== */}
      <div className="absolute inset-0 pointer-events-none print:block hidden" aria-hidden="true">
        {/* UV fluorescent fibers */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='340' height='214' viewBox='0 0 340 214' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10,50 Q50,30 90,50 Q130,70 170,50 Q210,30 250,50 Q290,70 330,50' fill='none' stroke='%2300ffff' stroke-width='0.5' opacity='0.3'/%3E%3Cpath d='M10,100 Q50,80 90,100 Q130,120 170,100 Q210,80 250,100 Q290,120 330,100' fill='none' stroke='%23ff00ff' stroke-width='0.5' opacity='0.3'/%3E%3Cpath d='M10,150 Q50,130 90,150 Q130,170 170,150 Q210,130 250,150 Q290,170 330,150' fill='none' stroke='%23ffff00' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover'
        }} />
      </div>

      {/* ===== LAYER 4: Card Frame & Borders ===== */}
      {/* Outer metallic border */}
      <div className="absolute inset-0 border border-gradient-to-br from-zinc-600/50 via-zinc-700/30 to-zinc-800/50 rounded-2xl pointer-events-none" aria-hidden="true" />
      {/* Inner refined border */}
      <div className="absolute inset-1 border border-zinc-700/40 rounded-xl pointer-events-none" aria-hidden="true" />
      {/* Inner highlight */}
      <div className="absolute inset-2 border border-zinc-700/20 rounded-lg pointer-events-none" aria-hidden="true" />

      {/* ===== LAYER 5: Card Content ===== */}
      <div className="relative z-10 p-5 h-full flex flex-col">
        {/* ---- HEADER ROW ---- */}
        <div className="flex justify-between items-start mb-4">
          {/* Issuer Badge */}
          <div className="flex items-center gap-2">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_8px_rgba(0,0,0,0.3)]">
              <div className="relative z-10">
                <Globe className="w-5 h-5 text-indigo-300 drop-shadow-[0_0_4px_rgba(99,102,241,0.4)]" aria-hidden="true" />
              </div>
              {/* Badge glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 opacity-50 blur-sm -z-10" />
            </div>
            <div>
              <p className="text-[6px] uppercase tracking-widest text-amber-300 font-mono font-bold leading-none">UNIVERSAL ID CARD</p>
              <p className="text-[7px] text-zinc-400 font-light leading-none mt-0.5">Universal Guard Trust</p>
            </div>
          </div>
          
          {/* QR Code - Premium placement */}
          {showQR && (
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-lg bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-amber-500/30 blur-sm opacity-50" aria-hidden="true" />
              <div className="relative p-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/50 backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                <img 
                  src={qrDataUrl} 
                  alt={`Verification QR for ${user.id}`}
                  className="w-12 h-12 rounded-sm"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 rounded-lg border border-zinc-600/30 pointer-events-none" />
              </div>
              {/* QR Label */}
              <p className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 text-[6px] text-zinc-500 font-mono uppercase tracking-wider whitespace-nowrap print:hidden">SCAN TO VERIFY</p>
            </div>
          )}
        </div>

        {/* ---- ID NUMBER SECTION (Primary Visual Anchor) ---- */}
        <div className="mb-4 flex-1 flex flex-col justify-center relative">
          {/* Subtle background accent behind ID */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-indigo-500/5 rounded-xl pointer-events-none" aria-hidden="true" />
          
          <p className="text-[6px] uppercase tracking-widest text-zinc-500 font-mono mb-2 relative z-10">Sovereign Identifier</p>
          
          {/* ID Number with premium typography */}
          <div className="relative z-10">
            <p className="text-3xl sm:text-4xl font-mono font-black tracking-widest bg-gradient-to-r from-amber-300 via-amber-100 to-yellow-200 bg-clip-text text-transparent select-all drop-shadow-[0_0_12px_rgba(245,158,11,0.4)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              {user.id}
            </p>
            {/* Embossed effect - subtle inner shadow */}
            <p className="absolute inset-0 text-3xl sm:text-4xl font-mono font-black tracking-widest text-white/5 -translate-y-0.5 pointer-events-none select-none" aria-hidden="true">
              {user.id}
            </p>
          </div>
          
          <p className="text-[7px] text-zinc-500 font-mono mt-2 relative z-10">Order #{user.order.toLocaleString()}</p>
        </div>

        {/* ---- SECURITY DIVIDER ---- */}
        <div className="relative my-3" role="separator" aria-hidden="true">
          <div className="absolute inset-y-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-zinc-600/50 to-transparent" />
          {/* Security microtext */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-[4px] text-zinc-700 font-mono tracking-widest uppercase text-center print:block hidden" aria-hidden="true">
            UNIVERSAL GUARD TRUST • SOVEREIGN IDENTITY • UNIVERSAL GUARD TRUST • SOVEREIGN IDENTITY
          </div>
        </div>

        {/* ---- HOLDER DETAILS GRID ---- */}
        <div className="grid grid-cols-2 gap-3 mb-3 relative z-10">
          {/* Holder Name */}
          <div className="col-span-2 min-w-0 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden="true" />
            <p className="text-[6px] uppercase tracking-widest text-zinc-500 font-mono mb-1">Full Name</p>
            <p className="text-lg font-semibold text-zinc-100 truncate max-w-full" title={user.name}>{user.name}</p>
          </div>
          
          {/* Date of Birth */}
          <div className="min-w-0 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden="true" />
            <p className="text-[6px] uppercase tracking-widest text-zinc-500 font-mono mb-1">Date of Birth</p>
            <p className="text-sm font-medium text-zinc-300 font-mono" title={user.dob}>{formatDate(user.dob)}</p>
          </div>
          
          {/* Registration Date */}
          <div className="min-w-0 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden="true" />
            <p className="text-[6px] uppercase tracking-widest text-zinc-500 font-mono mb-1">Registered</p>
            <p className="text-sm font-medium text-zinc-300 font-mono" title={user.registeredAt}>{formatDate(user.registeredAt)}</p>
          </div>
          
          {/* Universe Rank */}
          <div className="text-right min-w-0 relative group">
            <div className="absolute inset-0 bg-gradient-to-l from-indigo-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-hidden="true" />
            <p className="text-[6px] uppercase tracking-widest text-zinc-500 font-mono mb-1">Universe Rank</p>
            <p className="text-sm font-bold text-indigo-300 font-mono">{formatRank(user.universeRank)}</p>
          </div>
        </div>

        {/* ---- NATION ALIGNMENT (Full Width) ---- */}
        <div className="pt-3 border-t border-zinc-800/40 relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <MapPin className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              </div>
              <p className="text-[6px] uppercase tracking-widest text-zinc-500 font-mono">Nation Alignment</p>
            </div>
            <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Crown className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            </div>
          </div>
          <p className="text-lg font-semibold text-zinc-100 truncate max-w-full" title={user.nation}>
            {user.nation}
          </p>
        </div>

        {/* ---- FOOTER: Security & Verification ---- */}
        <div className="mt-auto pt-3 border-t border-zinc-800/40 relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3 print:hidden">
            <button
              onClick={onCopy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-zinc-850/80 hover:bg-zinc-850 text-white text-[8px] font-medium tracking-wider uppercase rounded-lg transition-all border border-zinc-700/50 hover:border-zinc-600/50 active:scale-[0.98]"
              aria-label={copied ? 'ID copied to clipboard' : 'Copy Universal ID to clipboard'}
            >
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{copied ? 'Copied!' : 'Copy ID'}</span>
            </button>
            <button
              onClick={onPrint}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white text-[8px] font-medium tracking-wider uppercase rounded-lg transition-all border border-zinc-700/50 hover:border-zinc-600/50 active:scale-[0.98]"
              aria-label="Print or save ID card"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Print</span>
            </button>
          </div>
          
          {/* Verification footer */}
          <div className="flex items-center justify-between text-[6px] text-zinc-500 font-mono print:hidden">
            <span>SECURE • VERIFIED • SOVEREIGN</span>
            <span>UGT-{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* ===== PRINT-ONLY ELEMENTS ===== */}
      <div className="print:block hidden absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Print crop marks */}
        <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-zinc-600" />
        <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-zinc-600" />
        <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b-2 border-l-2 border-zinc-600" />
        <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-zinc-600" />
        
        {/* Verification timestamp */}
        <div className="absolute bottom-2 right-2 text-[5px] text-zinc-600 font-mono">
          Verified: {new Date().toISOString().split('T')[0]} • {window.location.origin}/verify/{user.id}
        </div>
      </div>
    </div>
  );
});

ProfessionalIdCard.displayName = 'ProfessionalIdCard';

// Rank Detail Card Component
const RankDetailCard = React.memo(({ 
  label, 
  rank, 
  location, 
  icon: Icon, 
  color, 
  bgColor 
}: { 
  label: string;
  rank: number;
  location: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}) => (
  <motion.div 
    className={`p-3 rounded-xl border ${bgColor} flex flex-col justify-between`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    role="listitem"
    aria-label={`${label}: Rank ${rank.toLocaleString()} in ${location}`}
  >
    <div className="flex items-center gap-1.5">
      <Icon className={`w-3.5 h-3.5 ${color}`} aria-hidden="true" />
      <span className="text-[7px] uppercase tracking-widest text-zinc-500 font-mono">{label}</span>
    </div>
    <div className="mt-2">
      <span className="text-lg font-bold font-mono" style={{ color }}>#{rank.toLocaleString()}</span>
      <p className="text-[8px] text-zinc-500 mt-0.5 truncate max-w-full" title={location}>{location}</p>
    </div>
  </motion.div>
));

RankDetailCard.displayName = 'RankDetailCard';

const UniversalIdPortal: React.FC<UniversalIdPortalProps> = ({
  isModal = false,
  isOpen = true,
  onClose,
  onAuthChange,
  authClient: authClientProp,
}) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'forgot' | 'dashboard'>('register');
  const [currentUser, setCurrentUser] = useState<UniversalIdRecord | null>(null);
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [view, setView] = useState<'register' | 'login' | 'id-card'>('register');
  
  // Registration Form States
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [nation, setNation] = useState('');
  
  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration Password
  const [regPassword, setRegPassword] = useState('');
  
  // Forgot Password States
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  
  // UI Status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRankDetails, setShowRankDetails] = useState(true);
  const [showFullCard, setShowFullCard] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrCodeToken, setQrCodeToken] = useState<string>('');
  const [qrCodeExpiresAt, setQrCodeExpiresAt] = useState<Date | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  
  // Initialize UGT Auth Client - use prop if provided, otherwise create new
  const authClient = useMemo(() => {
    if (authClientProp) return authClientProp;
    return createUGTAuthClient({
      authDomain: import.meta.env.VITE_AUTH_DOMAIN || 'auth.ugt.org',
      clientId: import.meta.env.VITE_PLATFORM_CLIENT_ID || 'ugt_portal_client',
      redirectUri: import.meta.env.VITE_PLATFORM_REDIRECT_URI || `${window.location.origin}/auth/callback`,
      scope: 'profile email rankings',
      usePKCE: true,
    });
  }, [authClientProp]);
  
  // Refs for focus management
  const firstInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const initRegistry = useCallback(async () => {
    setIsInitializing(true);
    setError('');
    try {
      const count = await withRetry(() => getRegistryCount());
      setTotalRegistrations(count);
      
      const user = await withRetry(() => getActiveUser());
      if (user) {
        setCurrentUser(user);
        setActiveTab('dashboard');
        onAuthChange?.(user);
      } else {
        setActiveTab('register');
        onAuthChange?.(null);
      }
    } catch (err: any) {
      const apiError = classifyError(err);
      setError(apiError.message || 'Failed to sync with the registry. Please check your connection.');
      onAuthChange?.(null);
    } finally {
      setIsInitializing(false);
      setIsLoading(false);
    }
  }, [onAuthChange]);

  useEffect(() => {
    if (!isModal || isOpen) {
      initRegistry();
    }
  }, [isModal, isOpen, initRegistry]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isModal && isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isModal, isOpen]);

  // Trap focus in modal
  useEffect(() => {
    if (!isModal || !isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalContentRef.current) {
        const focusableElements = modalContentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModal, isOpen, onClose]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validate all required fields
    if (!name || !dob || !email || !phone || !pincode || !city || !district || !state || !nation) {
      setError('Every field is sacred. Please complete all elements to establish your registry.');
      setIsLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    // Validate phone format (basic international format)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid phone number in international format (e.g., +1234567890).');
      setIsLoading(false);
      return;
    }

    try {
        if (!regPassword || regPassword.length < 8) {
          setError('Password must be at least 8 characters long.');
          setIsLoading(false);
          return;
        }
        const newUser = await registerUserWithPassword({
          name,
          dob,
          email,
          phone,
          pincode,
          city,
          district,
          state,
          nation,
          password: regPassword
        });
      setCurrentUser(newUser);
      setActiveTab('dashboard');
      setView('id-card');
      
      const count = await getRegistryCount();
      setTotalRegistrations(count);
      
      setSuccess('Your Universal ID has been permanently woven into the planetary collective.');
      onAuthChange?.(newUser);
      
      setTimeout(() => {
        setName('');
        setDob('');
        setEmail('');
        setPhone('');
        setPincode('');
        setCity('');
        setDistrict('');
        setState('');
        setNation('');
      }, 1500);
    } catch (err: any) {
      const apiError = classifyError(err);
      // Handle duplicate phone/email errors specifically
      if (apiError.message.includes('already registered') || apiError.message.includes('already exists') || apiError.code === '23505') {
        setError('This email or phone number is already registered. Please use a different one or log in.');
      } else {
        setError(apiError.message || 'An error occurred during verification. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!loginIdentifier) {
      setError('Please provide your Universal ID or Email.');
      setIsLoading(false);
      return;
    }

    if (!loginPassword) {
      setError('Please enter your password.');
      setIsLoading(false);
      return;
    }

    try {
      const user = await loginWithPassword(loginIdentifier, loginPassword);
      setCurrentUser(user);
      setView('id-card');
      setSuccess('Consciousness aligned. Welcome back, Guardian.');
      onAuthChange?.(user);
      setTimeout(() => {
        setActiveTab('dashboard');
        setLoginIdentifier('');
        setLoginPassword('');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Alignment failed. Check your credential or register.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setActiveUserId(null);
    setCurrentUser(null);
    setActiveTab('register');
    onAuthChange?.(null);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!forgotIdentifier.trim()) {
      setError('Please enter your email or Universal ID.');
      setIsLoading(false);
      return;
    }

    try {
      await requestPasswordReset(forgotIdentifier.trim().toLowerCase());
      setForgotStep(2);
      setSuccess('If an account exists, a password reset link has been sent.');
    } catch (err: any) {
      // For security, always show success even if user doesn't exist
      setForgotStep(2);
      setSuccess('If an account exists, a password reset link has been sent.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyId = () => {
    if (!currentUser) return;
    navigator.clipboard.writeText(currentUser.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printCard = () => {
    window.print();
  };

  // Generate QR Code for cross-platform login using UGT Auth Client
  const generateQRCode = async () => {
    if (!currentUser) return;
    
    setIsGeneratingQR(true);
    setError('');
    try {
      const result = await authClient.generateQRCode(currentUser.id, {
        platformId: import.meta.env.VITE_PLATFORM_ID || 'ugt_portal',
        redirectUri: import.meta.env.VITE_PLATFORM_REDIRECT_URI || `${window.location.origin}/auth/callback`,
        scope: 'profile email rankings',
        expiresInSeconds: 300, // 5 minutes
      });
      
      setQrCodeUrl(result.qrUrl);
      setQrCodeToken(result.token);
      setQrCodeExpiresAt(result.expiresAt);
      setSuccess('QR Code generated! Scan with another UGT platform to login securely via OAuth.');
    } catch (err: any) {
      setError(err.message || 'Failed to generate QR code. Please try again.');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const renderContent = () => (
    <>
      {(isLoading || isInitializing) && !currentUser ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4" role="status" aria-live="polite">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-400" aria-hidden="true" />
          <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">Accessing Registry Collective...</p>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-between">
          {/* Form Navigation Tabs */}
          {activeTab !== 'dashboard' && (
            <div className="space-y-6" role="tablist" aria-label="Authentication methods">
              <div className="flex bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 max-w-sm" role="group">
                <button
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  disabled={isLoading}
                  role="tab"
                  aria-selected={activeTab === 'register'}
                  aria-controls="register-panel"
                  id="register-tab"
                  className={`flex-1 py-2.5 text-xs font-medium tracking-wide rounded-lg transition-all duration-300 ${
                    activeTab === 'register' ? 'bg-zinc-850 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 inline-block mr-1.5" aria-hidden="true" />
                  Register
                </button>
                <button
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  disabled={isLoading}
                  role="tab"
                  aria-selected={activeTab === 'login'}
                  aria-controls="login-panel"
                  id="login-tab"
                  className={`flex-1 py-2.5 text-xs font-medium tracking-wide rounded-lg transition-all duration-300 ${
                    activeTab === 'login' ? 'bg-zinc-850 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 inline-block mr-1.5" aria-hidden="true" />
                  Login
                </button>
                <button
                  onClick={() => { setActiveTab('forgot'); setError(''); }}
                  disabled={isLoading}
                  role="tab"
                  aria-selected={activeTab === 'forgot'}
                  aria-controls="forgot-panel"
                  id="forgot-tab"
                  className={`flex-1 py-2.5 text-xs font-medium tracking-wide rounded-lg transition-all duration-300 ${
                    activeTab === 'forgot' ? 'bg-zinc-850 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 inline-block mr-1.5" aria-hidden="true" />
                  Forgot
                </button>
              </div>

              {/* Feedback messages */}
              {error && (
                <motion.div 
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-light flex items-start gap-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-light flex items-start gap-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{success}</span>
                </motion.div>
              )}

              {activeTab === 'register' ? (
                /* REGISTER FORM */
                <form onSubmit={handleRegister} id="register-panel" role="tabpanel" aria-labelledby="register-tab" className="space-y-4" autoComplete="on">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="reg-name" className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 font-semibold font-mono">Sovereign Full Name</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-zinc-500" aria-hidden="true"><User className="w-4 h-4" /></span>
                        <input 
                          ref={firstInputRef}
                          id="reg-name"
                          type="text" 
                          required
                          disabled={isLoading}
                          autoComplete="name"
                          placeholder="e.g. Nicolaus Copernicus"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs font-light transition-all outline-none"
                          aria-describedby="reg-name-hint"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-dob" className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 font-semibold font-mono">Date of Birth</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-zinc-500" aria-hidden="true"><Calendar className="w-4 h-4" /></span>
                        <input 
                          id="reg-dob"
                          type="date" 
                          required
                          disabled={isLoading}
                          autoComplete="bday"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs font-light transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-email" className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 font-semibold font-mono">Secure Email Address</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-zinc-500" aria-hidden="true"><Mail className="w-4 h-4" /></span>
                        <input 
                          id="reg-email"
                          type="email" 
                          required
                          disabled={isLoading}
                          autoComplete="email"
                          placeholder="e.g. copernicus@universe.trust"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs font-light transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-phone" className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 font-semibold font-mono">Phone Number</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-zinc-500" aria-hidden="true"><Phone className="w-4 h-4" /></span>
                        <input 
                          id="reg-phone"
                          type="tel" 
                          required
                          disabled={isLoading}
                          autoComplete="tel"
                          placeholder="e.g. +48 123 456 789"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs font-light transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-password" className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 font-semibold font-mono">Password</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-zinc-500" aria-hidden="true"><Lock className="w-4 h-4" /></span>
                        <input 
                          id="reg-password"
                          type="password" 
                          required
                          disabled={isLoading}
                          autoComplete="new-password"
                          placeholder="Min 8 characters"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs font-light transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                    {/* Geographic details - Improved mobile layout */}
                    <div className="pt-2 border-t border-zinc-800/40">
                      <p className="text-[10px] uppercase tracking-widest text-indigo-400 mb-3 font-semibold font-mono flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        Geographic Alignment
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 lg:col-span-1">
                          <label htmlFor="reg-nation" className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Nation</label>
                          <input 
                            id="reg-nation"
                            type="text" 
                            required
                            disabled={isLoading}
                            autoComplete="country"
                            placeholder="e.g. Poland"
                            value={nation}
                            onChange={(e) => setNation(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white text-sm font-light focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all min-h-[48px]"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                          <label htmlFor="reg-state" className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">State / Region</label>
                          <input 
                            id="reg-state"
                            type="text" 
                            required
                            disabled={isLoading}
                            autoComplete="address-level1"
                            placeholder="e.g. Warmia"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white text-sm font-light focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all min-h-[48px]"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                          <label htmlFor="reg-district" className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">District</label>
                          <input 
                            id="reg-district"
                            type="text" 
                            required
                            disabled={isLoading}
                            autoComplete="address-level2"
                            placeholder="e.g. Frombork"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white text-sm font-light focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all min-h-[48px]"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                          <label htmlFor="reg-city" className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">City / Town</label>
                          <input 
                            id="reg-city"
                            type="text" 
                            required
                            disabled={isLoading}
                            autoComplete="address-level3"
                            placeholder="e.g. Torun"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white text-sm font-light focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all min-h-[48px]"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                          <label htmlFor="reg-pincode" className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Pincode</label>
                          <input 
                            id="reg-pincode"
                            type="text" 
                            required
                            disabled={isLoading}
                            autoComplete="postal-code"
                            placeholder="e.g. 87-100"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-white text-sm font-light focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all min-h-[48px]"
                          />
                        </div>
                      </div>
                    </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-zinc-950 hover:bg-zinc-100 font-medium py-3.5 rounded-xl transition-all duration-300 text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>Generate My Sovereign ID</span>
                  </button>
                </form>
              ) : activeTab === 'forgot' ? (
                /* FORGOT PASSWORD FORM */
                <form onSubmit={handleForgotPassword} id="forgot-panel" role="tabpanel" aria-labelledby="forgot-tab" className="space-y-6 pt-4">
                  {forgotStep === 1 ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                          <Mail className="w-8 h-8 text-indigo-400" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl font-light text-white mb-2">Reset Your Password</h3>
                        <p className="text-zinc-400 text-xs">Enter your email or Universal ID and we'll send you a reset link.</p>
                      </div>
                      
                      <div>
                        <label htmlFor="forgot-identifier" className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-semibold font-mono">Email or Universal ID</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3.5 text-zinc-500" aria-hidden="true"><Globe className="w-4 h-4" /></span>
                          <input 
                            ref={firstInputRef}
                            id="forgot-identifier"
                            type="text" 
                            required
                            disabled={isLoading}
                            autoComplete="username"
                            placeholder="e.g. tesla@universe.trust or UGT-000001"
                            value={forgotIdentifier}
                            onChange={(e) => setForgotIdentifier(e.target.value)}
                            className="w-full pl-10 pr-4 py-3.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs sm:text-sm font-light transition-all outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 rounded-xl transition-all duration-300 text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>Send Reset Link</span>
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </>
                  ) : forgotStep === 2 ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                          <CheckCircle className="w-8 h-8 text-emerald-400" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl font-light text-white mb-2">Check Your Email</h3>
                        <p className="text-zinc-400 text-xs">We've sent a password reset link to <span className="text-indigo-400">{forgotIdentifier}</span></p>
                        <p className="text-zinc-500 text-[10px] mt-2">The link will expire in 1 hour.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={() => setForgotStep(1)}
                          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-all duration-300 text-xs tracking-wide flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Resend Email</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => { setActiveTab('login'); setForgotStep(1); setForgotIdentifier(''); }}
                          className="w-full text-zinc-400 hover:text-white font-medium py-2 text-xs transition-colors"
                        >
                          ← Back to Login
                        </button>
                      </div>
                    </>
                  ) : null}
                </form>
              ) : (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} id="login-panel" role="tabpanel" aria-labelledby="login-tab" className="space-y-6 pt-4">
                  <div>
                    <label htmlFor="login-identifier" className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-semibold font-mono">Enter Universal ID or Registered Email</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-zinc-500" aria-hidden="true"><Globe className="w-4 h-4" /></span>
                      <input 
                        ref={firstInputRef}
                        id="login-identifier"
                        type="text" 
                        required
                        disabled={isLoading}
                        autoComplete="username"
                        placeholder="e.g. UGT-000001 or tesla@universe.trust"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs sm:text-sm font-light transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-semibold font-mono">Password</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-zinc-500" aria-hidden="true"><Lock className="w-4 h-4" /></span>
                      <input 
                        id="login-password"
                        type="password" 
                        required
                        disabled={isLoading}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs sm:text-sm font-light transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        // Navigate to password reset page
                        window.location.href = '/password-reset';
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-medium transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-zinc-950 hover:bg-zinc-100 font-medium py-3.5 rounded-xl transition-all duration-300 text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                    ) : (
                      <>
                        <span>Align Consciousness & Login</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* LOGGED IN / DASHBOARD */}
          {activeTab === 'dashboard' && currentUser && (
            <div className="space-y-6" role="region" aria-label="Universal ID Dashboard">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-4 border-b border-zinc-800/60">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold font-mono">Sovereign Logged In</p>
                  <h3 className="text-xl font-light">Interactive ID Dashboard</h3>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 text-xs transition-all border border-transparent hover:border-zinc-700/40 self-start"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Dealign / Logout</span>
                </button>
              </div>

              {/* Professional ID Card */}
              <div className="flex justify-center">
                <ProfessionalIdCard 
                  user={currentUser} 
                  onCopy={copyId}
                  onPrint={printCard}
                  copied={copied}
                />
              </div>

              {/* Expandable Full Card View */}
              <button
                onClick={() => setShowFullCard(!showFullCard)}
                className="w-full flex items-center justify-center gap-2 py-2 text-zinc-400 hover:text-indigo-400 text-xs font-medium transition-colors"
                aria-expanded={showFullCard}
                aria-controls="full-card-details"
              >
                <span>{showFullCard ? 'Collapse' : 'Expand'} Full Card Details</span>
                {showFullCard ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {showFullCard && (
                  <motion.div 
                    id="full-card-details"
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                      <div className="col-span-2 sm:col-span-3">
                        <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono mb-2">Contact & Verification</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-zinc-500">Email</span>
                            <span className="text-white truncate" title={currentUser.email}>{currentUser.email}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-zinc-500">Phone</span>
                            <span className="text-white truncate" title={currentUser.phone}>{currentUser.phone}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-zinc-500">Pincode</span>
                            <span className="text-white font-mono">{currentUser.pincode}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-zinc-500">Registered</span>
                            <span className="text-white font-mono">{new Date(currentUser.registeredAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-3">
                        <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono mb-2">Full Address</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-zinc-500">City</span>
                            <span className="text-white truncate" title={currentUser.city}>{currentUser.city}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-zinc-500">District</span>
                            <span className="text-white truncate" title={currentUser.district}>{currentUser.district}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-zinc-500">State</span>
                            <span className="text-white truncate" title={currentUser.state}>{currentUser.state}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-zinc-500">Nation</span>
                            <span className="text-white truncate" title={currentUser.nation}>{currentUser.nation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Ranks details */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold font-mono">Your Order Rankings</p>
                  <button 
                    onClick={() => setShowRankDetails(!showRankDetails)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 self-start"
                  >
                    {showRankDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                <AnimatePresence>
                  {showRankDetails && (
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      role="list"
                      aria-label="Ranking details"
                    >
                      <RankDetailCard
                        label="Universe Order"
                        rank={currentUser.universeRank}
                        location={`${totalRegistrations.toLocaleString()} guardians`}
                        icon={Globe}
                        color="text-indigo-300"
                        bgColor="bg-zinc-950/70 border-indigo-500/10"
                      />
                      <RankDetailCard
                        label="In Nation"
                        rank={currentUser.nationRank}
                        location={currentUser.nation}
                        icon={Flag}
                        color="text-amber-400"
                        bgColor="bg-zinc-950/70 border-zinc-800/80"
                      />
                      <RankDetailCard
                        label="In State"
                        rank={currentUser.stateRank}
                        location={currentUser.state}
                        icon={Building2}
                        color="text-zinc-200"
                        bgColor="bg-zinc-950/70 border-zinc-800/80"
                      />
                      <RankDetailCard
                        label="In District"
                        rank={currentUser.districtRank}
                        location={currentUser.district}
                        icon={Map}
                        color="text-zinc-300"
                        bgColor="bg-zinc-950/70 border-zinc-800/80"
                      />
                      <RankDetailCard
                        label="In City"
                        rank={currentUser.cityRank}
                        location={currentUser.city}
                        icon={Home}
                        color="text-zinc-300"
                        bgColor="bg-zinc-950/70 border-zinc-800/80"
                      />
                      <RankDetailCard
                        label="In Pincode"
                        rank={currentUser.pincodeRank}
                        location={currentUser.pincode}
                        icon={Grid}
                        color="text-zinc-300"
                        bgColor="bg-zinc-950/70 border-zinc-800/80"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Bar */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={copyId}
                  className="flex-1 py-3 px-4 bg-zinc-850 hover:bg-zinc-850/80 text-white font-medium text-[10px] tracking-wider uppercase rounded-xl transition-all border border-zinc-700/50 flex items-center justify-center gap-2"
                  aria-label={copied ? 'ID copied to clipboard' : 'Copy Universal ID to clipboard'}
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                </button>

                <button
                  onClick={printCard}
                  className="flex-1 py-3 px-4 bg-white hover:bg-zinc-100 text-zinc-950 font-medium text-[10px] tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                  aria-label="Print or save ID card"
                >
                  <Printer className="w-4 h-4" aria-hidden="true" />
                  <span>Print / Save</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  // Modal Render
  if (isModal) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div 
              ref={modalContentRef}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[90vh] max-h-[calc(100vh-2rem)]"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4, damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Branding Bar */}
              <div className="bg-zinc-900 text-white p-4 sm:p-5 flex justify-between items-center print:hidden">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Globe className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="modal-title" className="font-bold tracking-tight text-lg">Universal Citizenship Portal</h2>
                    <p className="text-zinc-400 text-xs">Uniting the world as one shared consciousness</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
                  aria-label="Close portal"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Content Body Area - Fixed scroll stability for mobile */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                {error && (
                  <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium" role="alert">
                    {error}
                  </div>
                )}

                {renderContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Inline section mode
  return (
    <SectionWrapper id="registry-portal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-medium block mb-3">Real-Time Registry</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-zinc-900">
            Universal ID Portal
          </h2>
          <div className="h-0.5 w-16 bg-zinc-800 mx-auto mt-5 mb-6"></div>
          <p className="text-zinc-500 text-sm sm:text-base lg:text-lg font-light leading-relaxed">
            Claims are processed instantly. Securely register to receive your unique cosmic rank and sovereign Universal ID card.
          </p>
        </div>

        {/* Portal Grid */}
        <div className="relative bg-zinc-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col md:grid md:grid-cols-12 min-h-[550px]">
          {/* Ambient space background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(99,_102,_241,_0.08),_transparent_40%)] pointer-events-none" />
          
          {/* Left panel: Info & Counter */}
          <div className="p-6 sm:p-8 md:p-10 md:col-span-5 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950/40 relative z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Milestone className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="font-semibold tracking-widest text-[10px] uppercase text-indigo-400 font-mono">Live Sync Collective</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-light tracking-tight">Claim Your Sovereign Order</h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                Step into a structured identification hierarchy. Your ID is safely generated and stored locally in your personal sandbox.
              </p>

              <div className="space-y-4 pt-5 border-t border-zinc-800/40">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">Secure Client Storage</p>
                    <p className="text-zinc-500 text-[11px] font-light">Offline-first sandbox. Registered entirely within your browser for absolute key privacy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">Instant Order Ranking</p>
                    <p className="text-zinc-500 text-[11px] font-light">Calculates your entry position automatically on global, national, and local scales.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 md:pt-0 mt-8 border-t border-zinc-800/50 md:border-t-0">
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-mono font-semibold">Total Registered Guardians</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-indigo-300">
                  {totalRegistrations.toLocaleString()}
                </span>
                <span className="text-zinc-500 text-xs font-light">verified lives</span>
              </div>
            </div>
          </div>

          {/* Right panel: Controls & Form */}
          <div className="p-6 sm:p-8 md:p-10 md:col-span-7 relative z-10 flex flex-col justify-center bg-zinc-900/40 backdrop-blur-md min-h-[550px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

// Flag icon component (using lucide-react Flag)

export default UniversalIdPortal;