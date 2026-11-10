import React, { useState, useMemo } from 'react';
import { useAuth, validatePasswordCriteria } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  X, 
  Building2, 
  User as UserIcon, 
  ShieldAlert, 
  FileCheck, 
  Phone, 
  MapPin, 
  Mail, 
  Lock, 
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialRole = 'customer' }) => {
  const { login, signupCustomer, signupSeller, switchUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  // Login Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Customer Signup States
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custConfirmPassword, setCustConfirmPassword] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custPincode, setCustPincode] = useState('');

  // Seller Signup States
  const [sellerName, setSellerName] = useState('');
  const [sellerBusinessName, setSellerBusinessName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [sellerConfirmPassword, setSellerConfirmPassword] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerGst, setSellerGst] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [sellerCity, setSellerCity] = useState('');
  const [sellerPincode, setSellerPincode] = useState('');

  // Real-time password criteria validation
  const currentTypedPassword = selectedRole === 'seller' ? sellerPassword : custPassword;
  const pwdValidation = useMemo(() => {
    return validatePasswordCriteria(currentTypedPassword);
  }, [currentTypedPassword]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    const res = login(loginEmail, loginPassword, selectedRole);
    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleCustomerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict Password Validation
    if (!pwdValidation.isValid) {
      setErrorMessage('Password must fulfill all 4 mandatory security criteria (see checklist below).');
      return;
    }

    if (custPassword !== custConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    const res = signupCustomer({
      name: custName,
      email: custEmail,
      password: custPassword,
      phone: custPhone,
      address: custAddress,
      city: custCity,
      pincode: custPincode,
    });

    if (res.success) {
      setSuccessMessage('Collector account created securely! Welcome to Aurelia.');
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setErrorMessage(res.message || 'Registration failed');
    }
  };

  const handleSellerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Strict Password Validation
    if (!pwdValidation.isValid) {
      setErrorMessage('Password must fulfill all 4 mandatory security criteria (see checklist below).');
      return;
    }

    if (sellerPassword !== sellerConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    const res = signupSeller({
      name: sellerName,
      businessName: sellerBusinessName,
      email: sellerEmail,
      password: sellerPassword,
      phone: sellerPhone,
      gstNumber: sellerGst,
      address: sellerAddress,
      city: sellerCity,
      pincode: sellerPincode,
    });

    if (res.success) {
      setSuccessMessage('Seller account registered with verified GST and secure password!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMessage(res.message || 'Registration failed');
    }
  };

  const prefillDemoLogin = (email: string, pwd: string, role: UserRole) => {
    setSelectedRole(role);
    setLoginEmail(email);
    setLoginPassword(pwd);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#11141c] border border-[#3d311f] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#211a11] via-[#2d2214] to-[#1c150c] p-5 sm:p-6 border-b border-[#3d2f1b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#141820] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#faf6ee]">
                {activeTab === 'login' ? 'Authenticate Your Account' : 'Secure Curatorial Registration'}
              </h3>
              <p className="text-xs text-[#d6b77c]">
                AURELIA | Fine Art & High-Security Collector Vault
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#2b2214] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Test Credentials Bar */}
        <div className="bg-[#151b26] px-4 py-2.5 border-b border-[#253245] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[11px] font-bold text-stone-300">⚡ Test Credentials:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => prefillDemoLogin('admin@aurelia.com', 'Admin@123', 'admin')}
              className="text-[10px] px-2 py-0.5 rounded bg-[#101e14] text-emerald-400 border border-emerald-800/80 hover:bg-emerald-950 font-mono"
            >
              🛡️ Admin: Admin@123
            </button>
            <button
              type="button"
              onClick={() => prefillDemoLogin('seller@maharaja-antiques.com', 'Seller@123', 'seller')}
              className="text-[10px] px-2 py-0.5 rounded bg-[#241a0d] text-amber-300 border border-amber-800/80 hover:bg-amber-950 font-mono"
            >
              💼 Seller: Seller@123
            </button>
            <button
              type="button"
              onClick={() => prefillDemoLogin('vikram.collector@gmail.com', 'Collector@123', 'customer')}
              className="text-[10px] px-2 py-0.5 rounded bg-[#0f1d2b] text-sky-300 border border-sky-800/80 hover:bg-sky-950 font-mono"
            >
              🏺 Collector: Collector@123
            </button>
          </div>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div className="flex border-b border-[#2b241a] text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'login'
                ? 'bg-[#1b202a] text-[#f2dab0] border-b-2 border-[#c5a059]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sign In (Password Required)
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'signup'
                ? 'bg-[#1b202a] text-[#f2dab0] border-b-2 border-[#c5a059]'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Create New Account (Set Secure Password)
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Notification Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-stone-300 mb-2">
              Account Role Category:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedRole === 'customer'
                    ? 'bg-[#292015] border-[#c5a059] text-[#f3dfb2] shadow-md shadow-[#c5a059]/10 font-bold'
                    : 'bg-[#161a22] border-[#293240] text-stone-400 hover:text-stone-200'
                }`}
              >
                <UserIcon className="w-5 h-5 mx-auto mb-1 text-[#c5a059]" />
                <div className="text-xs font-semibold">Customer</div>
                <div className="text-[10px] text-stone-400">Collector & Bidder</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('seller')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedRole === 'seller'
                    ? 'bg-[#292015] border-[#c5a059] text-[#f3dfb2] shadow-md shadow-[#c5a059]/10 font-bold'
                    : 'bg-[#161a22] border-[#293240] text-stone-400 hover:text-stone-200'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <div className="text-xs font-semibold">Product Seller</div>
                <div className="text-[10px] text-amber-400/80">GST Compulsory</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-[#292015] border-[#c5a059] text-[#f3dfb2] shadow-md shadow-[#c5a059]/10 font-bold'
                    : 'bg-[#161a22] border-[#293240] text-stone-400 hover:text-stone-200'
                }`}
              >
                <ShieldAlert className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <div className="text-xs font-semibold">Admin</div>
                <div className="text-[10px] text-stone-400">Master Chamber</div>
              </button>
            </div>
          </div>

          {/* VIEW 1: LOGIN FORM WITH STRICT PASSWORD VERIFICATION */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={
                      selectedRole === 'seller' 
                        ? 'seller@maharaja-antiques.com' 
                        : selectedRole === 'admin' 
                        ? 'admin@aurelia.com' 
                        : 'vikram.collector@gmail.com'
                    }
                    className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg py-2.5 pl-10 pr-4 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#c5a059]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-stone-300">
                    Account Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-stone-400 hover:text-stone-200 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your confidential account password"
                    className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg py-2.5 pl-10 pr-4 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#c5a059]"
                    required
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Password verification is strictly enforced. Only valid matching credentials grant access.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#b89347] hover:from-[#d4af37] hover:to-[#c5a059] text-black font-extrabold text-xs rounded-lg transition-all shadow-lg shadow-[#c5a059]/20"
              >
                Authenticate & Enter as {selectedRole.toUpperCase()}
              </button>
            </form>
          )}

          {/* VIEW 2: SIGNUP FORM (WITH STRICT 4-POINT PASSWORD VALIDATION) */}
          {activeTab === 'signup' && (
            <div>
              {/* SELLER REGISTRATION */}
              {selectedRole === 'seller' ? (
                <form onSubmit={handleSellerSignup} className="space-y-3.5">
                  <div className="bg-[#241a0f] border border-[#6b471c] p-3 rounded-xl text-xs text-amber-200">
                    <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
                      <FileCheck className="w-4 h-4 text-amber-400" />
                      COMPULSORY SELLER ONBOARDING REQUIREMENTS
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Every antique seller must provide a valid <strong>15-character GSTIN</strong>, a verified <strong>business telephone</strong>, and set a high-security encrypted password.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Antique Business / Firm Name *
                      </label>
                      <input
                        type="text"
                        value={sellerBusinessName}
                        onChange={(e) => setSellerBusinessName(e.target.value)}
                        placeholder="e.g. Royal Rajputana Antiques"
                        className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Authorized Representative Name *
                      </label>
                      <input
                        type="text"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        placeholder="e.g. Vikramaditya Rathore"
                        className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                        required
                      />
                    </div>
                  </div>

                  {/* Compulsory GST & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#171d27] p-3 rounded-xl border border-[#324054]">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-400 mb-1 flex items-center justify-between">
                        <span>GST NUMBER (COMPULSORY) *</span>
                        <span className="text-[10px] text-stone-400 font-normal">15 chars</span>
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={sellerGst}
                        onChange={(e) => setSellerGst(e.target.value.toUpperCase())}
                        placeholder="e.g. 27AAACA1234D1Z8"
                        className="w-full bg-[#0e1218] border border-amber-500/50 rounded-lg p-2 text-xs font-mono text-amber-200 uppercase placeholder-stone-500 focus:border-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-amber-400 mb-1">
                        PHONE NUMBER (COMPULSORY) *
                      </label>
                      <input
                        type="tel"
                        value={sellerPhone}
                        onChange={(e) => setSellerPhone(e.target.value)}
                        placeholder="e.g. +91 98201 12345"
                        className="w-full bg-[#0e1218] border border-amber-500/50 rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      placeholder="curator@antiques-gallery.com"
                      className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                      required
                    />
                  </div>

                  {/* Password & Confirm Password Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-200 mb-1">
                        Set Account Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={sellerPassword}
                          onChange={(e) => setSellerPassword(e.target.value)}
                          placeholder="Create strong password"
                          className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg py-2 pl-8 pr-3 text-xs text-stone-100 focus:border-[#c5a059]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-200 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={sellerConfirmPassword}
                          onChange={(e) => setSellerConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg py-2 pl-8 pr-3 text-xs text-stone-100 focus:border-[#c5a059]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* LIVE 4-POINT PASSWORD CRITERIA CHECKLIST */}
                  <div className="p-3.5 rounded-xl bg-[#0f141d] border border-[#26354a] space-y-1.5 text-xs">
                    <div className="text-[11px] font-bold text-amber-300 flex items-center justify-between mb-1">
                      <span>MANDATORY PASSWORD SECURITY CONDITIONS:</span>
                      <span className="font-mono text-[10px]">
                        {pwdValidation.isValid ? '✓ ALL CONDITIONS MET' : 'CRITERIA PENDING'}
                      </span>
                    </div>

                    <div className={`flex items-center gap-2 ${pwdValidation.hasMinLength ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}>
                      {pwdValidation.hasMinLength ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-stone-600 flex-shrink-0" />}
                      <span>Minimum 8 characters in length</span>
                    </div>

                    <div className={`flex items-center gap-2 ${pwdValidation.hasUppercase ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}>
                      {pwdValidation.hasUppercase ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-stone-600 flex-shrink-0" />}
                      <span>At least one capital letter (A–Z)</span>
                    </div>

                    <div className={`flex items-center gap-2 ${pwdValidation.hasNumber ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}>
                      {pwdValidation.hasNumber ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-stone-600 flex-shrink-0" />}
                      <span>At least one numeric digit (0–9)</span>
                    </div>

                    <div className={`flex items-center gap-2 ${pwdValidation.hasSpecialChar ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}>
                      {pwdValidation.hasSpecialChar ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-stone-600 flex-shrink-0" />}
                      <span>At least one special character (!@#$%^&*...)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Registered Vault / Gallery Address *
                    </label>
                    <input
                      type="text"
                      value={sellerAddress}
                      onChange={(e) => setSellerAddress(e.target.value)}
                      placeholder="Shop 4, Heritage Arcade, Colaba, Mumbai"
                      className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!pwdValidation.isValid}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold text-xs rounded-lg transition-all shadow-lg shadow-amber-500/20"
                  >
                    Register as GST-Verified Antique Seller
                  </button>
                </form>
              ) : (
                /* CUSTOMER REGISTRATION */
                <form onSubmit={handleCustomerSignup} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Collector's Full Name *
                      </label>
                      <input
                        type="text"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="e.g. Vikramaditya Rao"
                        className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        Phone Number (Compulsory for Bidding) *
                      </label>
                      <input
                        type="tel"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="vikram.collector@gmail.com"
                      className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                      required
                    />
                  </div>

                  {/* Customer Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-200 mb-1">
                        Set Account Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={custPassword}
                          onChange={(e) => setCustPassword(e.target.value)}
                          placeholder="Create strong password"
                          className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg py-2 pl-8 pr-3 text-xs text-stone-100 focus:border-[#c5a059]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-200 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={custConfirmPassword}
                          onChange={(e) => setCustConfirmPassword(e.target.value)}
                          placeholder="Re-type password"
                          className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg py-2 pl-8 pr-3 text-xs text-stone-100 focus:border-[#c5a059]"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* LIVE 4-POINT PASSWORD CRITERIA CHECKLIST */}
                  <div className="p-3.5 rounded-xl bg-[#0f141d] border border-[#26354a] space-y-1.5 text-xs">
                    <div className="text-[11px] font-bold text-[#d6b77c] flex items-center justify-between mb-1">
                      <span>MANDATORY PASSWORD SECURITY CONDITIONS:</span>
                      <span className="font-mono text-[10px]">
                        {pwdValidation.isValid ? '✓ ALL CONDITIONS MET' : 'CRITERIA PENDING'}
                      </span>
                    </div>

                    <div className={`flex items-center gap-2 ${pwdValidation.hasMinLength ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}>
                      {pwdValidation.hasMinLength ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-stone-600 flex-shrink-0" />}
                      <span>Minimum 8 characters in length</span>
                    </div>

                    <div className={`flex items-center gap-2 ${pwdValidation.hasUppercase ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}>
                      {pwdValidation.hasUppercase ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-stone-600 flex-shrink-0" />}
                      <span>At least one capital letter (A–Z)</span>
                    </div>

                    <div className={`flex items-center gap-2 ${pwdValidation.hasNumber ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}>
                      {pwdValidation.hasNumber ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-stone-600 flex-shrink-0" />}
                      <span>At least one numeric digit (0–9)</span>
                    </div>

                    <div className={`flex items-center gap-2 ${pwdValidation.hasSpecialChar ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}>
                      {pwdValidation.hasSpecialChar ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Circle className="w-4 h-4 text-stone-600 flex-shrink-0" />}
                      <span>At least one special character (!@#$%^&*...)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                      White-Glove Shipping Address (Compulsory) *
                    </label>
                    <textarea
                      rows={2}
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      placeholder="Penthouse 12B, Regency Heritage Towers, Indiranagar"
                      className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={custCity}
                        onChange={(e) => setCustCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={custPincode}
                        onChange={(e) => setCustPincode(e.target.value)}
                        placeholder="560038"
                        className="w-full bg-[#161a22] border border-[#343d4d] rounded-lg p-2 text-xs text-stone-200 placeholder-stone-500 focus:border-[#c5a059]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!pwdValidation.isValid}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-[#c5a059] to-[#d4af37] hover:from-[#d4af37] hover:to-[#c5a059] disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold text-xs rounded-lg transition-all shadow-lg shadow-[#c5a059]/20"
                  >
                    Register as Antique Collector
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
