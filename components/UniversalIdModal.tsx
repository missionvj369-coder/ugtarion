import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react'; // Matches package.json "motion"
import { X, Globe, Shield, Download, LogIn, UserPlus, LogOut, Loader2, Sparkles } from 'lucide-react';
import { 
  registerUser, 
  loginUser, 
  getActiveUser, 
  setActiveUserId 
} from '../lib/apiClient';
import type { UniversalIdRecord } from '../lib/apiClient';

interface UniversalIdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UniversalIdModal: React.FC<UniversalIdModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userRecord, setUserRecord] = useState<UniversalIdRecord | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    phone: '',
    pincode: '',
    city: '',
    district: '',
    state: '',
    nation: '',
  });

  const [loginIdentifier, setLoginIdentifier] = useState('');

  // Auto-fetch existing authenticated session on mount or modal open
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getActiveUser()
        .then((user) => {
          if (user) setUserRecord(user);
        })
        .catch((err) => console.error("Session restore failed:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation Check
    const missingFields = Object.entries(formData).filter(([_, val]) => !val.trim());
    if (missingFields.length > 0) {
      setError(`Please complete all fields to align your position context.`);
      setLoading(false);
      return;
    }

    try {
      const record = await registerUser(formData);
      setUserRecord(record);
    } catch (err: any) {
      setError(err.message || 'Registration transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setError('Please provide your Universal ID or Registered Email.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const record = await loginUser(loginIdentifier);
      setUserRecord(record);
    } catch (err: any) {
      setError(err.message || 'Login context verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setActiveUserId(null);
    setUserRecord(null);
    setLoginIdentifier('');
    setError(null);
    setFormData({
      name: '',
      dob: '',
      email: '',
      phone: '',
      pincode: '',
      city: '',
      district: '',
      state: '',
      nation: '',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Main Card Modal Container */}
          <motion.div 
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Top Branding Bar */}
            <div className="bg-zinc-900 text-white p-5 flex justify-between items-center print:hidden">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-emerald-400 animate-spin-slow" />
                <div>
                  <h2 className="font-bold tracking-tight text-lg">Universal Citizenship Portal</h2>
                  <p className="text-zinc-400 text-xs">Uniting the world as one shared consciousness</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body Area */}
            <div className="p-6 overflow-y-auto flex-1">
              {error && (
                <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 text-zinc-900 animate-spin" />
                  <p className="text-sm text-zinc-500 animate-pulse">Syncing planetary registry alignment...</p>
                </div>
              ) : userRecord ? (
                /* =========================================================
                   DASHBOARD / ID CARD VIEW
                   ========================================================= */
                <div className="space-y-6 animate-fade-in">
                  <div className="border-2 border-zinc-900 rounded-2xl p-6 bg-gradient-to-br from-zinc-50 to-white shadow-sm relative overflow-hidden print:border-zinc-400">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-900/5 rounded-full translate-x-10 -translate-y-10 pointer-events-none" />
                    
                    {/* Passport Identity Header */}
                    <div className="flex justify-between items-start border-b border-zinc-200 pb-4 mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block">Universal Guard Trust</span>
                        <h3 className="text-xl font-bold text-zinc-900">{userRecord.name}</h3>
                        <p className="text-xs text-zinc-500">{userRecord.email} • {userRecord.phone}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-400 block font-semibold">IDENTITY ID</span>
                        <span className="font-mono text-base font-bold bg-zinc-900 text-white px-2 py-0.5 rounded text-sm tracking-wider">
                          {userRecord.id}
                        </span>
                      </div>
                    </div>

                    {/* Meta Identifiers Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-6 text-zinc-600">
                      <div><strong className="text-zinc-400">Date of Birth:</strong> {userRecord.dob}</div>
                      <div><strong className="text-zinc-400">Joined Sequence:</strong> Order #{userRecord.order}</div>
                    </div>

                    {/* THE 6 GEOGRAPHIC STANDING METRICS */}
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Relative Spatial Positioning Metrics
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-sm text-center">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Universe Rank</div>
                        <div className="text-lg font-extrabold text-zinc-900 mt-0.5">#{userRecord.universeRank}</div>
                        <span className="text-[9px] text-zinc-400 block truncate font-medium">Global Network</span>
                      </div>

                      <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-sm text-center">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Nation Rank</div>
                        <div className="text-lg font-extrabold text-zinc-900 mt-0.5">#{userRecord.nationRank}</div>
                        <span className="text-[9px] text-zinc-500 block truncate font-bold">{userRecord.nation}</span>
                      </div>

                      <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-sm text-center">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">State Rank</div>
                        <div className="text-lg font-extrabold text-zinc-900 mt-0.5">#{userRecord.stateRank}</div>
                        <span className="text-[9px] text-zinc-500 block truncate font-bold">{userRecord.state}</span>
                      </div>

                      <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-sm text-center">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">District Rank</div>
                        <div className="text-lg font-extrabold text-zinc-900 mt-0.5">#{userRecord.districtRank}</div>
                        <span className="text-[9px] text-zinc-500 block truncate font-bold">{userRecord.district}</span>
                      </div>

                      <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-sm text-center">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Town/City Rank</div>
                        <div className="text-lg font-extrabold text-zinc-900 mt-0.5">#{userRecord.cityRank}</div>
                        <span className="text-[9px] text-zinc-500 block truncate font-bold">{userRecord.city}</span>
                      </div>

                      <div className="p-3 bg-white border border-zinc-200 rounded-xl shadow-sm text-center">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Pincode Rank</div>
                        <div className="text-lg font-extrabold text-zinc-900 mt-0.5">#{userRecord.pincodeRank}</div>
                        <span className="text-[9px] text-zinc-500 block truncate font-bold">Area: {userRecord.pincode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Actions Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-xs border border-zinc-200 text-zinc-600 font-bold tracking-wider uppercase rounded-xl hover:bg-zinc-50 transition-all flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      De-authenticate Session
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-zinc-800 transition-all shadow-md flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download / Print Card
                    </button>
                  </div>
                </div>
              ) : (
                /* =========================================================
                   AUTHENTICATION TABS LAYER (LOGIN / SIGNUP FORM)
                   ========================================================= */
                <div>
                  {/* View Switching Selector Tabs */}
                  <div className="flex border-b border-zinc-100 mb-6 print:hidden">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('register'); setError(null); }}
                      className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase border-b-2 flex justify-center items-center gap-2 transition-all ${
                        activeTab === 'register' ? 'border-zinc-900 text-zinc-950' : 'border-transparent text-zinc-400'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      Onboard Passport
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('login'); setError(null); }}
                      className={`flex-1 pb-3 text-sm font-bold tracking-wider uppercase border-b-2 flex justify-center items-center gap-2 transition-all ${
                        activeTab === 'login' ? 'border-zinc-900 text-zinc-950' : 'border-transparent text-zinc-400'
                      }`}
                    >
                      <LogIn className="w-4 h-4" />
                      Verify Identity Profile
                    </button>
                  </div>

                  {/* Conditional Submission Shells */}
                  {activeTab === 'register' ? (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Full Legal Name</label>
                          <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900" placeholder="John Doe" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Date of Birth</label>
                          <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Email Address</label>
                          <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900" placeholder="johndoe@world.com" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Phone Number</label>
                          <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900" placeholder="+1234567890" />
                        </div>
                      </div>

                      <div className="border-t border-zinc-100 my-4 pt-4">
                        <span className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider flex items-center gap-1 mb-3">
                          <Shield className="w-3.5 h-3.5" /> Geographic Alignment Context
                        </span>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Nation</label>
                            <input type="text" name="nation" required value={formData.nation} onChange={handleInputChange} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900" placeholder="India" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">State / Province</label>
                            <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900" placeholder="California" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">District</label>
                            <input type="text" name="district" required value={formData.district} onChange={handleInputChange} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900" placeholder="District Name" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">City / Town</label>
                            <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900" placeholder="Mumbai" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-1">Pincode / Postal</label>
                            <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900" placeholder="400001" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold tracking-wider uppercase rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Aligning...
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" />
                              Register Universal Identity
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Universal ID or Registered Email</label>
                        <input
                          type="text"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900"
                          placeholder="Enter your Universal ID or email"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold tracking-wider uppercase rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <LogIn className="w-4 h-4" />
                              Verify Identity Profile
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UniversalIdModal;
