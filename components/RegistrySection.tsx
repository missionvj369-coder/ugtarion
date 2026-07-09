import React, { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import { 
  getRegistryCount, 
  registerUser, 
  getActiveUser, 
  setActiveUserId, 
  loginUser
} from '../lib/apiClient';
import type { UniversalIdRecord } from '../lib/apiClient';
import SectionWrapper from './SectionWrapper';

const RegistrySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'dashboard'>('register');
  const [currentUser, setCurrentUser] = useState<UniversalIdRecord | null>(null);
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  // UI Status
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRankDetails, setShowRankDetails] = useState(true);

  const initRegistry = async () => {
    setIsLoading(true);
    setError('');
    try {
      const count = await getRegistryCount();
      setTotalRegistrations(count);
      
      const user = await getActiveUser();
      if (user) {
        setCurrentUser(user);
        setActiveTab('dashboard');
      } else {
        setActiveTab('register');
      }
    } catch (err: any) {
      setError('Failed to sync with the local sandbox registry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initRegistry();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!name || !dob || !email || !phone || !pincode || !city || !district || !state || !nation) {
      setError('Every field is sacred. Please complete all elements to establish your registry.');
      setIsLoading(false);
      return;
    }

    try {
      const newUser = await registerUser({
        name,
        dob,
        email,
        phone,
        pincode,
        city,
        district,
        state,
        nation
      });
      setCurrentUser(newUser);
      
      const count = await getSupabaseUserCount();
      setTotalRegistrations(count);
      
      setSuccess('Your Universal ID has been permanently woven into the planetary collective.');
      setTimeout(() => {
        setActiveTab('dashboard');
        // Clear form
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
      setError(err.message || 'An error occurred during verification.');
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

    try {
      const user = await loginUser(loginIdentifier);
      setCurrentUser(user);
      setSuccess('Consciousness aligned. Welcome back, Guardian.');
      setTimeout(() => {
        setActiveTab('dashboard');
        setLoginIdentifier('');
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
  };

  const copyId = () => {
    if (!currentUser) return;
    navigator.clipboard.writeText(currentUser.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMockCard = () => {
    if (!currentUser) return;
    window.print();
  };

  return (
    <SectionWrapper id="registry-portal">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-medium block mb-2.5">Real-Time Registry</span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-900">
            Universal ID Portal
          </h2>
          <div className="h-0.5 w-12 bg-zinc-800 mx-auto mt-4 mb-5"></div>
          <p className="text-zinc-500 text-sm sm:text-base font-light leading-relaxed">
            Claims are processed instantly. Securely register to receive your unique cosmic rank and sovereign Universal ID card.
          </p>
        </div>

        {/* Portal Grid */}
        <div className="relative bg-zinc-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col md:grid md:grid-cols-12 min-h-[550px]">
          {/* Ambient space background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(99,_102,_241,_0.08),_transparent_40%)] pointer-events-none" />
          
          {/* Left panel: Info & Counter */}
          <div className="p-8 sm:p-10 md:col-span-5 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950/40 relative z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Milestone className="w-5 h-5" />
                </span>
                <span className="font-semibold tracking-widest text-[10px] uppercase text-indigo-400 font-mono">Live Sync Collective</span>
              </div>

              <h3 className="text-2xl font-light tracking-tight">Claim Your Sovereign Order</h3>
              <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                Step into a structured identification hierarchy. Your ID is safely generated and stored locally in your personal sandbox.
              </p>

              <div className="space-y-4 pt-5 border-t border-zinc-800/40">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300">Secure Client Storage</p>
                    <p className="text-zinc-500 text-[11px] font-light">Offline-first sandbox. Registered entirely within your browser for absolute key privacy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
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
                <span className="text-3xl font-mono font-bold tracking-tight text-indigo-300">
                  {totalRegistrations}
                </span>
                <span className="text-zinc-500 text-xs font-light">verified lives</span>
              </div>
            </div>
          </div>

          {/* Right panel: Controls & Form */}
          <div className="p-8 sm:p-10 md:col-span-7 relative z-10 flex flex-col justify-center bg-zinc-900/40 backdrop-blur-md">
            {isLoading && !currentUser ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">Accessing Registry Collective...</p>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between">
                {/* Form Navigation Tabs */}
                {activeTab !== 'dashboard' && (
                  <div className="space-y-6">

                    <div className="flex bg-zinc-950/80 p-1 rounded-xl border border-zinc-800/80 max-w-xs">
                      <button
                        onClick={() => { setActiveTab('register'); setError(''); }}
                        disabled={isLoading}
                        className={`flex-1 py-2 text-xs font-medium tracking-wide rounded-lg transition-all duration-300 ${activeTab === 'register' ? 'bg-zinc-850 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                      >
                        Claim ID
                      </button>
                      <button
                        onClick={() => { setActiveTab('login'); setError(''); }}
                        disabled={isLoading}
                        className={`flex-1 py-2 text-xs font-medium tracking-wide rounded-lg transition-all duration-300 ${activeTab === 'login' ? 'bg-zinc-850 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                      >
                        Enter Identity
                      </button>
                    </div>

                    {/* Feedback messages */}
                    {error && (
                      <motion.div 
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-light"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div 
                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-light"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {success}
                      </motion.div>
                    )}

                    {activeTab === 'register' ? (
                      /* REGISTER FORM */
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 font-semibold font-mono">Sovereign Full Name</label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-zinc-500"><User className="w-4 h-4" /></span>
                              <input 
                                type="text" 
                                required
                                disabled={isLoading}
                                placeholder="e.g. Nicolaus Copernicus"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs font-light transition-all outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 font-semibold font-mono">Date of Birth</label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-zinc-500"><Calendar className="w-4 h-4" /></span>
                              <input 
                                type="date" 
                                required
                                disabled={isLoading}
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs font-light transition-all outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 font-semibold font-mono">Secure Email Address</label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-zinc-500"><Mail className="w-4 h-4" /></span>
                              <input 
                                type="email" 
                                required
                                disabled={isLoading}
                                placeholder="e.g. copernicus@universe.trust"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs font-light transition-all outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5 font-semibold font-mono">Phone Number</label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-zinc-500"><Phone className="w-4 h-4" /></span>
                              <input 
                                type="tel" 
                                required
                                disabled={isLoading}
                                placeholder="e.g. +48 123 456 789"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs font-light transition-all outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Geographic details */}
                        <div className="pt-2 border-t border-zinc-800/40">
                          <p className="text-[10px] uppercase tracking-widest text-indigo-400 mb-3 font-semibold font-mono">Geographic Alignment</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Nation</label>
                              <input 
                                type="text" 
                                required
                                disabled={isLoading}
                                placeholder="e.g. Poland"
                                value={nation}
                                onChange={(e) => setNation(e.target.value)}
                                className="w-full px-3 py-1.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-white text-xs font-light focus:border-indigo-500 outline-none transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">State / Region</label>
                              <input 
                                type="text" 
                                required
                                disabled={isLoading}
                                placeholder="e.g. Warmia"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full px-3 py-1.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-white text-xs font-light focus:border-indigo-500 outline-none transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">District</label>
                              <input 
                                type="text" 
                                required
                                disabled={isLoading}
                                placeholder="e.g. Frombork"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="w-full px-3 py-1.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-white text-xs font-light focus:border-indigo-500 outline-none transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">City / Town</label>
                              <input 
                                type="text" 
                                required
                                disabled={isLoading}
                                placeholder="e.g. Torun"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full px-3 py-1.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-white text-xs font-light focus:border-indigo-500 outline-none transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Pincode</label>
                              <input 
                                type="text" 
                                required
                                disabled={isLoading}
                                placeholder="e.g. 87-100"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="w-full px-3 py-1.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-white text-xs font-light focus:border-indigo-500 outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-white text-zinc-950 hover:bg-zinc-100 font-medium py-3 rounded-xl transition-all duration-300 text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          <span>Generate My Sovereign ID</span>
                        </button>
                      </form>
                    ) : (
                      /* LOGIN FORM */
                      <form onSubmit={handleLogin} className="space-y-6 pt-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-2 font-semibold font-mono">Enter Universal ID or Registered Email</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3.5 text-zinc-500"><Globe className="w-4 h-4" /></span>
                            <input 
                              type="text" 
                              required
                              disabled={isLoading}
                              placeholder="e.g. UGT-000001 or tesla@universe.trust"
                              value={loginIdentifier}
                              onChange={(e) => setLoginIdentifier(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-zinc-950/60 border border-zinc-800 rounded-xl focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 text-white text-xs sm:text-sm font-light transition-all outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-white text-zinc-950 hover:bg-zinc-100 font-medium py-3 rounded-xl transition-all duration-300 text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
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
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-3 border-b border-zinc-800/60">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold font-mono">Sovereign Logged In</p>
                        <h3 className="text-xl font-light">Interactive ID Dashboard</h3>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 text-xs transition-all border border-transparent hover:border-zinc-700/40"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Dealign / Logout</span>
                      </button>
                    </div>

                    {/* ID Card */}
                    <div className="flex justify-center">
                      <div className="relative w-full max-w-sm h-52 rounded-2xl p-5 overflow-hidden border border-zinc-700/50 shadow-2xl bg-zinc-950">
                        {/* Holographic gradients */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-amber-950/20 pointer-events-none" />
                        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
                        
                        {/* Card lines */}
                        <div className="absolute inset-x-5 top-5 bottom-5 border border-zinc-850 rounded-lg pointer-events-none" />
                        
                        {/* Header */}
                        <div className="flex justify-between items-start relative z-10">
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-amber-400 font-mono font-bold">UNIVERSAL ID CARD</p>
                            <p className="text-[10px] text-zinc-400 font-light">Universal Guard Trust</p>
                          </div>
                          <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-indigo-400">
                            <QrCode className="w-4 h-4 opacity-80" />
                          </div>
                        </div>

                        {/* Card ID */}
                        <div className="mt-6 relative z-10">
                          <p className="text-xl sm:text-2xl font-mono font-bold tracking-widest bg-gradient-to-r from-amber-200 via-indigo-100 to-white bg-clip-text text-transparent">
                            {currentUser.id}
                          </p>
                        </div>

                        {/* Footer Details */}
                        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end relative z-10">
                          <div>
                            <p className="text-[7px] uppercase tracking-widest text-zinc-500">Sovereign Holder</p>
                            <p className="text-xs font-semibold text-white tracking-wide truncate max-w-[150px]">{currentUser.name}</p>
                            <p className="text-[8px] text-zinc-400 font-light font-mono mt-0.5">DOB: {currentUser.dob}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[7px] uppercase tracking-widest text-zinc-500">Nation Alignment</p>
                            <p className="text-[11px] font-semibold text-zinc-300">{currentUser.nation}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ranks details */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold font-mono">Your Order Rankings</p>
                        <button 
                          onClick={() => setShowRankDetails(!showRankDetails)}
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          {showRankDetails ? 'Hide Details' : 'Show Details'}
                        </button>
                      </div>

                      <AnimatePresence>
                        {showRankDetails && (
                          <motion.div 
                            className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-indigo-500/10 flex flex-col justify-between">
                              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">Universe Order</span>
                              <span className="text-sm sm:text-base font-bold text-indigo-300 font-mono mt-0.5">#{currentUser.universeRank}</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5">global count</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
                              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">In Nation</span>
                              <span className="text-sm sm:text-base font-bold text-amber-400 font-mono mt-0.5">#{currentUser.nationRank}</span>
                              <span className="text-[8px] text-zinc-400 mt-0.5 truncate">{currentUser.nation}</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
                              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">In State</span>
                              <span className="text-sm sm:text-base font-bold text-zinc-200 font-mono mt-0.5">#{currentUser.stateRank}</span>
                              <span className="text-[8px] text-zinc-400 mt-0.5 truncate">{currentUser.state}</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
                              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">In District</span>
                              <span className="text-sm sm:text-base font-bold text-zinc-300 font-mono mt-0.5">#{currentUser.districtRank}</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate">{currentUser.district}</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
                              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">In City</span>
                              <span className="text-sm sm:text-base font-bold text-zinc-300 font-mono mt-0.5">#{currentUser.cityRank}</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate">{currentUser.city}</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
                              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">In Pincode</span>
                              <span className="text-sm sm:text-base font-bold text-zinc-300 font-mono mt-0.5">#{currentUser.pincodeRank}</span>
                              <span className="text-[8px] text-zinc-500 mt-0.5 truncate">{currentUser.pincode}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Action Bar */}
                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={copyId}
                        className="flex-1 py-2.5 px-4 bg-zinc-850 hover:bg-zinc-850/80 text-white font-medium text-[10px] tracking-wider uppercase rounded-xl transition-all border border-zinc-700/50 flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{copied ? 'Copied ID!' : 'Copy ID'}</span>
                      </button>

                      <button
                        onClick={downloadMockCard}
                        className="flex-1 py-2.5 px-4 bg-white hover:bg-zinc-100 text-zinc-950 font-medium text-[10px] tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Print / Save</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default RegistrySection;
