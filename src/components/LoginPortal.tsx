/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserRole } from '../types';
import { 
  Globe, 
  Facebook, 
  Instagram, 
  Mail, 
  ChevronDown, 
  User as UserIcon, 
  ArrowLeft, 
  KeyRound, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Check, 
  ShieldAlert, 
  Info, 
  GraduationCap, 
  Award, 
  Sliders, 
  UserCheck 
} from 'lucide-react';

interface LoginPortalProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
}

type UserCategory = 'STUDENT' | 'ADVISER' | 'PANELIST' | 'ADMIN' | null;

export default function LoginPortal({ users, onLoginSuccess }: LoginPortalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState<UserCategory>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  // Step 2 variables
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [password, setPassword] = useState('123456'); // Pre-fill student pin for easier simulation
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter users based on selected category
  const getFilteredUsers = (): User[] => {
    if (!selectedCategory) return [];
    return users.filter(u => u.role === selectedCategory);
  };

  const getUserCategoryLabel = (cat: UserCategory): string => {
    switch (cat) {
      case 'STUDENT': return 'Student';
      case 'ADVISER': return 'Faculty/Adviser';
      case 'PANELIST': return 'Panelist Member';
      case 'ADMIN': return 'Executive/Admin';
      default: return '- Select type of user to log-in -';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'STUDENT': return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'ADVISER': return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'PANELIST': return <Award className="w-4 h-4 text-amber-600" />;
      case 'ADMIN': return <Sliders className="w-4 h-4 text-rose-600" />;
    }
  };

  const handleSelectCategory = (cat: UserCategory) => {
    setSelectedCategory(cat);
    setIsPickerOpen(false);
    setTargetUser(null);
    setErrorMsg(null);
  };

  const handleNext = () => {
    if (!selectedCategory) {
      setErrorMsg("Please select your academic user type to continue.");
      return;
    }
    const available = getFilteredUsers();
    if (available.length > 0) {
      setTargetUser(available[0]); // Default first user
    } else {
      setTargetUser(null);
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) {
      setErrorMsg("Please select a simulated user profile.");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Please enter your academic password/PIN.");
      return;
    }
    onLoginSuccess(targetUser);
  };

  return (
    <div 
      id="login-portal-wrapper" 
      className="min-h-screen w-full bg-[#0a6ca5] flex flex-col items-center justify-between py-8 px-4 font-sans select-none relative overflow-hidden"
    >
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[50%] rounded-full bg-sky-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full bg-teal-300/5 blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Decorative top title with subtle high-contrast shadow */}
      <div className="w-full text-center mt-2 z-10">
        <h1 className="font-serif text-[#e4f2fa] text-xl md:text-2xl font-bold tracking-wider leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2">
          <span>Student / Faculty / Admin Portal</span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
        </h1>
        <p className="text-sky-200/60 text-xs mt-1 font-medium select-none tracking-wide">
          Official Capstone Defense Platform
        </p>
      </div>

      {/* Main Login Card styling matching OMSC layout, with high premium polish */}
      <div className="w-full max-w-[390px] bg-gradient-to-b from-[#e1e7ee] to-[#d0dae5] rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] p-7 flex flex-col items-center border border-white/40 relative my-auto z-10 backdrop-blur-md">
        
        {/* OMSC College Shield seal - High-fidelity vector SVG with subtle rotate hover effect */}
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="w-24 h-24 bg-white rounded-full p-1.5 shadow-lg flex items-center justify-center border-[3px] border-emerald-600 mb-4 transition-shadow hover:shadow-xl cursor-default"
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* outer border color */}
            <circle cx="50" cy="50" r="48" fill="#FBBF24" stroke="#047857" strokeWidth="4.5" />
            <circle cx="50" cy="50" r="41" fill="#047857" />
            <circle cx="50" cy="50" r="35" fill="#FEF08A" />
            
            {/* Center stars / seal details */}
            <path d="M50 19 L53 27 L62 27 L55 32 L57 40 L50 35 L43 40 L45 32 L38 27 L47 27 Z" fill="#047857" />
            
            {/* Book / Torch graphic */}
            <rect x="35" y="43" width="30" height="20" rx="2" fill="#FFFFFF" stroke="#047857" strokeWidth="2" />
            <line x1="50" y1="43" x2="50" y2="63" stroke="#047857" strokeWidth="2.2" />
            
            {/* Flame / lamp representation */}
            <path d="M50 35 C53.5 35 54.5 41 50 43 C45.5 41 46.5 35 50 35 Z" fill="#EF4444" />
            
            {/* Scales for evaluation authority */}
            <line x1="39" y1="57" x2="61" y2="57" stroke="#047857" strokeWidth="1.8" />
            <line x1="50" y1="51" x2="39" y2="57" stroke="#047857" strokeWidth="1.2" />
            <line x1="50" y1="51" x2="61" y2="57" stroke="#047857" strokeWidth="1.2" />
            
            {/* Year seal text */}
            <text x="50" y="73" fill="#047857" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              1966
            </text>
            <text x="50" y="81" fill="#047857" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              OMSC
            </text>
          </svg>
        </motion.div>

        {/* Institution Branding labels */}
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-[#133e68] font-black text-sm tracking-widest leading-none drop-shadow-sm font-sans uppercase">
            Occidental Mindoro State College
          </h2>
          <div className="h-[2px] w-12 bg-emerald-600 mx-auto rounded-full mt-1" />
          <p className="text-[#3a5874] text-[10.5px] font-extrabold tracking-wide uppercase mt-1">
            College-wide Online Capstone Portal
          </p>
        </div>

        {/* Step-based Form workflow */}
        <div className="w-full space-y-4">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 w-full"
              >
                <div className="bg-white/45 rounded-lg p-2.5 border border-white/20 flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-[#1a5b9c] shrink-0" />
                  <p className="text-[#3c556f] text-[10.5px] font-bold leading-tight">
                    Please specify your designated account category to initiate secure auth verification.
                  </p>
                </div>

                {/* Dropdown triggers Bottom picker */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block ml-1">
                    Academic Role Type:
                  </span>
                  <div 
                    onClick={() => setIsPickerOpen(true)}
                    className="w-full bg-[#f8fafc]/90 hover:bg-[#f1f5f9] border-2 border-[#b0c0d1] hover:border-[#1b4e80]/80 rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer transition shadow-sm font-sans active:bg-slate-100"
                    id="user-type-selector-btn"
                  >
                    <span className={`text-[12.5px] font-bold ${selectedCategory ? 'text-slate-800' : 'text-slate-400'}`}>
                      {getUserCategoryLabel(selectedCategory)}
                    </span>
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <UserIcon className="w-4 h-4 shrink-0" />
                      <ChevronDown className="w-4 h-4 shrink-0 opacity-70" />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="text-red-700 text-xs text-center font-bold bg-red-100/80 p-2.5 rounded-xl border border-red-200 shadow-sm flex items-center justify-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Next CTA button positioned exactly like OMSC Next button, but polished */}
                <div className="flex justify-end pt-3 w-full border-t border-slate-300/50 mt-4">
                  <button 
                    onClick={handleNext}
                    id="login-next-btn"
                    className="bg-[#1b4e80] hover:bg-[#123960] active:scale-[0.97] hover:shadow-lg text-white text-xs font-bold px-8 py-3 rounded-lg shadow-md transition-all duration-150 cursor-pointer uppercase tracking-wider"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 w-full"
              >
                {/* Back button and Category indicator bar */}
                <div className="flex items-center justify-between bg-white/40 p-2 rounded-xl border border-white/20">
                  <button 
                    type="button"
                    onClick={() => setStep(1)} 
                    className="p-1.5 text-[#1b4e80] bg-white hover:bg-slate-100 rounded-lg transition shadow-sm border border-slate-200 flex items-center gap-1"
                    title="Change user type"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Back</span>
                  </button>
                  <span className="text-[11px] font-extrabold text-[#113254] uppercase tracking-wide mr-2 flex items-center gap-1">
                    {selectedCategory && getRoleIcon(selectedCategory)}
                    {selectedCategory && getUserCategoryLabel(selectedCategory)}
                  </span>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 w-full">
                  
                  {/* Account simulation profile selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block ml-1">
                      Choose Profile Account:
                    </label>
                    
                    {getFilteredUsers().length === 0 ? (
                      <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-xl border border-yellow-250 font-bold block text-center">
                        No active users registered under this classification tab.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto pr-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-sm scrollbar-thin">
                        {getFilteredUsers().map(user => {
                          const isSelected = targetUser?.id === user.id;
                          return (
                            <div 
                              key={user.id}
                              onClick={() => {
                                setTargetUser(user);
                                setErrorMsg(null);
                              }}
                              className={`p-2 rounded-lg cursor-pointer transition flex items-center justify-between border ${
                                isSelected 
                                  ? 'bg-[#1b4e80]/10 border-[#1b4e80] text-slate-900 font-extrabold' 
                                  : 'bg-white border-transparent hover:bg-slate-100 text-slate-700 font-semibold'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${isSelected ? 'bg-[#1b4e80] text-white' : 'bg-slate-200 text-slate-600'}`}>
                                  {user.name.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="text-[11.5px] truncate max-w-[190px]">{user.name}</span>
                              </div>
                              <div className="flex items-center">
                                <span className={`text-[9px] font-mono opacity-60 mr-2 ${isSelected ? 'text-[#1b4e80] font-bold' : ''}`}>
                                  @{user.email.split('@')[0]}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#1b4e80] shrink-0" strokeWidth={3} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Password / Verification code input styled simulation */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                        Academic Password / PIN:
                      </label>
                      <span className="text-[9px] bg-sky-150 text-sky-800 font-bold px-1.5 py-0.2 rounded font-mono select-none">
                        Secured Simulation
                      </span>
                    </div>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Type PIN to bypass..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-[#f8fafc] border-2 border-[#b0c0d1] focus:border-[#1b4e80] rounded-xl pl-4 pr-10 py-3 text-xs text-slate-850 placeholder:text-slate-400 focus:outline-none focus:ring-0 font-mono font-bold tracking-widest transition duration-150"
                        id="login-pwd-field"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="text-red-700 text-xs text-center font-bold bg-red-100/80 p-2.5 rounded-xl border border-red-200 shadow-sm flex items-center justify-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit login */}
                  <button 
                    type="submit"
                    id="submit-auth-btn"
                    disabled={!targetUser}
                    className={`w-full text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-all duration-150 uppercase tracking-wider mt-3 flex items-center justify-center gap-1.5 ${
                      targetUser 
                        ? 'bg-[#1b4e80] hover:bg-[#123960] active:scale-[0.97] hover:shadow-lg cursor-pointer' 
                        : 'bg-slate-450 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <KeyRound className="w-4 h-4 shrink-0" />
                    <span>Sign In to CapstoneHub</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Social indicator icons beneath card body */}
        <div className="flex justify-center items-center gap-3 mt-7 border-t border-slate-300 w-full pt-4.5">
          <a href="#" className="w-8 h-8 rounded-lg bg-[#136127] hover:bg-[#0c431a] text-white flex items-center justify-center transition-all duration-150 shadow-sm hover:shadow-md hover:scale-110" title="OMSC Website">
            <Globe className="w-4 h-4" />
          </a>
          <a href="#" className="w-8 h-8 rounded-lg bg-[#185594] hover:bg-[#0f3b68] text-white flex items-center justify-center transition-all duration-150 shadow-sm hover:shadow-md hover:scale-110" title="Official Facebook">
            <Facebook className="w-4 h-4 fill-current" />
          </a>
          <a href="#" className="w-8 h-8 rounded-lg bg-[#b4226d] hover:bg-[#7e174b] text-white flex items-center justify-center transition-all duration-150 shadow-sm hover:shadow-md hover:scale-110" title="Instagram">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" className="w-8 h-8 rounded-lg bg-[#cf3c1a] hover:bg-[#912810] text-white flex items-center justify-center transition-all duration-150 shadow-sm hover:shadow-md hover:scale-110" title="Institutional Mail">
            <Mail className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Styled bottom picker menu exactly like OMSC mobile sheet */}
      <AnimatePresence>
        {isPickerOpen && (
          <>
            {/* Backdrop with elegant blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPickerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Bottom Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-[#292222] text-slate-100 rounded-t-[2rem] shadow-2xl z-55 p-6 flex flex-col font-sans border-t border-white/10"
              id="omsc-bottom-sheet-picker"
            >
              {/* Little native-looking pill handle line */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />

              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
                    Select User Type Classification
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">Select one of the validated portal categories below</p>
                </div>

                {/* Options List based on original image */}
                <div className="space-y-1 my-2 max-h-[290px] overflow-y-auto pr-1">
                  
                  {/* Item: Default Header option */}
                  <div 
                    onClick={() => handleSelectCategory(null)}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl cursor-pointer transition-all border ${
                      !selectedCategory 
                        ? 'bg-white/10 border-peach-400/30' 
                        : 'border-transparent hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs font-semibold tracking-wide text-slate-400 italic">
                      - Select type of user to log-in -
                    </span>
                    <div className="w-5 h-5 rounded-full border-2 border-[#ff7070] flex items-center justify-center shrink-0">
                      {!selectedCategory && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff7070]" />
                      )}
                    </div>
                  </div>

                  {/* Category Option: STUDENT */}
                  <div 
                    onClick={() => handleSelectCategory('STUDENT')}
                    className={`flex items-center justify-between py-3 py-3.5 px-4 rounded-xl cursor-pointer transition-all border ${
                      selectedCategory === 'STUDENT' 
                        ? 'bg-[#ff7070]/10 border-[#ff7070]/30' 
                        : 'border-transparent hover:bg-white/5'
                    }`}
                    id="picker-opt-student"
                  >
                    <div className="flex items-center space-x-2.5">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-bold tracking-wide">
                        Student
                      </span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-[#ff7070] flex items-center justify-center shrink-0">
                      {selectedCategory === 'STUDENT' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff7070]" />
                      )}
                    </div>
                  </div>

                  {/* Category Option: ADVISER */}
                  <div 
                    onClick={() => handleSelectCategory('ADVISER')}
                    className={`flex items-center justify-between py-3 py-3.5 px-4 rounded-xl cursor-pointer transition-all border ${
                      selectedCategory === 'ADVISER' 
                        ? 'bg-[#ff7070]/10 border-[#ff7070]/30' 
                        : 'border-transparent hover:bg-white/5'
                    }`}
                    id="picker-opt-adviser"
                  >
                    <div className="flex items-center space-x-2.5">
                      <UserCheck className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-bold tracking-wide">
                        Faculty/Adviser
                      </span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-[#ff7070] flex items-center justify-center shrink-0">
                      {selectedCategory === 'ADVISER' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff7070]" />
                      )}
                    </div>
                  </div>

                  {/* Category Option: PANELIST */}
                  <div 
                    onClick={() => handleSelectCategory('PANELIST')}
                    className={`flex items-center justify-between py-3 py-3.5 px-4 rounded-xl cursor-pointer transition-all border ${
                      selectedCategory === 'PANELIST' 
                        ? 'bg-[#ff7070]/10 border-[#ff7070]/30' 
                        : 'border-transparent hover:bg-white/5'
                    }`}
                    id="picker-opt-panelist"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold tracking-wide">
                        Panelist Member
                      </span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-[#ff7070] flex items-center justify-center shrink-0">
                      {selectedCategory === 'PANELIST' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff7070]" />
                      )}
                    </div>
                  </div>

                  {/* Category Option: ADMIN */}
                  <div 
                    onClick={() => handleSelectCategory('ADMIN')}
                    className={`flex items-center justify-between py-3 py-3.5 px-4 rounded-xl cursor-pointer transition-all border ${
                      selectedCategory === 'ADMIN' 
                        ? 'bg-[#ff7070]/10 border-[#ff7070]/30' 
                        : 'border-transparent hover:bg-white/5'
                    }`}
                    id="picker-opt-admin"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Sliders className="w-4 h-4 text-rose-400" />
                      <span className="text-sm font-bold tracking-wide">
                        Executive/Admin
                      </span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-[#ff7070] flex items-center justify-center shrink-0">
                      {selectedCategory === 'ADMIN' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff7070]" />
                      )}
                    </div>
                  </div>

                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setIsPickerOpen(false)}
                    className="w-full bg-[#3d3131] hover:bg-[#4d3f3f] active:scale-[0.98] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Styled bottom text mimicking the mobile screen elements */}
      <div className="w-full text-center text-[#e4f2fa]/50 text-[10px] font-bold tracking-wider uppercase mt-4 z-10 selection:bg-sky-900 selection:text-white">
        OMSC Academic Dissertation Hub © 2026
      </div>
    </div>
  );
}
