import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon, AlertCircleIcon, Loader2Icon, UserIcon, MailIcon, PhoneIcon, AwardIcon, ArrowLeftIcon, LogInIcon, ExternalLinkIcon } from './icons';
import { createUGTAuthClient, UGTAuthClient, UserInfo } from '../lib/ugt-auth-client';

interface VerificationData {
  universal_id: string;
  name: string;
  email: string;
  phone?: string;
  universe_rank?: number;
  world_rank?: number;
  country_rank?: number;
  state_rank?: number;
  district_rank?: number;
  city_rank?: number;
  area_rank?: number;
  street_rank?: number;
  landmark_rank?: number;
  building_rank?: number;
  floor_rank?: number;
  unit_rank?: number;
  created_at: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
  scope: string;
  universal_id?: string;
}

const VerificationPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);
  const [oauthTokens, setOauthTokens] = useState<TokenResponse | null>(null);

  // Initialize UGT Auth Client
  const authClient = createUGTAuthClient({
    authDomain: import.meta.env.VITE_AUTH_DOMAIN || 'auth.ugt.org',
    clientId: import.meta.env.VITE_PLATFORM_CLIENT_ID || 'ugt_portal_client',
    redirectUri: import.meta.env.VITE_PLATFORM_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    scope: 'profile email rankings',
    usePKCE: true,
  });

  useEffect(() => {
    // Check if this is an OAuth callback with authorization code
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const oauthError = searchParams.get('error');
    const oauthErrorDescription = searchParams.get('error_description');

    if (code) {
      // This is an OAuth callback - handle token exchange
      setIsOAuthCallback(true);
      handleOAuthCallback(code, state || undefined);
      return;
    }

    if (oauthError) {
      setError(oauthErrorDescription || oauthError);
      setLoading(false);
      return;
    }

    // Regular verification flow (QR code scan or direct link)
    // Allow direct UID access for verification (public verification page)
    if (!uid) {
      setError('No Universal ID provided');
      setLoading(false);
      return;
    }

    // Fetch verification data directly for the UID
    fetchVerificationData(uid);
  }, [uid, searchParams, authClient]);

  const handleOAuthCallback = async (code: string, state?: string) => {
    setLoading(true);
    setError('');
    try {
      const tokens = await authClient.exchangeCodeForTokens(code, state);
      setOauthTokens(tokens);
      
      // Fetch user info with the access token
      const userInfo = await authClient.fetchUserInfo(tokens.access_token);
      
      // Convert user info to verification data format
      const verificationData: VerificationData = {
        universal_id: userInfo.universal_id,
        name: userInfo.name,
        email: userInfo.email || '',
        phone: userInfo.phone,
        universe_rank: userInfo.rankings?.universe,
        world_rank: userInfo.rankings?.universe, // Using universe as world
        country_rank: userInfo.rankings?.nation,
        state_rank: userInfo.rankings?.state,
        district_rank: userInfo.rankings?.district,
        city_rank: userInfo.rankings?.city,
        area_rank: userInfo.rankings?.pincode,
        street_rank: undefined,
        landmark_rank: undefined,
        building_rank: undefined,
        floor_rank: undefined,
        unit_rank: undefined,
        created_at: userInfo.registered_at,
      };
      
      setData(verificationData);
      
      // Store tokens in localStorage for session persistence
      localStorage.setItem('ugt_auth_tokens', JSON.stringify(tokens));
      localStorage.setItem('ugt_auth_user', JSON.stringify(userInfo));
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
    } catch (err: any) {
      setError(err.message || 'OAuth callback failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!data) return;
    
    setLoggingIn(true);
    try {
      // If we have OAuth tokens, use them
      if (oauthTokens) {
        // Tokens are already stored in localStorage by handleOAuthCallback
        navigate('/', { replace: true });
        return;
      }
      
      // Fallback: Store user data in localStorage for session persistence
      const userSession = {
        universalId: data.universal_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        universeRank: data.universe_rank,
        worldRank: data.world_rank,
        countryRank: data.country_rank,
        stateRank: data.state_rank,
        districtRank: data.district_rank,
        cityRank: data.city_rank,
        areaRank: data.area_rank,
        streetRank: data.street_rank,
        landmarkRank: data.landmark_rank,
        buildingRank: data.building_rank,
        floorRank: data.floor_rank,
        unitRank: data.unit_rank,
        loginTime: new Date().toISOString(),
      };
      
      localStorage.setItem('ugt_active_user', JSON.stringify(userSession));
      
      // Redirect to main portal or dashboard
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      alert('Failed to create session. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const fetchVerificationData = async (uid: string) => {
    setLoading(true);
    setError('');
    try {
      // Fetch verification data from the API
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/verify/${uid}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Universal ID not found in the registry');
        }
        throw new Error('Failed to fetch verification data');
      }
      const verificationData = await response.json();
      setData(verificationData);
    } catch (err: any) {
      setError(err.message || 'Failed to verify Universal ID');
    } finally {
      setLoading(false);
    }
  };

  const formatRank = (rank?: number): string => {
    if (!rank) return '—';
    if (rank === 1) return '🥇 #1';
    if (rank === 2) return '🥈 #2';
    if (rank === 3) return '🥉 #3';
    return `#${rank.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-zinc-600 text-lg">
            {isOAuthCallback ? 'Completing OAuth authentication...' : 'Verifying Universal ID...'}
          </p>
          <p className="text-zinc-400 text-sm mt-1">{uid || 'Processing...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100">
        <div className="text-center max-w-md mx-4">
          <AlertCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-800 mb-2">Verification Failed</h1>
          <p className="text-zinc-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-zinc-800 mb-2">Identity Verified</h1>
          <p className="text-zinc-600">Universal Guard Trust Verification System</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-200">
          {/* Universal ID Badge */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 uppercase tracking-wider">Universal ID</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{data.universal_id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Verified</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">Full Name</p>
                <p className="text-xl font-semibold text-zinc-800">{data.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                <MailIcon className="w-5 h-5 text-zinc-400" />
                <div>
                  <p className="text-xs text-zinc-500">Email</p>
                  <p className="text-sm font-medium text-zinc-800 truncate">{data.email}</p>
                </div>
              </div>
              {data.phone && (
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
                  <PhoneIcon className="w-5 h-5 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Phone</p>
                    <p className="text-sm font-medium text-zinc-800">{data.phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ranks Section */}
            <div className="border-t border-zinc-200 pt-4">
              <h3 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                <AwardIcon className="w-5 h-5 text-amber-500" />
                Hierarchical Ranks
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Universe', value: data.universe_rank, icon: '🌌' },
                  { label: 'World', value: data.world_rank, icon: '🌍' },
                  { label: 'Country', value: data.country_rank, icon: '🏳️' },
                  { label: 'State', value: data.state_rank, icon: '🏛️' },
                  { label: 'District', value: data.district_rank, icon: '🏘️' },
                  { label: 'City', value: data.city_rank, icon: '🏙️' },
                  { label: 'Area', value: data.area_rank, icon: '📍' },
                  { label: 'Street', value: data.street_rank, icon: '🛣️' },
                  { label: 'Landmark', value: data.landmark_rank, icon: '🏛️' },
                  { label: 'Building', value: data.building_rank, icon: '🏢' },
                  { label: 'Floor', value: data.floor_rank, icon: '🏬' },
                  { label: 'Unit', value: data.unit_rank, icon: '🚪' },
                ].map((rank) => (
                  rank.value && (
                    <div key={rank.label} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{rank.icon}</span>
                        <span className="font-medium text-zinc-700">{rank.label} Rank</span>
                      </div>
                      <span className="font-mono font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-lg">
                        {formatRank(rank.value)}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Registration Date */}
            <div className="border-t border-zinc-200 pt-4">
              <p className="text-sm text-zinc-500 flex items-center justify-center gap-2">
                <span>Registered:</span>
                <span className="font-medium text-zinc-700">{new Date(data.created_at).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleLogin}
              disabled={loggingIn}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogInIcon className="w-5 h-5" />
              {loggingIn ? 'Creating Session...' : (isOAuthCallback ? 'Continue to Platform' : 'Login to This Platform')}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-6 bg-white text-zinc-700 rounded-xl font-semibold border border-zinc-300 hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-zinc-500">
          <p>This verification is valid for the current session only.</p>
          <p className="mt-1">For cross-platform authentication, use the UGT Auth Service.</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
