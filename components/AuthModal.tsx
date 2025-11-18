import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'email' | 'setup-2fa' | 'otp';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { login, isLoading } = useAuth();
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setOtp('');
    }
  }, [isOpen, step]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('authErrorInvalidEmail'));
      return;
    }
    setError('');

    // MOCK: Simulate checking if user needs to set up 2FA for this "device" (browser)
    const is2faSetup = localStorage.getItem(`cortexstudio-2fa-setup-complete-${email}`);
    if (is2faSetup) {
      setStep('otp');
    } else {
      setStep('setup-2fa');
    }
  };
  
  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError(t('authErrorInvalidOtp'));
      return;
    }
    setError('');
    // MOCK: In a real app, you'd verify the OTP against the secret
    localStorage.setItem(`cortexstudio-2fa-setup-complete-${email}`, 'true');
    setStep('otp');
    setOtp(''); // Clear OTP for login step
  };


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError(t('authErrorInvalidOtp'));
      return;
    }
    setError('');

    const success = await login(email, otp);
    if (!success) {
      setError(t('authLoginFailed'));
    }
    // On success, the modal will be unmounted by the parent App component
  };
  
  const goBackToEmail = () => {
    setError('');
    setOtp('');
    setStep('email');
  };

  if (!isOpen) return null;

  const renderContent = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit} className="p-8 space-y-4" noValidate>
            <div className="text-center mb-6">
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono tracking-tighter filter drop-shadow-lg">
                    Cortex
                </h1>
                <h2 className="text-4xl font-bold text-slate-300 font-mono tracking-tight -mt-2">
                    CodeStudio
                </h2>
            </div>
            <h2 className="text-xl font-semibold text-gray-200 text-center">{t('authModalTitlePasswordless')}</h2>
            <p className="text-center text-sm text-gray-400">{t('authEnterEmailPrompt')}</p>
            <div>
              <label htmlFor="email" className="sr-only">{t('authEmailLabel')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('authEmailLabel')}
                required
                className={`block w-full px-3 py-2 bg-slate-800/60 border rounded-md shadow-sm placeholder-gray-500 text-gray-200 focus:outline-none sm:text-sm ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-purple-500 focus:border-purple-500'}`}
              />
               {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:opacity-50">
                {isLoading ? '...' : t('authContinue')}
              </button>
            </div>
          </form>
        );
        
      case 'setup-2fa':
        return (
            <form onSubmit={handleSetupSubmit} className="p-8 space-y-4 text-center">
                 <div className="text-center mb-6">
                    <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono tracking-tighter filter drop-shadow-lg">Cortex</h1>
                    <h2 className="text-4xl font-bold text-slate-300 font-mono tracking-tight -mt-2">CodeStudio</h2>
                </div>
                 <h2 className="text-xl font-semibold text-gray-200">{t('authTitleSetup2FA')}</h2>
                 <p className="text-sm text-gray-400">{t('authScanQr')}</p>
                 {/* Placeholder QR Code */}
                 <div className="flex justify-center my-4">
                    <svg width="128" height="128" viewBox="0 0 100 100" className="bg-white p-2 rounded-lg">
                        <path d="M10 10 H30 V30 H10 Z M15 15 H25 V25 H15 Z M70 10 H90 V30 H70 Z M75 15 H85 V25 H75 Z M10 70 H30 V90 H10 Z M15 75 H25 V85 H15 Z M45 10 H55 V20 H45 Z M10 45 H20 V55 H10 Z M35 35 H65 V65 H35 Z M40 40 H60 V60 H40 Z M70 45 H80 V55 H70 Z M45 70 H55 V80 H45 Z M70 70 H90 V90 H70 Z M75 75 H85 V85 H75 Z" fill="#111827" />
                    </svg>
                 </div>
                 <p className="text-sm text-gray-400">{t('authOrEnterSecret')}</p>
                 <div className="my-2 p-2 bg-slate-800 rounded-md font-mono text-lg tracking-widest text-gray-200">
                    ABCD EFGH IJKL MNOP
                 </div>
                 <p className="text-sm text-gray-400">{t('authEnterOtpToVerify')}</p>
                 <div>
                    <label htmlFor="otp" className="sr-only">{t('authOtpLabel')}</label>
                    <input type="text" id="otp" value={otp} onChange={e => setOtp(e.target.value)} required placeholder="123456" maxLength={6} className={`block w-full text-center tracking-[0.5em] text-2xl px-3 py-2 bg-slate-800/60 border rounded-md shadow-sm text-gray-200 focus:outline-none ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-purple-500 focus:border-purple-500'}`} />
                    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                 </div>
                 <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:opacity-50">
                    {isLoading ? '...' : t('authVerifyAndContinue')}
                 </button>
                 <button type="button" onClick={goBackToEmail} className="text-sm text-cyan-400 hover:underline">{t('authGoBack')}</button>
            </form>
        );

      case 'otp':
        return (
          <form onSubmit={handleLoginSubmit} className="p-8 space-y-4" noValidate>
            <div className="text-center mb-6">
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono tracking-tighter filter drop-shadow-lg">Cortex</h1>
                <h2 className="text-4xl font-bold text-slate-300 font-mono tracking-tight -mt-2">CodeStudio</h2>
            </div>
            <h2 className="text-xl font-semibold text-gray-200 text-center">{t('authTitleEnterOtp')}</h2>
            <p className="text-center text-sm text-gray-400">{t('authEnterOtpPrompt', {email})}</p>
            <div>
              <label htmlFor="otp" className="sr-only">{t('authOtpLabel')}</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                placeholder="123456"
                maxLength={6}
                autoComplete="one-time-code"
                className={`block w-full text-center tracking-[0.5em] text-2xl px-3 py-2 bg-slate-800/60 border rounded-md shadow-sm text-gray-200 focus:outline-none ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-purple-500 focus:border-purple-500'}`}
              />
               {error && <p className="mt-1 text-xs text-red-500 text-center">{error}</p>}
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 disabled:opacity-50">
                {isLoading ? '...' : t('authVerifyAndLogin')}
              </button>
            </div>
            <div className="text-center">
              <button type="button" onClick={goBackToEmail} className="text-sm text-cyan-400 hover:underline">
                {t('authGoBack')}
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div 
        className="bg-gradient-to-br from-purple-900 via-slate-950 to-black animate-gradient-xy backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-sm flex flex-col shadow-2xl shadow-black/40"
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;