import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import jsQR from 'jsqr';
import {
  Activity,
  AlertCircle,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  BadgeIndianRupee,
  BarChart3,
  Bike,
  Building2,
  CalendarClock,
  Camera,
  Car,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Delete,
  Download,
  Droplets,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Gauge,
  HeartPulse,
  Home,
  ImagePlus,
  KeyRound,
  Landmark,
  LockKeyhole,
  Minus,
  Pause,
  Play,
  Plus,
  QrCode,
  RefreshCw,
  RotateCcw,
  ScanLine,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Store,
  Trash2,
  TrendingDown,
  TrendingUp,
  Tv,
  Umbrella,
  User,
  Users,
  Wallet,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

// ============================================================================
// SECTION: PWA & Android Install Support (WebAPK + Offline Mode)
// ============================================================================

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    install,
  };
}

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white shadow-lg">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      <span>Offline Mode — Cached app active</span>
    </div>
  );
}

function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuideModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install Android App"
        className="min-h-[36px] px-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-xs"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isInstallable ? 'Install App' : 'APK / Install'}</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-slate-900"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-app-guide-title"
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <PhonePeLogo size="md" />
                <div>
                  <p className="text-xs text-slate-500">Android WebAPK &amp; PWA Ready</p>
                  <h3 id="install-app-guide-title" className="text-base font-semibold text-slate-900">
                    Install PhonePe on Mobile
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                aria-label="Close install guide"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">iPhone / iPad (Safari)</p>
                <p>1. Open the app URL directly in Safari (outside preview frame).</p>
                <p>2. Tap the <strong>Share</strong> button in Safari toolbar.</p>
                <p>3. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-3 text-xs text-slate-700">
                <div className="rounded-xl bg-purple-50/70 border border-purple-200 p-3.5 space-y-1.5">
                  <p className="font-semibold text-slate-900">Option 1: Direct Android App Install (WebAPK)</p>
                  <p>1. Open the <strong>Shared App URL</strong> directly in <strong>Google Chrome</strong> on Android.</p>
                  <p>2. Tap <strong>Install App</strong> (or Chrome menu <strong>⋮</strong> → <strong>Install app</strong>).</p>
                  <p>3. PhonePe installs on your home screen &amp; app drawer with offline support.</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5">
                  <p className="font-semibold text-slate-900">Option 2: Download Signed .APK File</p>
                  <p>1. Copy your <strong>Shared App URL</strong>.</p>
                  <p>2. Open <strong>pwabuilder.com</strong>, paste the URL, and click <strong>Start</strong>.</p>
                  <p>3. Click <strong>Package for Stores</strong> → <strong>Android</strong> → <strong>Download</strong> to get your installable <code>.apk</code> file.</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="mt-4 w-full h-11 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] text-white text-sm font-semibold transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// SECTION: PhonePe Brand Emblem, Splash Screen & Payment Chime
// ============================================================================

function playPhonePeSuccessChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number, gainPeak: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    playTone(659.25, now, 0.16, 0.14); // E5
    playTone(880.0, now + 0.11, 0.28, 0.18); // A5
    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch {
    // Ignore autoplay / audio context restrictions
  }
}

interface PhonePeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function PhonePeLogo({ size = 'md' }: PhonePeLogoProps) {
  const uid = React.useId().replace(/:/g, '');
  const bgGradId = `ppeBgGrad-${uid}`;

  const dims =
    size === 'sm'
      ? 'w-7 h-7'
      : size === 'lg'
        ? 'w-12 h-12'
        : size === 'xl'
          ? 'w-24 h-24'
          : 'w-9 h-9';

  return (
    <svg
      viewBox="0 0 64 64"
      className={`${dims} shrink-0`}
      role="img"
      aria-label="PhonePe Logo"
    >
      <defs>
        <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#45137D" />
          <stop offset="60%" stopColor="#5F259F" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* PhonePe Signature Circular Purple Emblem */}
      <circle cx="32" cy="32" r="30" fill={`url(#${bgGradId})`} />
      <circle
        cx="32"
        cy="32"
        r="27"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />

      {/* Crisp Geometric Vector पे Mark */}
      <path
        d="M39.5 25 Q35.2 17 25.5 16.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4.8"
        strokeLinecap="round"
      />
      <rect x="19" y="24" width="26" height="4.8" rx="2.4" fill="#FFFFFF" />
      <rect x="37.5" y="24.5" width="5" height="23" rx="2.5" fill="#FFFFFF" />
      <path
        d="M24 26.5 V34.5 C24 40 27.5 42.8 32.5 42.8 C35.8 42.8 38.2 41.2 39.8 39"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SplashScreen({ isVisible, isFading }: { isVisible: boolean; isFading: boolean }) {
  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-label="Loading PhonePe"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#21073E] via-[#45137D] to-[#5F259F] text-white transition-opacity duration-300 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-6 rounded-full bg-purple-300/20 blur-2xl animate-pulse" />
        <div className="relative rounded-full p-2.5 bg-white/10 ring-1 ring-white/25 shadow-2xl shadow-purple-950/70">
          <PhonePeLogo size="xl" />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">PhonePe</h1>
        <p className="mt-1 text-xs font-medium tracking-widest uppercase text-purple-200/90">
          UPI · Payments · Banking
        </p>
        <div className="mt-6 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-200 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-purple-200 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-purple-200 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION: src/components/BankLogo.tsx
// ============================================================================

interface BankLogoProps {
  shortCode: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES: Record<NonNullable<BankLogoProps['size']>, string> = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-2xl',
};

function BankLogo({ shortCode, size = 'md' }: BankLogoProps) {
  const code = shortCode.toUpperCase();
  const boxClass = `${SIZE_CLASSES[size]} flex items-center justify-center shrink-0 overflow-hidden border border-slate-200/80 bg-white shadow-2xs`;

  if (code === 'HDFC') {
    return (
      <span className={boxClass} aria-hidden="true">
        <svg viewBox="0 0 36 36" className="w-6 h-6">
          <rect x="4" y="4" width="28" height="28" rx="3" fill="#ED232A" />
          <rect x="10" y="10" width="16" height="16" fill="#FFFFFF" />
          <rect x="16" y="4" width="4" height="28" fill="#FFFFFF" />
          <rect x="4" y="16" width="28" height="4" fill="#FFFFFF" />
          <rect x="13" y="13" width="10" height="10" fill="#004C8F" />
        </svg>
      </span>
    );
  }

  if (code === 'SBI') {
    return (
      <span className={boxClass} aria-hidden="true">
        <svg viewBox="0 0 36 36" className="w-6 h-6">
          <circle cx="18" cy="18" r="14" fill="#00A9E0" />
          <circle cx="18" cy="15.5" r="4.2" fill="#FFFFFF" />
          <rect x="16.2" y="18" width="3.6" height="14" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  if (code === 'ICICI') {
    return (
      <span className={boxClass} aria-hidden="true">
        <svg viewBox="0 0 36 36" className="w-6 h-6">
          <rect x="3" y="3" width="30" height="30" rx="7" fill="#B02A30" />
          <path
            d="M18 8c-4.4 0-8 3.6-8 8v9.5h4.2V16c0-2.1 1.7-3.8 3.8-3.8s3.8 1.7 3.8 3.8v9.5H26V16c0-4.4-3.6-8-8-8z"
            fill="#F37E20"
          />
          <circle cx="18" cy="17.5" r="2.6" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  if (code === 'AXIS') {
    return (
      <span className={boxClass} aria-hidden="true">
        <svg viewBox="0 0 36 36" className="w-6 h-6">
          <rect x="3" y="3" width="30" height="30" rx="7" fill="#97144D" />
          <path d="M18 8L28 27h-5.2l-4.8-9.8L13.2 27H8L18 8z" fill="#FFFFFF" />
          <path d="M15.2 21.5h5.6L18 16l-2.8 5.5z" fill="#F2B705" />
        </svg>
      </span>
    );
  }

  if (code === 'KOTAK') {
    return (
      <span className={boxClass} aria-hidden="true">
        <svg viewBox="0 0 36 36" className="w-6 h-6">
          <rect x="3" y="3" width="30" height="30" rx="7" fill="#ED1C24" />
          <path
            d="M12.5 13c-2.5 0-4.5 2-4.5 5s2 5 4.5 5c2.2 0 3.7-1.6 5.5-5 1.8-3.4 3.3-5 5.5-5 2.5 0 4.5 2 4.5 5s-2 5-4.5 5c-2.2 0-3.7-1.6-5.5-5-1.8-3.4-3.3-5-5.5-5z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  if (code === 'PNB') {
    return (
      <span className={boxClass} aria-hidden="true">
        <svg viewBox="0 0 36 36" className="w-6 h-6">
          <rect x="3" y="3" width="30" height="30" rx="7" fill="#A20A3A" />
          <circle cx="18" cy="18" r="9.5" fill="none" stroke="#F5B700" strokeWidth="2.8" />
          <path d="M18 9v18M9 18h18" stroke="#F5B700" strokeWidth="2.2" />
          <circle cx="18" cy="18" r="3" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  return (
    <span className={`${SIZE_CLASSES[size]} flex items-center justify-center shrink-0 bg-purple-50 text-[#5F259F] border border-purple-100`}>
      <Landmark className="w-4 h-4" />
    </span>
  );
}

// ============================================================================
// SECTION: src/components/PinVerifyModal.tsx
// ============================================================================

interface PinVerifyModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  expectedPin: string;
  onSuccess: () => void;
  onCancel: () => void;
  onResetPin?: (newPin: string) => void;
}

type ModalMode = 'verify' | 'reset-new' | 'reset-confirm';

function PinVerifyModal({
  isOpen,
  title,
  subtitle,
  expectedPin,
  onSuccess,
  onCancel,
  onResetPin,
}: PinVerifyModalProps) {
  const [pin, setPin] = useState('');
  const [draftNewPin, setDraftNewPin] = useState('');
  const [mode, setMode] = useState<ModalMode>('verify');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setDraftNewPin('');
      setMode('verify');
      setShowPin(false);
      setErrorMsg('');
      setInfoMsg('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setErrorMsg('');
        setPin((prev) => (prev.length < 4 ? prev + e.key : prev));
      } else if (e.key === 'Backspace') {
        setErrorMsg('');
        setPin((prev) => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const startForgotPin = () => {
    setPin('');
    setDraftNewPin('');
    setErrorMsg('');
    setInfoMsg('');
    setShowPin(true);
    setMode('reset-new');
  };

  const backToVerify = () => {
    setPin('');
    setDraftNewPin('');
    setErrorMsg('');
    setInfoMsg('');
    setShowPin(false);
    setMode('verify');
  };

  const handleAction = () => {
    if (pin.length < 4) {
      setErrorMsg('Please enter all 4 digits.');
      return;
    }

    if (mode === 'verify') {
      if (pin !== expectedPin) {
        setErrorMsg('Incorrect PIN. Forgot your PIN? Tap "Forgot PIN?" below to create a new one.');
        setPin('');
        return;
      }
      setErrorMsg('');
      onSuccess();
      return;
    }

    if (mode === 'reset-new') {
      setDraftNewPin(pin);
      setPin('');
      setErrorMsg('');
      setMode('reset-confirm');
      return;
    }

    if (mode === 'reset-confirm') {
      if (pin !== draftNewPin) {
        setErrorMsg('PINs did not match. Re-enter the same new 4-digit PIN.');
        setPin('');
        return;
      }
      onResetPin?.(pin);
      setDraftNewPin('');
      setPin('');
      setErrorMsg('');
      setShowPin(false);
      setInfoMsg('New unified PIN saved for all linked accounts! Enter it below or tap Verify.');
      setMode('verify');
    }
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length >= 4) return;
    setPin((prev) => prev + digit);
    setErrorMsg('');
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const isResetMode = mode !== 'verify';

  const headerTitle =
    mode === 'reset-new'
      ? 'Create New PIN'
      : mode === 'reset-confirm'
        ? 'Confirm New PIN'
        : title;

  const headerSubtitle =
    mode === 'reset-new'
      ? 'No old PIN needed · Applies to all accounts'
      : mode === 'reset-confirm'
        ? 'Re-enter your new 4-digit PIN to save'
        : subtitle;

  const primaryButtonLabel =
    mode === 'reset-new' ? 'Next' : mode === 'reset-confirm' ? 'Save PIN' : 'Submit';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pin-verify-title"
        className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* PhonePe-style UPI PIN Header Bar */}
        <div className="bg-gradient-to-r from-[#3B1068] via-[#5F259F] to-[#6D28D9] text-white px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              {isResetMode ? <KeyRound className="w-4 h-4 text-white" /> : <LockKeyhole className="w-4 h-4 text-white" />}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-200 truncate">
                PhonePe · UPI Security
              </p>
              <h3 id="pin-verify-title" className="text-sm font-semibold text-white truncate">
                {headerTitle}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel PIN entry"
            className="min-h-[38px] min-w-[38px] rounded-xl flex items-center justify-center text-white/80 hover:bg-white/15 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-xl bg-purple-50/70 border border-purple-100 px-3 py-2 text-center">
            <p className="text-[11px] font-semibold tracking-wide uppercase text-[#5F259F]">
              {mode === 'reset-new'
                ? 'SET NEW 4-DIGIT UPI PIN'
                : mode === 'reset-confirm'
                  ? 'RE-ENTER NEW 4-DIGIT UPI PIN'
                  : 'ENTER 4-DIGIT UPI PIN'}
            </p>
            <p className="text-xs text-slate-600 mt-0.5 truncate">{headerSubtitle}</p>
          </div>

          {/* 4-Digit UPI PIN Boxes */}
          <div className="mt-5 flex items-center justify-center gap-3">
            {[0, 1, 2, 3].map((idx) => {
              const char = pin[idx];
              const isFilled = Boolean(char);
              return (
                <div
                  key={idx}
                  className={`w-12 h-13 rounded-xl border-2 flex items-center justify-center font-numeric text-xl font-bold transition-colors ${
                    isFilled
                      ? 'border-[#5F259F] bg-purple-50/50 text-slate-900'
                      : idx === pin.length
                        ? 'border-[#5F259F]/60 bg-white'
                        : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  {isFilled ? (showPin ? char : '•') : ''}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setShowPin((prev) => !prev)}
              aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <p className="mt-2.5 text-center text-[11px] text-slate-500">
            {isResetMode
              ? 'Direct reset · No previous PIN required'
              : 'Unified 4-digit UPI PIN · Applies to all linked bank accounts'}
          </p>

          {/* Forgot PIN / Back to Verify Action */}
          {onResetPin && (
            <div className="mt-2 flex justify-center">
              {mode === 'verify' ? (
                <button
                  type="button"
                  onClick={startForgotPin}
                  className="min-h-[36px] px-3 rounded-lg text-xs font-semibold text-[#5F259F] hover:bg-purple-50 transition-colors"
                >
                  Forgot UPI PIN? Reset PIN
                </button>
              ) : (
                <button
                  type="button"
                  onClick={backToVerify}
                  className="min-h-[36px] px-3 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Back to Enter UPI PIN
                </button>
              )}
            </div>
          )}

          {infoMsg && !errorMsg && (
            <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitClick(digit)}
                className="h-12 rounded-xl bg-slate-100 hover:bg-purple-50 active:scale-95 font-numeric text-lg font-semibold text-slate-900 transition-all"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              aria-label="Backspace"
              className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all"
            >
              <Delete className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleDigitClick('0')}
              className="h-12 rounded-xl bg-slate-100 hover:bg-purple-50 active:scale-95 font-numeric text-lg font-semibold text-slate-900 transition-all"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleAction}
              disabled={pin.length < 4}
              className="h-12 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] disabled:opacity-40 active:scale-95 text-white text-sm font-semibold transition-all"
            >
              {primaryButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION: src/components/QrScannerModal.tsx
// ============================================================================

interface ParsedQrResult {
  rawText: string;
  payeeName: string;
  upiId: string;
  amount: string;
}

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (result: ParsedQrResult) => void;
}

const SAMPLE_QR_CODES = [
  {
    label: 'FreshMart Groceries',
    sub: '₹240 · freshmart@okaxis.demo',
    payload: 'upi://pay?pa=freshmart@okaxis.demo&pn=FreshMart%20Groceries&am=240&cu=INR',
  },
  {
    label: 'Chai Point Express',
    sub: '₹65 · chaipoint@okicici.demo',
    payload: 'upi://pay?pa=chaipoint@okicici.demo&pn=Chai%20Point%20Express&am=65&cu=INR',
  },
  {
    label: 'City Fuel Station',
    sub: 'Custom amount · cityfuel@oksbi.demo',
    payload: 'upi://pay?pa=cityfuel@oksbi.demo&pn=City%20Fuel%20Station&cu=INR',
  },
];

function parseQrPayload(rawText: string): ParsedQrResult {
  const trimmed = rawText.trim();
  const upiMatch = trimmed.match(/upi:\/\/pay\?[^\s]+/i);
  const upiUri = upiMatch ? upiMatch[0] : trimmed.toLowerCase().startsWith('upi://') ? trimmed : null;

  if (upiUri) {
    try {
      const queryIndex = upiUri.indexOf('?');
      const params = new URLSearchParams(queryIndex >= 0 ? upiUri.slice(queryIndex + 1) : '');
      const pa = params.get('pa')?.trim() || '';
      const pn = params.get('pn')?.trim() || '';
      const am = params.get('am')?.trim() || '';
      return {
        rawText: upiUri,
        payeeName: pn || pa || 'QR Merchant',
        upiId: pa,
        amount: am && !Number.isNaN(Number(am)) ? am : '',
      };
    } catch {
      // Fall through to generic parsing
    }
  }

  const phoneDigits = trimmed.replace(/\D/g, '');
  if (phoneDigits.length === 10 || (phoneDigits.length === 12 && phoneDigits.startsWith('91'))) {
    const tenDigits = phoneDigits.slice(-10);
    return {
      rawText: trimmed,
      payeeName: `+91 ${tenDigits}`,
      upiId: `${tenDigits}@pay.demo`,
      amount: '',
    };
  }

  if (trimmed.includes('@') && !trimmed.includes(' ')) {
    return {
      rawText: trimmed,
      payeeName: trimmed.split('@')[0] || trimmed,
      upiId: trimmed,
      amount: '',
    };
  }

  return {
    rawText: trimmed,
    payeeName: trimmed.slice(0, 60) || 'Scanned QR',
    upiId: '',
    amount: '',
  };
}

function QrScannerModal({ isOpen, onClose, onScanSuccess }: QrScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasScannedRef = useRef(false);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraState, setCameraState] = useState<'starting' | 'active' | 'error'>('starting');
  const [errorMessage, setErrorMessage] = useState('');
  const [scanFeedback, setScanFeedback] = useState('');
  const [whatsappInput, setWhatsappInput] = useState('');

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleDecoded = useCallback(
    (rawText: string) => {
      if (hasScannedRef.current) return;
      hasScannedRef.current = true;
      stopCamera();
      const parsed = parseQrPayload(rawText);
      onScanSuccess(parsed);
    },
    [onScanSuccess, stopCamera]
  );

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      hasScannedRef.current = false;
      setScanFeedback('');
      setWhatsappInput('');
      return;
    }

    let cancelled = false;
    hasScannedRef.current = false;
    setCameraState('starting');
    setErrorMessage('');
    setScanFeedback('');
    setWhatsappInput('');

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setCameraState('error');
          setErrorMessage('Camera access is not supported in this browser. You can upload a QR image below.');
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraState('active');

        let lastScanTime = 0;
        const scanLoop = (timestamp: number) => {
          if (cancelled || hasScannedRef.current) return;

          if (timestamp - lastScanTime >= 140) {
            lastScanTime = timestamp;
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
              const width = video.videoWidth;
              const height = video.videoHeight;
              if (width > 0 && height > 0) {
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                  ctx.drawImage(video, 0, 0, width, height);
                  const imageData = ctx.getImageData(0, 0, width, height);
                  const code = jsQR(imageData.data, width, height, {
                    inversionAttempts: 'dontInvert',
                  });
                  if (code?.data) {
                    handleDecoded(code.data);
                    return;
                  }
                }
              }
            }
          }

          rafRef.current = requestAnimationFrame(scanLoop);
        };

        rafRef.current = requestAnimationFrame(scanLoop);
      } catch {
        if (!cancelled) {
          setCameraState('error');
          setErrorMessage(
            'Camera permission was denied or no camera was detected. Upload a QR image or try a sample QR below.'
          );
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [facingMode, handleDecoded, isOpen, stopCamera]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setScanFeedback('');
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = canvasRef.current || document.createElement('canvas');
        const maxDim = 1024;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          setScanFeedback('Could not read the uploaded image.');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, width, height, { inversionAttempts: 'attemptBoth' });

        if (code?.data) {
          handleDecoded(code.data);
        } else {
          setScanFeedback('No QR code found in this image. Please try a clearer QR screenshot.');
        }
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setScanFeedback('Unable to load this image file.');
    };

    img.src = objectUrl;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-scanner-title"
        className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-slate-950 text-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#5F259F] flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="qr-scanner-title" className="text-base font-semibold leading-tight">
                Scan any QR
              </h2>
              <p className="text-xs text-white/65">UPI QR · Pay from bank account</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
              }
              aria-label="Switch camera"
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close QR scanner"
              className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Viewfinder */}
        <div className="mt-4 relative aspect-square w-full max-w-[300px] mx-auto rounded-2xl overflow-hidden bg-slate-900 border border-white/15 flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover ${
              cameraState === 'active' ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Corner Brackets Overlay */}
          {cameraState === 'active' && (
            <div className="absolute inset-8 pointer-events-none">
              <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-[#60A5FA] rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-[#60A5FA] rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-[#60A5FA] rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-[#60A5FA] rounded-br-xl" />
            </div>
          )}

          {cameraState === 'starting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <Camera className="w-8 h-8 text-white/60 mb-2" />
              <p className="text-xs text-white/75">Starting camera viewfinder…</p>
            </div>
          )}

          {cameraState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-8 h-8 text-amber-400 mb-2.5" />
              <p className="text-xs text-white/80 leading-relaxed">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Upload QR Image & Paste WhatsApp Link / Number */}
        <div className="mt-4 space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-11 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors"
          >
            <ImagePlus className="w-4 h-4" />
            <span>Upload QR (WhatsApp / Gallery)</span>
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!whatsappInput.trim()) return;
              handleDecoded(whatsappInput);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={whatsappInput}
              onChange={(e) => setWhatsappInput(e.target.value)}
              placeholder="Paste WhatsApp UPI link, ID, or number"
              aria-label="Paste WhatsApp UPI link, ID, or number"
              className="flex-1 h-11 px-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder:text-white/45 focus:outline-none focus:border-[#60A5FA]"
            />
            <button
              type="submit"
              disabled={!whatsappInput.trim()}
              className="h-11 px-4 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] disabled:opacity-40 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0"
            >
              Pay
            </button>
          </form>

          {scanFeedback && (
            <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-400/25 rounded-xl px-3 py-2 text-center">
              {scanFeedback}
            </p>
          )}
        </div>

        {/* Quick Sample QR Scans for Testing */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-xs font-medium text-white/65 mb-2.5">
            Or test with a sample merchant QR
          </p>
          <div className="space-y-2">
            {SAMPLE_QR_CODES.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handleDecoded(sample.payload)}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between gap-3 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#5F259F]/60 flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{sample.label}</p>
                    <p className="text-[11px] text-white/60 truncate">{sample.sub}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#93C5FD] whitespace-nowrap shrink-0">
                  Scan
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION: src/components/MobileRechargeModal.tsx
// ============================================================================

interface RechargeBankOption {
  id: string;
  bankName: string;
  shortCode: string;
  maskedNumber: string;
  balance: number;
}

interface MobileRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccounts: RechargeBankOption[];
  onRequestPin: (subtitle: string, onVerified: () => void) => void;
  onExecuteRecharge: (params: {
    mobileNumber: string;
    operatorName: string;
    planLabel: string;
    amount: number;
    bankId: string;
  }) => { remainingBalance: number; bankName: string; maskedNumber: string } | { error: string };
  onViewHistory: () => void;
}

type OperatorId = 'jio' | 'airtel' | 'vi' | 'bsnl';
type PlanCategory = 'all' | 'monthly' | 'three-month' | 'yearly' | '5g' | 'data';

interface RechargePlan {
  id: string;
  price: number;
  validity: string;
  data: string;
  benefits: string;
  category: Exclude<PlanCategory, 'all' | '5g'>;
  is5G?: boolean;
}

const OPERATORS: {
  id: OperatorId;
  name: string;
  short: string;
  colorClass: string;
}[] = [
  { id: 'jio', name: 'Jio', short: 'JIO', colorClass: 'bg-[#0A2885] text-white' },
  { id: 'airtel', name: 'Airtel', short: 'AIRTEL', colorClass: 'bg-[#E40000] text-white' },
  { id: 'vi', name: 'Vi', short: 'Vi', colorClass: 'bg-[#EE2737] text-white' },
  { id: 'bsnl', name: 'BSNL', short: 'BSNL', colorClass: 'bg-[#0072BC] text-white' },
];

const PLANS_BY_OPERATOR: Record<OperatorId, RechargePlan[]> = {
  jio: [
    {
      id: 'jio-350',
      price: 350,
      validity: '28 Days (1 Month)',
      data: '2 GB/day · Unlimited 5G',
      benefits: 'True 5G Unlimited Data · Unlimited Calls · 100 SMS/day',
      category: 'monthly',
      is5G: true,
    },
    {
      id: 'jio-299',
      price: 299,
      validity: '28 Days',
      data: '1.5 GB/day',
      benefits: 'Unlimited Calls · 100 SMS/day · JioTV',
      category: 'monthly',
    },
    {
      id: 'jio-859',
      price: 859,
      validity: '84 Days (3 Months)',
      data: '2 GB/day · Unlimited 5G',
      benefits: '3 Months True 5G Unlimited · Unlimited Calls',
      category: 'three-month',
      is5G: true,
    },
    {
      id: 'jio-999',
      price: 999,
      validity: '98 Days (3+ Months)',
      data: '2 GB/day · Unlimited 5G',
      benefits: 'True 5G Unlimited · JioCinema & JioTV',
      category: 'three-month',
      is5G: true,
    },
    {
      id: 'jio-3599',
      price: 3599,
      validity: '365 Days (1 Year)',
      data: '2.5 GB/day · Unlimited 5G',
      benefits: 'Full 1 Year Annual Pack · True 5G Unlimited',
      category: 'yearly',
      is5G: true,
    },
    {
      id: 'jio-19',
      price: 19,
      validity: '1 Day',
      data: '1 GB Data',
      benefits: 'High-speed Data Add-on Pack',
      category: 'data',
    },
    {
      id: 'jio-69',
      price: 69,
      validity: '7 Days',
      data: '6 GB Data',
      benefits: '4G/5G Data Booster Pack',
      category: 'data',
    },
  ],
  airtel: [
    {
      id: 'airtel-350',
      price: 350,
      validity: '28 Days (1 Month)',
      data: '2 GB/day · Unlimited 5G',
      benefits: 'Unlimited 5G Data · Unlimited Calls · Wynk Music',
      category: 'monthly',
      is5G: true,
    },
    {
      id: 'airtel-299',
      price: 299,
      validity: '28 Days',
      data: '1 GB/day',
      benefits: 'Unlimited Calls · 100 SMS/day',
      category: 'monthly',
    },
    {
      id: 'airtel-859',
      price: 859,
      validity: '84 Days (3 Months)',
      data: '1.5 GB/day · Unlimited 5G',
      benefits: '3 Months Unlimited 5G · Apollo 24|7 Circle',
      category: 'three-month',
      is5G: true,
    },
    {
      id: 'airtel-979',
      price: 979,
      validity: '84 Days (3 Months)',
      data: '2 GB/day · Unlimited 5G',
      benefits: '3 Months Unlimited 5G · Airtel Xstream Play',
      category: 'three-month',
      is5G: true,
    },
    {
      id: 'airtel-3599',
      price: 3599,
      validity: '365 Days (1 Year)',
      data: '2 GB/day · Unlimited 5G',
      benefits: 'Full 1 Year Annual Plan · Unlimited 5G Data',
      category: 'yearly',
      is5G: true,
    },
    {
      id: 'airtel-22',
      price: 22,
      validity: '1 Day',
      data: '1 GB Data',
      benefits: 'Data Top-up Pack',
      category: 'data',
    },
    {
      id: 'airtel-99',
      price: 99,
      validity: '2 Days',
      data: 'Unlimited Data',
      benefits: '20 GB FUP High Speed Data Pack',
      category: 'data',
    },
  ],
  vi: [
    {
      id: 'vi-350',
      price: 350,
      validity: '28 Days (1 Month)',
      data: '1.5 GB/day · Unlimited 5G',
      benefits: 'Binge All Night · Weekend Data Rollover',
      category: 'monthly',
      is5G: true,
    },
    {
      id: 'vi-299',
      price: 299,
      validity: '28 Days',
      data: '1 GB/day',
      benefits: 'Unlimited Calls · 100 SMS/day',
      category: 'monthly',
    },
    {
      id: 'vi-859',
      price: 859,
      validity: '84 Days (3 Months)',
      data: '1.5 GB/day · Unlimited 5G',
      benefits: '3 Months Pack · Weekend Rollover + Night Data',
      category: 'three-month',
      is5G: true,
    },
    {
      id: 'vi-3499',
      price: 3499,
      validity: '365 Days (1 Year)',
      data: '1.5 GB/day · Unlimited 5G',
      benefits: 'Full 1 Year Annual Pack · Binge All Night',
      category: 'yearly',
      is5G: true,
    },
    {
      id: 'vi-26',
      price: 26,
      validity: '1 Day',
      data: '1.5 GB Data',
      benefits: '4G/5G Data Voucher',
      category: 'data',
    },
  ],
  bsnl: [
    {
      id: 'bsnl-350',
      price: 350,
      validity: '30 Days (1 Month)',
      data: '2.5 GB/day · Unlimited',
      benefits: 'Unlimited Calls · Free National Roaming',
      category: 'monthly',
      is5G: true,
    },
    {
      id: 'bsnl-199',
      price: 199,
      validity: '30 Days',
      data: '2 GB/day',
      benefits: 'Unlimited Calls · 100 SMS/day',
      category: 'monthly',
    },
    {
      id: 'bsnl-599',
      price: 599,
      validity: '84 Days (3 Months)',
      data: '3 GB/day · Unlimited',
      benefits: '3 Months Heavy Data Pack · Zing Music',
      category: 'three-month',
      is5G: true,
    },
    {
      id: 'bsnl-2399',
      price: 2399,
      validity: '365 Days (1 Year)',
      data: '2 GB/day · Unlimited',
      benefits: 'Full 1 Year Annual Validity · 100 SMS/day',
      category: 'yearly',
      is5G: true,
    },
    {
      id: 'bsnl-16',
      price: 16,
      validity: '1 Day',
      data: '2 GB Data',
      benefits: 'Mini Data Pack',
      category: 'data',
    },
  ],
};

const CIRCLES = [
  'Karnataka',
  'Delhi NCR',
  'Maharashtra & Goa',
  'Mumbai',
  'UP East',
  'Bihar & Jharkhand',
  'Tamil Nadu',
];

function MobileRechargeModal({
  isOpen,
  onClose,
  bankAccounts,
  onRequestPin,
  onExecuteRecharge,
  onViewHistory,
}: MobileRechargeModalProps) {
  const [selectedOperator, setSelectedOperator] = useState<OperatorId>('jio');
  const [mobileNumber, setMobileNumber] = useState('');
  const [circle, setCircle] = useState('Karnataka');
  const [planFilter, setPlanFilter] = useState<PlanCategory>('all');
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan | null>(PLANS_BY_OPERATOR.jio[0]);
  const [selectedBankId, setSelectedBankId] = useState<string>(bankAccounts[0]?.id ?? '');
  const [errorMsg, setErrorMsg] = useState('');
  const [receipt, setReceipt] = useState<{
    mobileNumber: string;
    operatorName: string;
    planLabel: string;
    amount: number;
    bankName: string;
    maskedNumber: string;
    remainingBalance: number;
    refId: string;
  } | null>(null);

  if (!isOpen) return null;

  const cleanDigits = mobileNumber.replace(/\D/g, '');
  const hasValidMobile = cleanDigits.length === 10;

  const operatorMeta = OPERATORS.find((op) => op.id === selectedOperator) ?? OPERATORS[0];
  const plans = PLANS_BY_OPERATOR[selectedOperator].filter((p) => {
    if (planFilter === 'all') return true;
    if (planFilter === '5g') return Boolean(p.is5G);
    return p.category === planFilter;
  });

  const activeBankId = bankAccounts.some((b) => b.id === selectedBankId)
    ? selectedBankId
    : bankAccounts[0]?.id ?? '';

  const handleOperatorSwitch = (opId: OperatorId) => {
    setSelectedOperator(opId);
    setSelectedPlan(PLANS_BY_OPERATOR[opId][0]);
    setErrorMsg('');
  };

  const handleConfirmRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasValidMobile) {
      setErrorMsg('Please enter a valid 10-digit mobile number first.');
      return;
    }
    if (!selectedPlan) {
      setErrorMsg('Please select a recharge plan.');
      return;
    }

    const selectedBank = bankAccounts.find((b) => b.id === activeBankId);
    if (!selectedBank) {
      setErrorMsg('Please select a bank account.');
      return;
    }
    if (selectedPlan.price > selectedBank.balance) {
      setErrorMsg(
        `Insufficient balance in ${selectedBank.bankName} (${formatINR(selectedBank.balance)} available).`
      );
      return;
    }

    const planLabel = `${selectedPlan.data} · ${selectedPlan.validity}`;
    const chosenPlanPrice = selectedPlan.price;
    const chosenOpName = operatorMeta.name;

    onRequestPin(`Pay ₹${chosenPlanPrice} · ${chosenOpName} (+91 ${cleanDigits})`, () => {
      const result = onExecuteRecharge({
        mobileNumber: cleanDigits,
        operatorName: chosenOpName,
        planLabel,
        amount: chosenPlanPrice,
        bankId: activeBankId,
      });

      if ('error' in result) {
        setErrorMsg(result.error);
        return;
      }

      setErrorMsg('');
      setReceipt({
        mobileNumber: cleanDigits,
        operatorName: chosenOpName,
        planLabel,
        amount: chosenPlanPrice,
        bankName: result.bankName,
        maskedNumber: result.maskedNumber,
        remainingBalance: result.remainingBalance,
        refId: `RCH-${String(Date.now()).slice(-6)}`,
      });
    });
  };

  const resetAndClose = () => {
    setReceipt(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={resetAndClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recharge-modal-title"
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {!receipt ? (
          <form onSubmit={handleConfirmRecharge} className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Prepaid SIM Recharge · Demo Mode</p>
                  <h3 id="recharge-modal-title" className="text-base font-semibold text-slate-900">
                    Mobile Recharge
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close mobile recharge"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Number & Circle */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-7">
                <label
                  htmlFor="recharge-mobile-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Enter 10-Digit Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-numeric font-medium text-slate-500">
                    +91
                  </span>
                  <input
                    id="recharge-mobile-input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                      setErrorMsg('');
                    }}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full h-11 pl-11 pr-3 rounded-xl border border-slate-200 text-sm font-numeric font-medium text-slate-900 focus:outline-none focus:border-[#5F259F]"
                  />
                </div>
              </div>

              <div className="sm:col-span-5">
                <label
                  htmlFor="recharge-circle-select"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Circle
                </label>
                <select
                  id="recharge-circle-select"
                  value={circle}
                  onChange={(e) => setCircle(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-[#5F259F]"
                >
                  {CIRCLES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Operator Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Select SIM Operator
              </label>
              <div className="grid grid-cols-4 gap-2">
                {OPERATORS.map((op) => {
                  const isActive = selectedOperator === op.id;
                  return (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => handleOperatorSwitch(op.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all min-h-[44px] ${
                        isActive
                          ? 'border-[#5F259F] bg-purple-50/60'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold tracking-tight ${op.colorClass}`}
                      >
                        {op.short}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">{op.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {!hasValidMobile ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs font-medium text-slate-700">
                  Enter a valid 10-digit mobile number above to view {operatorMeta.name} ₹350, 3
                  Months, 1 Year, and Unlimited 5G recharge plans.
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-numeric">
                  {cleanDigits.length} / 10 digits entered
                </p>
              </div>
            ) : (
              <>
                {/* Plan Category Tabs */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-700">
                      {operatorMeta.name} Plans ({circle})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto mb-2.5">
                    {(
                      [
                        { key: 'all', label: 'All' },
                        { key: 'monthly', label: '₹350 / 1M' },
                        { key: 'three-month', label: '3 Months' },
                        { key: 'yearly', label: '1 Year' },
                        { key: '5g', label: 'Unlimited 5G' },
                        { key: 'data', label: 'Data' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setPlanFilter(tab.key)}
                        className={`px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                          planFilter === tab.key
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Plans List */}
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-0.5">
                    {plans.map((plan) => {
                      const isSelected = selectedPlan?.id === plan.id;
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setErrorMsg('');
                          }}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors ${
                            isSelected
                              ? 'border-[#5F259F] bg-purple-50/50'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-900">
                              <span>{plan.data}</span>
                              <span aria-hidden="true" className="text-slate-400">
                                ·
                              </span>
                              <span>{plan.validity}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {plan.benefits}
                            </p>
                          </div>
                          <span className="font-numeric text-sm font-bold text-[#5F259F] shrink-0">
                            ₹{plan.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bank Account Selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Pay From Bank Account
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {bankAccounts.map((bank) => {
                      const isSelected = activeBankId === bank.id;
                      return (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => {
                            setSelectedBankId(bank.id);
                            setErrorMsg('');
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors ${
                            isSelected
                              ? 'border-[#5F259F] bg-purple-50/50'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <BankLogo shortCode={bank.shortCode} size="sm" />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate">
                                {bank.shortCode}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">
                                {bank.maskedNumber}
                              </p>
                            </div>
                          </div>
                          <span className="font-numeric text-xs font-semibold text-slate-900 shrink-0">
                            {formatINR(bank.balance)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {errorMsg && (
              <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={!hasValidMobile || !selectedPlan}
              className="w-full h-12 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] disabled:opacity-45 active:scale-[0.99] text-white text-sm font-semibold transition-all"
            >
              {hasValidMobile && selectedPlan
                ? `Simulate Recharge ₹${selectedPlan.price} (${operatorMeta.name})`
                : 'Enter 10-Digit Number to Recharge'}
            </button>
          </form>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Simulated Demo Recharge · {receipt.refId}
            </p>
            <h3
              id="recharge-modal-title"
              className="mt-1 font-numeric text-2xl font-bold text-slate-900"
            >
              {formatINR(receipt.amount)}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {receipt.operatorName} · +91 {receipt.mobileNumber}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{receipt.planLabel}</p>

            <div className="mt-5 rounded-xl border border-slate-200 divide-y divide-slate-100 text-left text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">Debited Account</span>
                <span className="font-medium text-slate-900">
                  {receipt.bankName} {receipt.maskedNumber}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">Remaining Balance</span>
                <span className="font-numeric font-semibold text-slate-900">
                  {formatINR(receipt.remainingBalance)}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">Ledger Status</span>
                <span className="font-medium text-emerald-700">Saved to History</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  onClose();
                  onViewHistory();
                }}
                className="h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                View History
              </button>
              <button
                type="button"
                onClick={resetAndClose}
                className="h-11 rounded-xl bg-[#5F259F] text-white text-sm font-semibold hover:bg-[#4B1C80]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SECTION: src/components/InsuranceHub.tsx
// ============================================================================

type InsuranceTypeId = 'bike' | 'car' | 'health' | 'life';

interface DemoPolicy {
  id: string;
  policyNumber: string;
  type: InsuranceTypeId;
  title: string;
  holderOrVehicle: string;
  planName: string;
  coverAmount: string;
  premium: number;
  validUntil: string;
  bankLabel: string;
}

interface InsuranceBankOption {
  id: string;
  bankName: string;
  shortCode: string;
  maskedNumber: string;
  balance: number;
}

interface InsurancePlanOption {
  id: string;
  name: string;
  cover: string;
  premium: number;
  details: string;
}

interface InsuranceProductMeta {
  id: InsuranceTypeId;
  title: string;
  subtitle: string;
  startingAt: string;
  inputLabel: string;
  inputPlaceholder: string;
  icon: React.ComponentType<{ className?: string }>;
  tintClass: string;
  plans: InsurancePlanOption[];
}

const INSURANCE_PRODUCTS: InsuranceProductMeta[] = [
  {
    id: 'bike',
    title: 'Bike & Scooter',
    subtitle: 'Instant 2-wheeler policy · Cashless garages',
    startingAt: 'From ₹499/yr',
    inputLabel: 'Vehicle Registration Number *',
    inputPlaceholder: 'e.g. KA01AB1234',
    icon: Bike,
    tintClass: 'bg-purple-50 text-[#5F259F]',
    plans: [
      {
        id: 'bike-tp',
        name: 'Third-Party Liability',
        cover: 'Mandatory Legal Cover',
        premium: 499,
        details: 'Covers third-party injury & property damage · 1 Year',
      },
      {
        id: 'bike-comp',
        name: 'Comprehensive Shield',
        cover: 'IDV ₹75,000',
        premium: 1199,
        details: 'Own damage + theft + fire + third-party · 1 Year',
      },
      {
        id: 'bike-zd',
        name: 'Zero-Depreciation Pro',
        cover: 'IDV ₹95,000',
        premium: 1649,
        details: '100% parts replacement + roadside assistance · 1 Year',
      },
    ],
  },
  {
    id: 'car',
    title: 'Car Insurance',
    subtitle: 'Own damage & zero-dep · 5,400+ garages',
    startingAt: 'From ₹2,499/yr',
    inputLabel: 'Car Registration Number *',
    inputPlaceholder: 'e.g. MH02CD5678',
    icon: Car,
    tintClass: 'bg-sky-50 text-sky-700',
    plans: [
      {
        id: 'car-tp',
        name: 'Third-Party Car Cover',
        cover: 'Legal Liability Cover',
        premium: 2499,
        details: 'Mandatory motor third-party protection · 1 Year',
      },
      {
        id: 'car-comp',
        name: 'Comprehensive Protect',
        cover: 'IDV ₹5.5 Lakh',
        premium: 5499,
        details: 'Accident, theft, natural calamity + PA cover · 1 Year',
      },
      {
        id: 'car-zd',
        name: 'Zero-Dep + Engine Protect',
        cover: 'IDV ₹7.2 Lakh',
        premium: 7299,
        details: 'Zero depreciation + hydrostatic lock & towing · 1 Year',
      },
    ],
  },
  {
    id: 'health',
    title: 'Health Insurance',
    subtitle: 'Cashless hospitalization · Tax benefit',
    startingAt: 'From ₹5,900/yr',
    inputLabel: 'Insured Member Name & Age *',
    inputPlaceholder: 'e.g. Aarav Mehta, 28 yrs',
    icon: HeartPulse,
    tintClass: 'bg-rose-50 text-rose-700',
    plans: [
      {
        id: 'health-5l',
        name: 'Individual Care 5L',
        cover: '₹5 Lakh Cover',
        premium: 5900,
        details: '10,000+ cashless hospitals · Pre & post hospitalization',
      },
      {
        id: 'health-10l',
        name: 'Family Floater 10L',
        cover: '₹10 Lakh Cover',
        premium: 9800,
        details: 'Covers 2 Adults + Kids · Annual health checkup included',
      },
      {
        id: 'health-20l',
        name: 'Super Shield 20L',
        cover: '₹20 Lakh Cover',
        premium: 14500,
        details: 'No room-rent cap + 100% restoration benefit',
      },
    ],
  },
  {
    id: 'life',
    title: 'Term Life Cover',
    subtitle: 'High life cover · Nominee protection',
    startingAt: 'From ₹4,800/yr',
    inputLabel: 'Proposer & Nominee Name *',
    inputPlaceholder: 'e.g. Aarav Mehta · Nominee: Riya',
    icon: Umbrella,
    tintClass: 'bg-emerald-50 text-emerald-700',
    plans: [
      {
        id: 'life-50l',
        name: 'Pure Term 50L',
        cover: '₹50 Lakh Cover',
        premium: 4800,
        details: 'Annual premium · Critical illness rider optional',
      },
      {
        id: 'life-1cr',
        name: 'Term Secure 1 Crore',
        cover: '₹1 Crore Cover',
        premium: 8400,
        details: 'Annual premium · Accidental death benefit included',
      },
    ],
  },
];

const INITIAL_DEMO_POLICIES: DemoPolicy[] = [
  {
    id: 'pol-demo-1',
    policyNumber: 'PPE-842109',
    type: 'bike',
    title: 'Bike & Scooter',
    holderOrVehicle: 'KA01AB4821 · Honda Activa 6G',
    planName: 'Comprehensive Shield',
    coverAmount: 'IDV ₹75,000',
    premium: 1199,
    validUntil: '23 Nov 2027',
    bankLabel: 'HDFC Bank •• 4821',
  },
  {
    id: 'pol-demo-2',
    policyNumber: 'PPE-519044',
    type: 'health',
    title: 'Health Insurance',
    holderOrVehicle: 'Aarav Mehta · Family Care',
    planName: 'Individual Care 5L',
    coverAmount: '₹5 Lakh Cover',
    premium: 5900,
    validUntil: '15 Oct 2027',
    bankLabel: 'ICICI Bank •• 3376',
  },
];

interface InsuranceHubSectionProps {
  policies: DemoPolicy[];
  onSelectProduct: (type: InsuranceTypeId) => void;
}

function InsuranceHubSection({ policies, onSelectProduct }: InsuranceHubSectionProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<DemoPolicy | null>(null);
  const [claimReason, setClaimReason] = useState('');
  const [claimSubmittedId, setClaimSubmittedId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Banner */}
      <section className="rounded-2xl bg-gradient-to-br from-[#5F259F] via-[#45137D] to-[#260747] text-white p-5 shadow-md flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-white/75">Insurance Hub · Demo Mode</p>
          <h1 className="mt-1 text-lg sm:text-xl font-semibold tracking-tight">
            Protect Bike, Car, Health &amp; Life
          </h1>
          <p className="mt-1 text-xs text-white/80">
            Select a plan, pay premium from any bank account, and manage your policies.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
      </section>

      {/* Insurance Product Grid */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">Buy or Renew Insurance</h2>
          <span className="text-xs text-slate-500">Instant Demo Policy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INSURANCE_PRODUCTS.map((product) => {
            const Icon = product.icon;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => onSelectProduct(product.id)}
                className="p-4 rounded-xl border border-slate-200/90 hover:border-[#5F259F]/50 hover:bg-slate-50/70 text-left flex items-start gap-3.5 transition-all active:scale-[0.99]"
              >
                <span
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${product.tintClass}`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{product.title}</p>
                    <span className="text-xs font-semibold text-[#5F259F] whitespace-nowrap shrink-0">
                      {product.startingAt}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{product.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Demo Policies */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">My Active Policies</h2>
          <span className="text-xs text-slate-500 font-numeric">{policies.length} active</span>
        </div>

        {policies.length === 0 ? (
          <div className="py-6 text-center">
            <FileText className="w-7 h-7 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              No active demo policies yet. Choose any category above to issue one.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {policies.map((policy) => (
              <button
                key={policy.id}
                type="button"
                onClick={() => {
                  setSelectedPolicy(policy);
                  setClaimReason('');
                  setClaimSubmittedId(null);
                }}
                className="w-full py-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 rounded-xl px-2 -mx-2 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {policy.title} · {policy.planName}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {policy.holderOrVehicle} · {policy.coverAmount} · Policy #{policy.policyNumber}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    Active (Demo) · Valid till {policy.validUntil}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-numeric text-sm font-semibold text-slate-900 block">
                    {formatINR(policy.premium)}
                  </span>
                  <span className="text-[11px] font-medium text-[#5F259F]">View Policy</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Policy Certificate & Demo Claim Sheet */}
      {selectedPolicy && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedPolicy(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-detail-title"
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  PhonePe General Insurance (Demo) · #{selectedPolicy.policyNumber}
                </p>
                <h3 id="policy-detail-title" className="text-base font-semibold text-slate-900">
                  {selectedPolicy.title} · {selectedPolicy.planName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPolicy(null)}
                aria-label="Close policy details"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-3 flex items-center justify-between gap-3">
                <span className="text-slate-500">Insured / Vehicle</span>
                <span className="font-medium text-slate-900 text-right">
                  {selectedPolicy.holderOrVehicle}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between gap-3">
                <span className="text-slate-500">Sum Insured / Cover</span>
                <span className="font-semibold text-slate-900">{selectedPolicy.coverAmount}</span>
              </div>
              <div className="p-3 flex items-center justify-between gap-3">
                <span className="text-slate-500">Valid Until</span>
                <span className="font-medium text-emerald-700">{selectedPolicy.validUntil}</span>
              </div>
              <div className="p-3 flex items-center justify-between gap-3">
                <span className="text-slate-500">Paid From</span>
                <span className="font-medium text-slate-900">{selectedPolicy.bankLabel}</span>
              </div>
            </div>

            {claimSubmittedId === selectedPolicy.id ? (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                Demo claim request registered for policy #{selectedPolicy.policyNumber}. Our demo
                support team will review your reference ID.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!claimReason.trim()) return;
                  setClaimSubmittedId(selectedPolicy.id);
                }}
                className="mt-4 space-y-2.5"
              >
                <label
                  htmlFor="demo-claim-reason"
                  className="block text-xs font-medium text-slate-700"
                >
                  Request Demo Claim / Support
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="demo-claim-reason"
                    type="text"
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    placeholder="e.g. Cashless garage or hospital claim"
                    className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F259F]"
                  />
                  <button
                    type="submit"
                    disabled={!claimReason.trim()}
                    className="h-10 px-3.5 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] disabled:opacity-45 text-white text-xs font-semibold whitespace-nowrap"
                  >
                    File Claim
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface InsuranceQuoteModalProps {
  activeType: InsuranceTypeId | null;
  onClose: () => void;
  bankAccounts: InsuranceBankOption[];
  onRequestPin: (subtitle: string, onVerified: () => void) => void;
  onPurchasePolicy: (params: {
    type: InsuranceTypeId;
    title: string;
    holderOrVehicle: string;
    planName: string;
    coverAmount: string;
    premium: number;
    bankId: string;
  }) => { policy: DemoPolicy; remainingBalance: number } | { error: string };
  onViewHistory: () => void;
}

function InsuranceQuoteModal({
  activeType,
  onClose,
  bankAccounts,
  onRequestPin,
  onPurchasePolicy,
  onViewHistory,
}: InsuranceQuoteModalProps) {
  const product = INSURANCE_PRODUCTS.find((p) => p.id === activeType) ?? null;

  const [holderInput, setHolderInput] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedBankId, setSelectedBankId] = useState<string>(bankAccounts[0]?.id ?? '');
  const [errorMsg, setErrorMsg] = useState('');
  const [issuedResult, setIssuedResult] = useState<{
    policy: DemoPolicy;
    remainingBalance: number;
  } | null>(null);

  if (!product) return null;

  const currentPlan =
    product.plans.find((p) => p.id === selectedPlanId) ?? product.plans[0];
  const activeBankId = bankAccounts.some((b) => b.id === selectedBankId)
    ? selectedBankId
    : bankAccounts[0]?.id ?? '';

  const handleClose = () => {
    setHolderInput('');
    setSelectedPlanId('');
    setErrorMsg('');
    setIssuedResult(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedHolder = holderInput.trim();
    if (!cleanedHolder) {
      setErrorMsg(`Please enter ${product.inputLabel.replace('*', '').trim().toLowerCase()}.`);
      return;
    }

    const selectedBank = bankAccounts.find((b) => b.id === activeBankId);
    if (!selectedBank) {
      setErrorMsg('Please select a bank account.');
      return;
    }
    if (currentPlan.premium > selectedBank.balance) {
      setErrorMsg(
        `Insufficient balance in ${selectedBank.bankName} (${formatINR(selectedBank.balance)} available).`
      );
      return;
    }

    onRequestPin(`Pay ₹${currentPlan.premium.toLocaleString('en-IN')} · ${product.title}`, () => {
      const res = onPurchasePolicy({
        type: product.id,
        title: product.title,
        holderOrVehicle: cleanedHolder,
        planName: currentPlan.name,
        coverAmount: currentPlan.cover,
        premium: currentPlan.premium,
        bankId: activeBankId,
      });

      if ('error' in res) {
        setErrorMsg(res.error);
        return;
      }

      setErrorMsg('');
      setIssuedResult(res);
    });
  };

  const Icon = product.icon;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="insurance-modal-title"
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {!issuedResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${product.tintClass}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Insurance Quote · Demo Mode</p>
                  <h3 id="insurance-modal-title" className="text-base font-semibold text-slate-900">
                    {product.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close insurance modal"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label
                htmlFor="insurance-holder-input"
                className="block text-xs font-medium text-slate-700 mb-1"
              >
                {product.inputLabel}
              </label>
              <input
                id="insurance-holder-input"
                type="text"
                value={holderInput}
                onChange={(e) => {
                  setHolderInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder={product.inputPlaceholder}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#5F259F]"
              />
            </div>

            {/* Plan Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Select Coverage Plan
              </label>
              <div className="space-y-2">
                {product.plans.map((plan) => {
                  const isSelected = currentPlan.id === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        setErrorMsg('');
                      }}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors ${
                        isSelected
                          ? 'border-[#5F259F] bg-purple-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900">
                          {plan.name} · {plan.cover}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{plan.details}</p>
                      </div>
                      <span className="font-numeric text-sm font-bold text-[#5F259F] shrink-0">
                        ₹{plan.premium.toLocaleString('en-IN')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bank Account Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Pay Premium From Bank Account
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bankAccounts.map((bank) => {
                  const isSelected = activeBankId === bank.id;
                  return (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => {
                        setSelectedBankId(bank.id);
                        setErrorMsg('');
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors ${
                        isSelected
                          ? 'border-[#5F259F] bg-purple-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <BankLogo shortCode={bank.shortCode} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {bank.shortCode}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{bank.maskedNumber}</p>
                        </div>
                      </div>
                      <span className="font-numeric text-xs font-semibold text-slate-900 shrink-0">
                        {formatINR(bank.balance)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] active:scale-[0.99] text-white text-sm font-semibold transition-all"
            >
              Issue Demo Policy · Pay ₹{currentPlan.premium.toLocaleString('en-IN')}
            </button>
          </form>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Demo Policy Issued · #{issuedResult.policy.policyNumber}
            </p>
            <h3
              id="insurance-modal-title"
              className="mt-1 font-numeric text-2xl font-bold text-slate-900"
            >
              {formatINR(issuedResult.policy.premium)}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {issuedResult.policy.title} · {issuedResult.policy.planName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {issuedResult.policy.holderOrVehicle} · {issuedResult.policy.coverAmount}
            </p>

            <div className="mt-5 rounded-xl border border-slate-200 divide-y divide-slate-100 text-left text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">Valid Until</span>
                <span className="font-medium text-slate-900">{issuedResult.policy.validUntil}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">Debited Account</span>
                <span className="font-medium text-slate-900">{issuedResult.policy.bankLabel}</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">Remaining Balance</span>
                <span className="font-numeric font-semibold text-slate-900">
                  {formatINR(issuedResult.remainingBalance)}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onViewHistory();
                }}
                className="h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                View History
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="h-11 rounded-xl bg-[#5F259F] text-white text-sm font-semibold hover:bg-[#4B1C80]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SECTION: src/components/CreditLoanModal.tsx
// ============================================================================

type CreditLoanMode = 'credit-card' | 'gold-loan' | 'personal-loan' | 'credit-score';

interface CreditLoanBankOption {
  id: string;
  bankName: string;
  shortCode: string;
  maskedNumber: string;
  balance: number;
}

interface CreditLoanModalProps {
  mode: CreditLoanMode | null;
  onClose: () => void;
  defaultName: string;
  defaultMobile: string;
  bankAccounts: CreditLoanBankOption[];
  onRequestPin: (subtitle: string, onVerified: () => void) => void;
  onDisburseLoan: (params: {
    title: string;
    category: string;
    amount: number;
    bankId: string;
  }) => { newBalance: number; bankName: string; maskedNumber: string } | { error: string };
  onViewHistory: () => void;
}

const CREDIT_CARDS = [
  {
    id: 'rupay-upi',
    name: 'PhonePe RuPay UPI Card',
    fee: 'Lifetime Free',
    limit: '₹85,000',
    perks: 'Scan & Pay on UPI · 1.5% reward points on merchant QR',
  },
  {
    id: 'cashback-select',
    name: 'PhonePe Cashback Select',
    fee: '₹499/yr (waived at ₹1L)',
    limit: '₹1,50,000',
    perks: '5% cashback on bills & recharges · 2% on online spends',
  },
  {
    id: 'travel-miles',
    name: 'PhonePe Travel Miles',
    fee: '₹1,499/yr',
    limit: '₹2,50,000',
    perks: '4 domestic lounge visits/yr · Zero forex markup on demo trips',
  },
];

const GOLD_RATE_PER_GRAM: Record<'24K' | '22K' | '18K', number> = {
  '24K': 7200,
  '22K': 6600,
  '18K': 5400,
};

function CreditLoanModal({
  mode,
  onClose,
  defaultName,
  defaultMobile,
  bankAccounts,
  onRequestPin,
  onDisburseLoan,
  onViewHistory,
}: CreditLoanModalProps) {
  // Credit Card state
  const [selectedCardId, setSelectedCardId] = useState(CREDIT_CARDS[0].id);
  const [applicantName, setApplicantName] = useState(defaultName);
  const [applicantMobile, setApplicantMobile] = useState(defaultMobile);
  const [monthlyIncome, setMonthlyIncome] = useState('45000');
  const [employmentType, setEmploymentType] = useState<'Salaried' | 'Self-Employed'>('Salaried');
  const [cardApproved, setCardApproved] = useState<{
    cardName: string;
    limit: string;
    refId: string;
  } | null>(null);

  // Gold Loan state
  const [goldGrams, setGoldGrams] = useState('20');
  const [goldPurity, setGoldPurity] = useState<'24K' | '22K' | '18K'>('22K');
  const [goldTenure, setGoldTenure] = useState<6 | 12 | 24>(12);

  // Personal Loan state
  const [personalAmount, setPersonalAmount] = useState(50000);
  const [personalTenure, setPersonalTenure] = useState<12 | 24 | 36>(12);
  const [loanPurpose, setLoanPurpose] = useState('Personal / Home');

  // Shared bank & completion state
  const [selectedBankId, setSelectedBankId] = useState(bankAccounts[0]?.id ?? '');
  const [errorMsg, setErrorMsg] = useState('');
  const [loanResult, setLoanResult] = useState<{
    title: string;
    amount: number;
    bankName: string;
    maskedNumber: string;
    newBalance: number;
    refId: string;
  } | null>(null);

  React.useEffect(() => {
    if (mode) {
      setApplicantName(defaultName);
      setApplicantMobile(defaultMobile);
      setErrorMsg('');
    }
  }, [mode, defaultName, defaultMobile]);

  if (!mode) return null;

  const activeBankId = bankAccounts.some((b) => b.id === selectedBankId)
    ? selectedBankId
    : bankAccounts[0]?.id ?? '';

  const gramsNum = Math.max(0, Number(goldGrams) || 0);
  const eligibleGoldAmount = Math.round(gramsNum * GOLD_RATE_PER_GRAM[goldPurity] * 0.75);
  const goldMonthlyEmi = Math.round((eligibleGoldAmount * 1.095) / goldTenure);

  const personalMonthlyEmi = Math.round((personalAmount * 1.13) / personalTenure);

  const handleClose = () => {
    setErrorMsg('');
    setCardApproved(null);
    setLoanResult(null);
    onClose();
  };

  const handleApplyCreditCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = applicantMobile.replace(/\D/g, '');
    if (!applicantName.trim()) {
      setErrorMsg('Please enter applicant full name.');
      return;
    }
    if (cleanMobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!monthlyIncome || Number(monthlyIncome) < 10000) {
      setErrorMsg('Minimum demo monthly income should be ₹10,000.');
      return;
    }

    const card = CREDIT_CARDS.find((c) => c.id === selectedCardId) ?? CREDIT_CARDS[0];
    onRequestPin(`Confirm Credit Card Application (${card.name})`, () => {
      setErrorMsg('');
      setCardApproved({
        cardName: card.name,
        limit: card.limit,
        refId: `CC-${String(Date.now()).slice(-6)}`,
      });
    });
  };

  const handleApplyGoldLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (gramsNum < 2) {
      setErrorMsg('Enter at least 2 grams of gold weight.');
      return;
    }

    const title = `Gold Loan (${gramsNum}g ${goldPurity})`;
    onRequestPin(`Disburse ${formatINR(eligibleGoldAmount)} Gold Loan`, () => {
      const res = onDisburseLoan({
        title,
        category: `Gold Loan · ${goldTenure}M`,
        amount: eligibleGoldAmount,
        bankId: activeBankId,
      });
      if ('error' in res) {
        setErrorMsg(res.error);
        return;
      }
      setErrorMsg('');
      setLoanResult({
        title,
        amount: eligibleGoldAmount,
        bankName: res.bankName,
        maskedNumber: res.maskedNumber,
        newBalance: res.newBalance,
        refId: `GL-${String(Date.now()).slice(-6)}`,
      });
    });
  };

  const handleApplyPersonalLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const title = `Personal Loan (${loanPurpose})`;
    onRequestPin(`Disburse ${formatINR(personalAmount)} Loan`, () => {
      const res = onDisburseLoan({
        title,
        category: `Personal Loan · ${personalTenure}M`,
        amount: personalAmount,
        bankId: activeBankId,
      });
      if ('error' in res) {
        setErrorMsg(res.error);
        return;
      }
      setErrorMsg('');
      setLoanResult({
        title,
        amount: personalAmount,
        bankName: res.bankName,
        maskedNumber: res.maskedNumber,
        newBalance: res.newBalance,
        refId: `PL-${String(Date.now()).slice(-6)}`,
      });
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="credit-loan-title"
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* 1. CREDIT CARD APPLICATION */}
        {mode === 'credit-card' &&
          (!cardApproved ? (
            <form onSubmit={handleApplyCreditCard} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Credit Facility · Demo Mode</p>
                    <h3 id="credit-loan-title" className="text-base font-semibold text-slate-900">
                      Apply for Credit Card
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close credit card modal"
                  className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">
                  Choose Card Variant
                </label>
                {CREDIT_CARDS.map((card) => {
                  const isSelected = selectedCardId === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedCardId(card.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-colors ${
                        isSelected
                          ? 'border-[#5F259F] bg-purple-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900">{card.name}</span>
                        <span className="text-xs font-numeric font-semibold text-[#5F259F]">
                          Limit {card.limit}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {card.fee} · {card.perks}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#5F259F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={applicantMobile}
                    onChange={(e) => setApplicantMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-numeric focus:outline-none focus:border-[#5F259F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-numeric focus:outline-none focus:border-[#5F259F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Employment
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) =>
                      setEmploymentType(e.target.value as 'Salaried' | 'Self-Employed')
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#5F259F]"
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] text-white text-sm font-semibold transition-colors"
              >
                Verify PIN &amp; Submit Application
              </button>
            </form>
          ) : (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Demo Application Submitted · {cardApproved.refId}
              </p>
              <h3 id="credit-loan-title" className="mt-1 text-lg font-bold text-slate-900">
                {cardApproved.cardName}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Pre-Approved Demo Limit: <strong className="font-numeric">{cardApproved.limit}</strong>
              </p>
              <div className="mt-4 rounded-xl bg-gradient-to-br from-[#2E0F54] via-[#45137D] to-[#21073E] text-white p-4 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-white/75">PhonePe Virtual Demo Card</p>
                  <PhonePeLogo size="sm" />
                </div>
                <p className="mt-3 font-numeric text-base tracking-widest">
                  •••• •••• •••• 7420
                </p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span>{applicantName}</span>
                  <span className="font-numeric">EXP 11/30</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-5 w-full h-11 rounded-xl bg-[#5F259F] text-white text-sm font-semibold hover:bg-[#4B1C80]"
              >
                Done
              </button>
            </div>
          ))}

        {/* 2. GOLD LOAN */}
        {mode === 'gold-loan' &&
          (!loanResult ? (
            <form onSubmit={handleApplyGoldLoan} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Secured Credit · Demo Mode</p>
                    <h3 id="credit-loan-title" className="text-base font-semibold text-slate-900">
                      Instant Gold Loan
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close gold loan modal"
                  className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gold Weight (Grams)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="1000"
                    value={goldGrams}
                    onChange={(e) => {
                      setGoldGrams(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm font-numeric font-semibold focus:outline-none focus:border-[#5F259F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Purity</label>
                  <select
                    value={goldPurity}
                    onChange={(e) => setGoldPurity(e.target.value as '24K' | '22K' | '18K')}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#5F259F]"
                  >
                    <option value="24K">24K (99.9%)</option>
                    <option value="22K">22K (91.6%)</option>
                    <option value="18K">18K (75.0%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Tenure</label>
                <div className="grid grid-cols-3 gap-2">
                  {([6, 12, 24] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setGoldTenure(m)}
                      className={`h-10 rounded-xl border text-xs font-medium transition-colors ${
                        goldTenure === m
                          ? 'border-[#5F259F] bg-purple-50 text-[#5F259F] font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-600">Eligible Demo Loan (75% LTV)</p>
                  <p className="font-numeric text-xl font-bold text-slate-900">
                    {formatINR(eligibleGoldAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600">Est. EMI</p>
                  <p className="font-numeric text-sm font-semibold text-amber-800">
                    {formatINR(goldMonthlyEmi)}/mo
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Disburse To Bank Account
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bankAccounts.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBankId(bank.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors ${
                        activeBankId === bank.id
                          ? 'border-[#5F259F] bg-purple-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <BankLogo shortCode={bank.shortCode} size="sm" />
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {bank.shortCode} {bank.maskedNumber}
                        </span>
                      </div>
                      <span className="font-numeric text-[11px] font-semibold text-slate-700 shrink-0">
                        {formatINR(bank.balance)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] text-white text-sm font-semibold transition-colors"
              >
                Verify PIN &amp; Disburse {formatINR(eligibleGoldAmount)}
              </button>
            </form>
          ) : (
            <LoanSuccessView
              result={loanResult}
              onViewHistory={() => {
                handleClose();
                onViewHistory();
              }}
              onDone={handleClose}
            />
          ))}

        {/* 3. PERSONAL LOAN */}
        {mode === 'personal-loan' &&
          (!loanResult ? (
            <form onSubmit={handleApplyPersonalLoan} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <BadgeIndianRupee className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Instant Credit · Demo Mode</p>
                    <h3 id="credit-loan-title" className="text-base font-semibold text-slate-900">
                      Instant Personal Loan
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close personal loan modal"
                  className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Select Loan Amount
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[25000, 50000, 100000, 200000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPersonalAmount(amt)}
                      className={`h-10 rounded-xl border font-numeric text-xs font-semibold transition-colors ${
                        personalAmount === amt
                          ? 'border-[#5F259F] bg-purple-50 text-[#5F259F]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      ₹{(amt / 1000).toFixed(0)}K
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tenure</label>
                  <select
                    value={personalTenure}
                    onChange={(e) => setPersonalTenure(Number(e.target.value) as 12 | 24 | 36)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#5F259F]"
                  >
                    <option value={12}>12 Months</option>
                    <option value={24}>24 Months</option>
                    <option value={36}>36 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Purpose</label>
                  <select
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#5F259F]"
                  >
                    <option value="Personal / Home">Personal / Home</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Business / Shop">Business / Shop</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl bg-purple-50/70 border border-purple-200/80 p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600">Demo Disbursement</p>
                  <p className="font-numeric text-xl font-bold text-slate-900">
                    {formatINR(personalAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600">Est. Monthly EMI</p>
                  <p className="font-numeric text-sm font-semibold text-[#5F259F]">
                    {formatINR(personalMonthlyEmi)}/mo
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Credit To Bank Account
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bankAccounts.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBankId(bank.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors ${
                        activeBankId === bank.id
                          ? 'border-[#5F259F] bg-purple-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <BankLogo shortCode={bank.shortCode} size="sm" />
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {bank.shortCode} {bank.maskedNumber}
                        </span>
                      </div>
                      <span className="font-numeric text-[11px] font-semibold text-slate-700 shrink-0">
                        {formatINR(bank.balance)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] text-white text-sm font-semibold transition-colors"
              >
                Verify PIN &amp; Credit {formatINR(personalAmount)}
              </button>
            </form>
          ) : (
            <LoanSuccessView
              result={loanResult}
              onViewHistory={() => {
                handleClose();
                onViewHistory();
              }}
              onDone={handleClose}
            />
          ))}

        {/* 4. FREE CREDIT SCORE */}
        {mode === 'credit-score' && (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center shrink-0">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Credit Report · Demo Mode</p>
                  <h3 id="credit-loan-title" className="text-base font-semibold text-slate-900">
                    Your Credit Score
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close credit score modal"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#5F259F] to-[#2A0E4E] text-white p-5 text-center">
              <p className="text-xs text-white/75">Simulated Bureau Score for {defaultName}</p>
              <p className="mt-2 font-numeric text-4xl font-bold">784</p>
              <p className="text-xs text-emerald-300 font-medium mt-1">
                Excellent · Out of 900
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">On-Time Payments</span>
                <span className="font-numeric font-semibold text-emerald-700">100% (High Impact)</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">Credit Utilization</span>
                <span className="font-numeric font-semibold text-slate-900">18% (Low)</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">Credit Age</span>
                <span className="font-numeric font-semibold text-slate-900">4 yrs 2 mos</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-5 w-full h-11 rounded-xl bg-[#5F259F] text-white text-sm font-semibold hover:bg-[#4B1C80]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoanSuccessView({
  result,
  onViewHistory,
  onDone,
}: {
  result: {
    title: string;
    amount: number;
    bankName: string;
    maskedNumber: string;
    newBalance: number;
    refId: string;
  };
  onViewHistory: () => void;
  onDone: () => void;
}) {
  return (
    <div className="text-center py-2">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <p className="mt-3 text-xs text-slate-500">Demo Loan Disbursed · {result.refId}</p>
      <h3 id="credit-loan-title" className="mt-1 font-numeric text-2xl font-bold text-slate-900">
        +{formatINR(result.amount)}
      </h3>
      <p className="mt-1 text-sm font-medium text-slate-700">{result.title}</p>

      <div className="mt-5 rounded-xl border border-slate-200 divide-y divide-slate-100 text-left text-xs">
        <div className="p-3 flex items-center justify-between">
          <span className="text-slate-500">Credited To</span>
          <span className="font-medium text-slate-900">
            {result.bankName} {result.maskedNumber}
          </span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <span className="text-slate-500">Updated Account Balance</span>
          <span className="font-numeric font-semibold text-emerald-700">
            {formatINR(result.newBalance)}
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onViewHistory}
          className="h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          View History
        </button>
        <button
          type="button"
          onClick={onDone}
          className="h-11 rounded-xl bg-[#5F259F] text-white text-sm font-semibold hover:bg-[#4B1C80]"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION: src/components/InvestTradingView.tsx
// ============================================================================

type AssetCategory = 'stock' | 'fund' | 'gold';

interface DemoInstrument {
  symbol: string;
  name: string;
  category: AssetCategory;
  unitLabel: string;
  basePrice: number;
  currentPrice: number;
  prevClose: number;
  history: number[];
}

interface DemoHolding {
  symbol: string;
  quantity: number;
  avgPrice: number;
  fundingBankId: string;
}

interface DemoTradeRecord {
  id: string;
  symbol: string;
  name: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalAmount: number;
  realizedPnl?: number;
  bankLabel: string;
  timestamp: string;
}

interface InvestBankOption {
  id: string;
  bankName: string;
  shortCode: string;
  maskedNumber: string;
  balance: number;
}

const INITIAL_INSTRUMENTS: DemoInstrument[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    category: 'stock',
    unitLabel: 'Shares',
    basePrice: 2942.5,
    currentPrice: 2942.5,
    prevClose: 2896.0,
    history: [2850, 2868, 2861, 2890, 2905, 2898, 2924, 2919, 2935, 2942.5],
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy',
    category: 'stock',
    unitLabel: 'Shares',
    basePrice: 4128.0,
    currentPrice: 4128.0,
    prevClose: 4160.0,
    history: [4185, 4172, 4165, 4158, 4162, 4149, 4140, 4135, 4131, 4128],
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors',
    category: 'stock',
    unitLabel: 'Shares',
    basePrice: 964.4,
    currentPrice: 964.4,
    prevClose: 982.0,
    history: [1012, 1004, 998, 992, 985, 988, 976, 972, 968, 964.4],
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Equity',
    category: 'stock',
    unitLabel: 'Shares',
    basePrice: 1718.6,
    currentPrice: 1718.6,
    prevClose: 1695.0,
    history: [1672, 1680, 1678, 1691, 1698, 1702, 1709, 1711, 1715, 1718.6],
  },
  {
    symbol: 'NIFTY50',
    name: 'Nifty 50 Index ETF',
    category: 'fund',
    unitLabel: 'Units',
    basePrice: 249.8,
    currentPrice: 249.8,
    prevClose: 246.9,
    history: [241.5, 242.8, 243.4, 244.9, 245.5, 246.2, 247.4, 248.1, 249.0, 249.8],
  },
  {
    symbol: 'PARAGFLEXI',
    name: 'Flexi Cap Direct SIP',
    category: 'fund',
    unitLabel: 'Units',
    basePrice: 84.6,
    currentPrice: 84.6,
    prevClose: 85.4,
    history: [86.2, 85.9, 85.7, 85.4, 85.6, 85.1, 84.9, 84.8, 84.7, 84.6],
  },
  {
    symbol: 'GOLD24K',
    name: '24K Digital Gold',
    category: 'gold',
    unitLabel: 'Grams',
    basePrice: 7490.0,
    currentPrice: 7490.0,
    prevClose: 7420.0,
    history: [7240, 7280, 7310, 7345, 7380, 7405, 7430, 7455, 7475, 7490],
  },
];

const INITIAL_HOLDINGS: DemoHolding[] = [
  { symbol: 'RELIANCE', quantity: 4, avgPrice: 2810.0, fundingBankId: 'bank-hdfc' },
  { symbol: 'TATAMOTORS', quantity: 8, avgPrice: 1015.0, fundingBankId: 'bank-icici' },
  { symbol: 'PARAGFLEXI', quantity: 60, avgPrice: 86.5, fundingBankId: 'bank-sbi' },
  { symbol: 'GOLD24K', quantity: 1.5, avgPrice: 7250.0, fundingBankId: 'bank-hdfc' },
];

const INITIAL_TRADE_HISTORY: DemoTradeRecord[] = [
  {
    id: 'trd-init-1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    side: 'buy',
    quantity: 4,
    price: 2810.0,
    totalAmount: 11240.0,
    bankLabel: 'HDFC •• 4821',
    timestamp: '21 Nov, 10:15 AM',
  },
  {
    id: 'trd-init-2',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors',
    side: 'buy',
    quantity: 8,
    price: 1015.0,
    totalAmount: 8120.0,
    bankLabel: 'ICICI •• 3376',
    timestamp: '19 Nov, 02:30 PM',
  },
  {
    id: 'trd-init-3',
    symbol: 'GOLD24K',
    name: '24K Digital Gold',
    side: 'buy',
    quantity: 1.5,
    price: 7250.0,
    totalAmount: 10875.0,
    bankLabel: 'HDFC •• 4821',
    timestamp: '16 Nov, 11:40 AM',
  },
];

function formatSignedINR(value: number): string {
  const abs = Math.abs(value);
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}₹${abs.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function MiniSparkline({ data, isUp }: { data: number[]; isUp: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 76;
  const height = 28;
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        fill="none"
        stroke={isUp ? '#059669' : '#e11d48'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function LargePriceChart({ data, isUp }: { data: number[]; isUp: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 360;
  const height = 110;
  const coords = data.map((val, i) => {
    const x = 6 + (i / (data.length - 1)) * (width - 12);
    const y = height - 12 - ((val - min) / range) * (height - 24);
    return { x, y };
  });
  const linePoints = coords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPoints = `6,${height} ${linePoints} ${width - 6},${height}`;
  const strokeColor = isUp ? '#059669' : '#e11d48';
  const fillColor = isUp ? 'rgba(5, 150, 105, 0.12)' : 'rgba(225, 29, 72, 0.12)';
  const last = coords[coords.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-28 overflow-visible"
      aria-label="Simulated price chart"
    >
      <polygon points={areaPoints} fill={fillColor} />
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePoints}
      />
      <circle cx={last.x} cy={last.y} r="4" fill={strokeColor} />
    </svg>
  );
}

interface InvestTradingHubProps {
  instruments: DemoInstrument[];
  holdings: DemoHolding[];
  trades: DemoTradeRecord[];
  bankAccounts: InvestBankOption[];
  marketDay: number;
  realizedPnl: number;
  isLiveFeed: boolean;
  autoCreditProfit: boolean;
  lastProfitCreditNotice: string | null;
  onToggleLiveFeed: () => void;
  onToggleAutoCreditProfit: () => void;
  onCreditAllProfits: () => void;
  onDismissProfitNotice: () => void;
  onSimulateNextDay: () => void;
  onNudgeMarket: (factor: number) => void;
  onResetMarket: () => void;
  initialFilter?: 'all' | 'stock' | 'fund' | 'gold' | 'holdings';
  onOpenTrade: (symbol: string, side: 'buy' | 'sell') => void;
}

function InvestTradingHub({
  instruments,
  holdings,
  trades,
  bankAccounts,
  marketDay,
  realizedPnl,
  isLiveFeed,
  autoCreditProfit,
  lastProfitCreditNotice,
  onToggleLiveFeed,
  onToggleAutoCreditProfit,
  onCreditAllProfits,
  onDismissProfitNotice,
  onSimulateNextDay,
  onNudgeMarket,
  onResetMarket,
  initialFilter = 'all',
  onOpenTrade,
}: InvestTradingHubProps) {
  const [filter, setFilter] = useState<'all' | 'stock' | 'fund' | 'gold' | 'holdings'>(
    initialFilter
  );

  const bankMap = useMemo(() => {
    const map = new Map<string, InvestBankOption>();
    bankAccounts.forEach((b) => map.set(b.id, b));
    return map;
  }, [bankAccounts]);

  const portfolioStats = useMemo(() => {
    let invested = 0;
    let current = 0;
    let dayPnl = 0;

    holdings.forEach((h) => {
      const inst = instruments.find((i) => i.symbol === h.symbol);
      if (!inst || h.quantity <= 0) return;
      invested += h.quantity * h.avgPrice;
      current += h.quantity * inst.currentPrice;
      dayPnl += h.quantity * (inst.currentPrice - inst.prevClose);
    });

    const unrealizedPnl = current - invested;
    const unrealizedPct = invested > 0 ? (unrealizedPnl / invested) * 100 : 0;
    const totalPnl = unrealizedPnl + realizedPnl;
    const positiveProfitReady = holdings.reduce((sum, h) => {
      const inst = instruments.find((i) => i.symbol === h.symbol);
      if (!inst || h.quantity <= 0) return sum;
      const gain = (inst.currentPrice - h.avgPrice) * h.quantity;
      return gain > 0 ? sum + gain : sum;
    }, 0);

    return {
      invested,
      current,
      unrealizedPnl,
      unrealizedPct,
      dayPnl,
      totalPnl,
      positiveProfitReady: Math.round(positiveProfitReady * 100) / 100,
    };
  }, [holdings, instruments, realizedPnl]);

  const holdingMap = useMemo(() => {
    const map = new Map<string, DemoHolding>();
    holdings.forEach((h) => map.set(h.symbol, h));
    return map;
  }, [holdings]);

  const filteredInstruments = instruments.filter((inst) => {
    if (filter === 'all') return true;
    if (filter === 'holdings') {
      const h = holdingMap.get(inst.symbol);
      return Boolean(h && h.quantity > 0);
    }
    return inst.category === filter;
  });

  const isOverallProfit = portfolioStats.unrealizedPnl >= 0;

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {lastProfitCreditNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium truncate">{lastProfitCreditNotice}</span>
          </div>
          <button
            type="button"
            onClick={onDismissProfitNotice}
            aria-label="Dismiss profit credit notice"
            className="min-h-[32px] min-w-[32px] rounded-lg flex items-center justify-center text-emerald-700 hover:bg-emerald-100 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Portfolio Profit & Loss Summary Card */}
      <section className="rounded-2xl bg-gradient-to-br from-[#5F259F] via-[#45137D] to-[#260747] text-white p-5 shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-white/75">
              Invest &amp; Trading Portfolio · Day {marketDay} · Demo Market
            </p>
            <div className="mt-1.5 flex items-baseline gap-3 flex-wrap">
              <h1 className="font-numeric text-3xl font-bold tracking-tight">
                {formatINR(portfolioStats.current)}
              </h1>
              <span
                className={`inline-flex items-center gap-1 text-xs font-numeric font-semibold ${
                  isOverallProfit ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {isOverallProfit ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {isOverallProfit ? 'Profit' : 'Loss'}{' '}
                  {formatSignedINR(portfolioStats.unrealizedPnl)} (
                  {portfolioStats.unrealizedPct >= 0 ? '+' : ''}
                  {portfolioStats.unrealizedPct.toFixed(2)}%)
                </span>
              </span>
            </div>
            <p className="mt-1 text-[11px] text-white/80">
              Any trading profit automatically credits directly into your paying bank account.
            </p>
          </div>

          {/* Live & Daily Market Simulation Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleAutoCreditProfit}
              className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                autoCreditProfit
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-white/15 text-white/85 hover:bg-white/25'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Auto-Bank Profit: {autoCreditProfit ? 'ON' : 'OFF'}</span>
            </button>
            <button
              type="button"
              onClick={onSimulateNextDay}
              className="min-h-[36px] px-3 rounded-xl bg-white text-[#5F259F] hover:bg-purple-50 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Next Market Day</span>
            </button>
            <button
              type="button"
              onClick={onToggleLiveFeed}
              className="min-h-[36px] px-3 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              {isLiveFeed ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLiveFeed ? 'Pause Feed' : 'Live Feed'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNudgeMarket(1.03)}
              className="min-h-[36px] px-2.5 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-100 text-xs font-numeric font-semibold transition-colors whitespace-nowrap"
            >
              Rally +3%
            </button>
            <button
              type="button"
              onClick={() => onNudgeMarket(0.97)}
              className="min-h-[36px] px-2.5 rounded-xl bg-rose-500/25 hover:bg-rose-500/35 text-rose-100 text-xs font-numeric font-semibold transition-colors whitespace-nowrap"
            >
              Dip -3%
            </button>
            <button
              type="button"
              onClick={onResetMarket}
              aria-label="Reset demo market prices"
              className="min-h-[36px] min-w-[36px] rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4-Metric P&L Breakdown */}
        <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <p className="text-white/70">Invested Value</p>
            <p className="font-numeric text-sm font-semibold mt-0.5">
              {formatINR(portfolioStats.invested)}
            </p>
          </div>
          <div>
            <p className="text-white/70">Unrealized P&amp;L</p>
            <p
              className={`font-numeric text-sm font-semibold mt-0.5 ${
                portfolioStats.unrealizedPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {formatSignedINR(portfolioStats.unrealizedPnl)}
            </p>
          </div>
          <div>
            <p className="text-white/70">Credited to Banks (Net)</p>
            <p
              className={`font-numeric text-sm font-semibold mt-0.5 ${
                realizedPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {formatSignedINR(realizedPnl)}
            </p>
          </div>
          <div>
            <p className="text-white/70">Today&apos;s P&amp;L (Day {marketDay})</p>
            <p
              className={`font-numeric text-sm font-semibold mt-0.5 ${
                portfolioStats.dayPnl >= 0 ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {formatSignedINR(portfolioStats.dayPnl)}
            </p>
          </div>
        </div>

        {portfolioStats.positiveProfitReady >= 1 && (
          <div className="mt-3.5 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-emerald-200 font-numeric">
              {formatINR(portfolioStats.positiveProfitReady)} profit ready to credit directly to your paying bank account(s)
            </span>
            <button
              type="button"
              onClick={onCreditAllProfits}
              className="min-h-[36px] px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Credit {formatINR(portfolioStats.positiveProfitReady)} Profit to Bank
            </button>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Market & Trading Watchlist */}
        <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Trade Stocks, SIP &amp; Gold</h2>
              <p className="text-xs text-slate-500">
                Daily profit &amp; loss updates live · Tap Buy or Sell
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'stock', label: 'Stocks' },
                  { id: 'fund', label: 'SIP / ETF' },
                  { id: 'gold', label: '24K Gold' },
                  { id: 'holdings', label: 'My Holdings' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    filter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredInstruments.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              No active holdings in this category yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredInstruments.map((inst) => {
                const dayDiff = inst.currentPrice - inst.prevClose;
                const dayPct = inst.prevClose > 0 ? (dayDiff / inst.prevClose) * 100 : 0;
                const isUp = dayDiff >= 0;
                const holding = holdingMap.get(inst.symbol);
                const holdingPnl =
                  holding && holding.quantity > 0
                    ? (inst.currentPrice - holding.avgPrice) * holding.quantity
                    : null;
                const fundingBank = holding ? bankMap.get(holding.fundingBankId) : undefined;

                return (
                  <div
                    key={inst.symbol}
                    className="py-3.5 flex items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenTrade(inst.symbol, 'buy')}
                      className="flex-1 min-w-0 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 rounded-xl p-1.5 -m-1.5 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {inst.symbol}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">
                            · {inst.name}
                          </span>
                        </div>
                        {holding && holding.quantity > 0 ? (
                          <p className="text-[11px] text-slate-600 font-numeric mt-0.5 truncate">
                            Qty {holding.quantity} · Paid via {fundingBank?.shortCode ?? 'Bank'}{' '}
                            {fundingBank?.maskedNumber ?? ''} ·{' '}
                            <span
                              className={`font-semibold ${
                                (holdingPnl ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {(holdingPnl ?? 0) >= 0 ? 'Profit' : 'Loss'}{' '}
                              {formatSignedINR(holdingPnl ?? 0)}
                            </span>
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {inst.category === 'stock'
                              ? 'NSE Equity (Demo)'
                              : inst.category === 'fund'
                                ? 'Direct Mutual Fund / ETF'
                                : '24K 99.9% Purity Vault'}
                          </p>
                        )}
                      </div>

                      <div className="hidden sm:block shrink-0">
                        <MiniSparkline data={inst.history} isUp={isUp} />
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-numeric text-sm font-semibold text-slate-900">
                          {formatINR(inst.currentPrice)}
                        </p>
                        <p
                          className={`font-numeric text-[11px] font-medium inline-flex items-center gap-0.5 ${
                            isUp ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {isUp ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          <span>
                            {dayPct >= 0 ? '+' : ''}
                            {dayPct.toFixed(2)}%
                          </span>
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenTrade(inst.symbol, 'buy')}
                        className="min-h-[36px] px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                      >
                        Buy
                      </button>
                      {holding && holding.quantity > 0 && (
                        <button
                          type="button"
                          onClick={() => onOpenTrade(inst.symbol, 'sell')}
                          className="min-h-[36px] px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                        >
                          Sell
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Holdings Breakdown & Recent Trades */}
        <div className="lg:col-span-5 space-y-4">
          <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Holdings P&amp;L Breakdown</h2>
                <p className="text-[11px] text-slate-500">
                  Profit &amp; proceeds return to original paying bank
                </p>
              </div>
              <span className="text-xs text-slate-500 font-numeric">
                {holdings.filter((h) => h.quantity > 0).length} open
              </span>
            </div>

            {holdings.filter((h) => h.quantity > 0).length === 0 ? (
              <p className="text-xs text-slate-500 py-5 text-center">
                No active holdings. Buy any stock, SIP, or 24K Gold to track Profit &amp; Loss.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {holdings
                  .filter((h) => h.quantity > 0)
                  .map((h) => {
                    const inst = instruments.find((i) => i.symbol === h.symbol);
                    if (!inst) return null;
                    const investedVal = h.quantity * h.avgPrice;
                    const currentVal = h.quantity * inst.currentPrice;
                    const pnl = currentVal - investedVal;
                    const pnlPct = investedVal > 0 ? (pnl / investedVal) * 100 : 0;
                    const isProfit = pnl >= 0;
                    const fundingBank = bankMap.get(h.fundingBankId) ?? bankAccounts[0];

                    return (
                      <div key={h.symbol} className="py-3 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {inst.symbol}{' '}
                              <span className="text-xs font-normal text-slate-500">
                                · {h.quantity} {inst.unitLabel}
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500 font-numeric mt-0.5 truncate">
                              Paid from {fundingBank?.shortCode} {fundingBank?.maskedNumber} · Avg{' '}
                              {formatINR(h.avgPrice)}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p
                              className={`font-numeric text-sm font-semibold ${
                                isProfit ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {formatSignedINR(pnl)}
                            </p>
                            <p
                              className={`font-numeric text-[11px] ${
                                isProfit ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {isProfit ? 'Profit' : 'Loss'} ({pnlPct >= 0 ? '+' : ''}
                              {pnlPct.toFixed(2)}%)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-500 font-numeric">
                            Current: {formatINR(currentVal)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenTrade(inst.symbol, 'sell')}
                            className="min-h-[32px] px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5F259F] text-[11px] font-semibold transition-colors whitespace-nowrap"
                          >
                            {isProfit ? 'Withdraw to' : 'Sell to'} {fundingBank?.shortCode}{' '}
                            {fundingBank?.maskedNumber}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Recent Trade Orders</h2>
              <span className="text-xs text-slate-500 font-numeric">{trades.length} orders</span>
            </div>

            {trades.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No trade orders placed yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {trades.slice(0, 5).map((trade) => (
                  <div key={trade.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        <span
                          className={
                            trade.side === 'buy' ? 'text-emerald-700' : 'text-rose-600'
                          }
                        >
                          {trade.side === 'buy' ? 'BUY' : 'SELL'}
                        </span>{' '}
                        · {trade.symbol} ({trade.quantity})
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {trade.timestamp} · {trade.bankLabel}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-numeric text-xs font-semibold text-slate-900">
                        {formatINR(trade.totalAmount)}
                      </p>
                      {typeof trade.realizedPnl === 'number' && (
                        <p
                          className={`font-numeric text-[10px] font-medium ${
                            trade.realizedPnl >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {trade.realizedPnl >= 0 ? 'Profit' : 'Loss'}{' '}
                          {formatSignedINR(trade.realizedPnl)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

interface TradeOrderModalProps {
  isOpen: boolean;
  instrument: DemoInstrument | null;
  instruments: DemoInstrument[];
  holding: DemoHolding | undefined;
  initialSide: 'buy' | 'sell';
  bankAccounts: InvestBankOption[];
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
  onRequestPin: (subtitle: string, onVerified: () => void) => void;
  onExecuteTrade: (params: {
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    bankId: string;
  }) =>
    | {
        side: 'buy' | 'sell';
        symbol: string;
        quantity: number;
        price: number;
        totalAmount: number;
        realizedPnl?: number;
        bankName: string;
        maskedNumber: string;
        updatedBalance: number;
      }
    | { error: string };
  onViewHistory: () => void;
}

function TradeOrderModal({
  isOpen,
  instrument,
  instruments,
  holding,
  initialSide,
  bankAccounts,
  onClose,
  onSelectSymbol,
  onRequestPin,
  onExecuteTrade,
  onViewHistory,
}: TradeOrderModalProps) {
  const [side, setSide] = useState<'buy' | 'sell'>(initialSide);
  const [quantityInput, setQuantityInput] = useState('2');
  const [selectedBankId, setSelectedBankId] = useState(bankAccounts[0]?.id ?? '');
  const [errorMsg, setErrorMsg] = useState('');
  const [receipt, setReceipt] = useState<{
    side: 'buy' | 'sell';
    symbol: string;
    quantity: number;
    price: number;
    totalAmount: number;
    realizedPnl?: number;
    bankName: string;
    maskedNumber: string;
    updatedBalance: number;
  } | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSide(initialSide);
      setQuantityInput(
        initialSide === 'sell' && holding && holding.quantity > 0
          ? String(holding.quantity)
          : instrument?.category === 'gold'
            ? '1'
            : '2'
      );
      if (holding?.fundingBankId) {
        setSelectedBankId(holding.fundingBankId);
      }
      setErrorMsg('');
      setReceipt(null);
    }
  }, [isOpen, initialSide, instrument?.symbol, holding?.fundingBankId]);

  if (!isOpen || !instrument) return null;

  const originalPayingBank = holding
    ? bankAccounts.find((b) => b.id === holding.fundingBankId) ?? bankAccounts[0]
    : undefined;

  const activeBankId =
    side === 'sell' && originalPayingBank
      ? originalPayingBank.id
      : bankAccounts.some((b) => b.id === selectedBankId)
        ? selectedBankId
        : bankAccounts[0]?.id ?? '';

  const selectedBank = bankAccounts.find((b) => b.id === activeBankId);

  const qtyNum = Math.round((Number(quantityInput) || 0) * 1000) / 1000;
  const orderValue = Math.round(qtyNum * instrument.currentPrice * 100) / 100;

  const dayDiff = instrument.currentPrice - instrument.prevClose;
  const dayPct = instrument.prevClose > 0 ? (dayDiff / instrument.prevClose) * 100 : 0;
  const isUp = dayDiff >= 0;

  const currentHoldingQty = holding?.quantity ?? 0;
  const unrealizedPnl =
    currentHoldingQty > 0 && holding
      ? (instrument.currentPrice - holding.avgPrice) * currentHoldingQty
      : 0;

  const estimatedRealizedPnl =
    side === 'sell' && holding && qtyNum > 0
      ? (instrument.currentPrice - holding.avgPrice) * qtyNum
      : 0;

  const handleClose = () => {
    setErrorMsg('');
    setReceipt(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qtyNum <= 0) {
      setErrorMsg(`Enter a valid quantity of ${instrument.unitLabel.toLowerCase()}.`);
      return;
    }
    if (!selectedBank) {
      setErrorMsg('Please select a bank account.');
      return;
    }
    if (side === 'buy' && orderValue > selectedBank.balance) {
      setErrorMsg(
        `Insufficient balance in ${selectedBank.bankName} (${formatINR(selectedBank.balance)} available).`
      );
      return;
    }
    if (side === 'sell' && qtyNum > currentHoldingQty) {
      setErrorMsg(
        `You hold ${currentHoldingQty} ${instrument.unitLabel} of ${instrument.symbol}.`
      );
      return;
    }

    onRequestPin(
      `${side === 'buy' ? 'Buy' : 'Sell'} ${qtyNum} ${instrument.symbol} · ${
        side === 'sell' ? `Credit ${selectedBank.shortCode}` : formatINR(orderValue)
      }`,
      () => {
        const res = onExecuteTrade({
          symbol: instrument.symbol,
          side,
          quantity: qtyNum,
          bankId: activeBankId,
        });
        if ('error' in res) {
          setErrorMsg(res.error);
          return;
        }
        setErrorMsg('');
        setReceipt(res);
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trade-modal-title"
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {!receipt ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center shrink-0">
                  {instrument.category === 'gold' ? (
                    <Coins className="w-5 h-5" />
                  ) : instrument.category === 'fund' ? (
                    <BarChart3 className="w-5 h-5" />
                  ) : (
                    <Activity className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Demo Trading Terminal</p>
                  <h3 id="trade-modal-title" className="text-base font-semibold text-slate-900 truncate">
                    {instrument.symbol} · {instrument.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close trade terminal"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Instrument Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {instruments.map((item) => (
                <button
                  key={item.symbol}
                  type="button"
                  onClick={() => {
                    onSelectSymbol(item.symbol);
                    setErrorMsg('');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    item.symbol === instrument.symbol
                      ? 'bg-[#5F259F] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.symbol}
                </button>
              ))}
            </div>

            {/* Live Price + Chart */}
            <div className="rounded-xl border border-slate-200/90 p-3.5 bg-slate-50/50">
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <div>
                  <span className="font-numeric text-2xl font-bold text-slate-900">
                    {formatINR(instrument.currentPrice)}
                  </span>
                  <span
                    className={`ml-2 font-numeric text-xs font-semibold ${
                      isUp ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {dayDiff >= 0 ? '+' : ''}
                    {dayDiff.toFixed(2)} ({dayPct >= 0 ? '+' : ''}
                    {dayPct.toFixed(2)}%)
                  </span>
                </div>
                {currentHoldingQty > 0 && holding && (
                  <span className="text-[11px] font-numeric text-slate-600">
                    Holding {currentHoldingQty} ·{' '}
                    <span
                      className={`font-semibold ${
                        unrealizedPnl >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {formatSignedINR(unrealizedPnl)}
                    </span>
                  </span>
                )}
              </div>
              <LargePriceChart data={instrument.history} isUp={isUp} />
            </div>

            {/* Buy / Sell Segmented Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setSide('buy');
                  setErrorMsg('');
                }}
                className={`h-10 rounded-lg text-xs font-semibold transition-colors ${
                  side === 'buy'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Buy {instrument.symbol}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSide('sell');
                  if (holding && holding.quantity > 0) {
                    setQuantityInput(String(holding.quantity));
                  }
                  setErrorMsg('');
                }}
                className={`h-10 rounded-lg text-xs font-semibold transition-colors ${
                  side === 'sell'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Sell ({currentHoldingQty} held)
              </button>
            </div>

            {/* Quantity Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="trade-qty-input" className="text-xs font-medium text-slate-700">
                  Quantity ({instrument.unitLabel})
                </label>
                <span className="text-xs font-numeric text-slate-500">
                  Order Value: <strong className="text-slate-900">{formatINR(orderValue)}</strong>
                </span>
              </div>
              <input
                id="trade-qty-input"
                type="number"
                min={instrument.category === 'gold' ? '0.1' : '1'}
                step={instrument.category === 'gold' ? '0.1' : '1'}
                value={quantityInput}
                onChange={(e) => {
                  setQuantityInput(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-base font-numeric font-semibold text-slate-900 focus:outline-none focus:border-[#5F259F]"
              />
              <div className="mt-2 flex items-center gap-2">
                {(instrument.category === 'gold' ? [0.5, 1, 2, 5] : [1, 2, 5, 10]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setQuantityInput(String(q));
                      setErrorMsg('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-numeric font-medium text-slate-700"
                  >
                    {q}
                  </button>
                ))}
                {side === 'sell' && currentHoldingQty > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuantityInput(String(currentHoldingQty));
                      setErrorMsg('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700"
                  >
                    Sell All
                  </button>
                )}
              </div>
            </div>

            {side === 'sell' && currentHoldingQty > 0 && qtyNum > 0 && (
              <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  {estimatedRealizedPnl >= 0 ? 'Profit to be Credited' : 'Booked Loss'}
                </span>
                <span
                  className={`font-numeric font-semibold ${
                    estimatedRealizedPnl >= 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {formatSignedINR(estimatedRealizedPnl)}
                </span>
              </div>
            )}

            {/* Bank Account Section: Select on Buy, Locked Auto-Return to Original Paying Bank on Sell */}
            {side === 'buy' ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Pay From Bank Account (Profits &amp; sale money return here)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bankAccounts.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => {
                        setSelectedBankId(bank.id);
                        setErrorMsg('');
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors ${
                        activeBankId === bank.id
                          ? 'border-[#5F259F] bg-purple-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <BankLogo shortCode={bank.shortCode} size="sm" />
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {bank.shortCode} {bank.maskedNumber}
                        </span>
                      </div>
                      <span className="font-numeric text-[11px] font-semibold text-slate-700 shrink-0">
                        {formatINR(bank.balance)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {selectedBank ? (
                      <BankLogo shortCode={selectedBank.shortCode} size="sm" />
                    ) : (
                      <Landmark className="w-4 h-4 text-[#5F259F]" />
                    )}
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#5F259F] font-semibold">
                        Auto-Return To Original Paying Bank
                      </p>
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {selectedBank?.bankName} {selectedBank?.maskedNumber}
                      </p>
                    </div>
                  </div>
                  <span className="font-numeric text-xs font-semibold text-slate-900 shrink-0">
                    {selectedBank ? formatINR(selectedBank.balance) : ''}
                  </span>
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className={`w-full h-12 rounded-xl text-white text-sm font-semibold transition-colors ${
                side === 'buy'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Verify PIN &amp; {side === 'buy' ? 'Buy' : 'Settle to Paying Bank'} ·{' '}
              {formatINR(orderValue)}
            </button>
          </form>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Demo {receipt.side === 'buy' ? 'Buy' : 'Sell'} Order Executed
            </p>
            <h3 id="trade-modal-title" className="mt-1 font-numeric text-2xl font-bold text-slate-900">
              {receipt.side === 'buy' ? '-' : '+'}
              {formatINR(receipt.totalAmount)}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {receipt.quantity} {instrument.unitLabel} of {receipt.symbol} @ {formatINR(receipt.price)}
            </p>

            <div className="mt-5 rounded-xl border border-slate-200 divide-y divide-slate-100 text-left text-xs">
              {typeof receipt.realizedPnl === 'number' && (
                <div className="p-3 flex items-center justify-between">
                  <span className="text-slate-500">
                    {receipt.realizedPnl >= 0 ? 'Profit Credited' : 'Loss Booked'}
                  </span>
                  <span
                    className={`font-numeric font-semibold ${
                      receipt.realizedPnl >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {formatSignedINR(receipt.realizedPnl)}
                  </span>
                </div>
              )}
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">
                  {receipt.side === 'buy' ? 'Debited Account' : 'Returned To Original Bank'}
                </span>
                <span className="font-medium text-slate-900">
                  {receipt.bankName} {receipt.maskedNumber}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-slate-500">Updated Bank Balance</span>
                <span className="font-numeric font-semibold text-slate-900">
                  {formatINR(receipt.updatedBalance)}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onViewHistory();
                }}
                className="h-11 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                View History
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="h-11 rounded-xl bg-[#5F259F] text-white text-sm font-semibold hover:bg-[#4B1C80]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SECTION: src/App.tsx
// ============================================================================

type TabKey = 'home' | 'stores' | 'invest' | 'wealth' | 'history';

interface DummyBankAccount {
  id: string;
  bankName: string;
  shortCode: string;
  maskedNumber: string;
  upiHandle: string;
  balance: number;
  badgeBg: string;
}

interface ServiceItem {
  id: string;
  label: string;
  category: string;
  description: string;
  defaultRecipient: string;
  recipientPlaceholder: string;
  icon: React.ComponentType<{ className?: string }>;
  tintClass: string;
}

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  bankLabel: string;
}

const INITIAL_BANKS: DummyBankAccount[] = [
  {
    id: 'bank-hdfc',
    bankName: 'HDFC Bank',
    shortCode: 'HDFC',
    maskedNumber: '•• 4821',
    upiHandle: 'aarav@ybl',
    balance: 14820.5,
    badgeBg: 'bg-indigo-50 text-indigo-700',
  },
  {
    id: 'bank-sbi',
    bankName: 'State Bank of India',
    shortCode: 'SBI',
    maskedNumber: '•• 9104',
    upiHandle: 'aarav.sbi@ybl',
    balance: 8450.0,
    badgeBg: 'bg-sky-50 text-sky-700',
  },
  {
    id: 'bank-icici',
    bankName: 'ICICI Bank',
    shortCode: 'ICICI',
    maskedNumber: '•• 3376',
    upiHandle: 'aarav.icici@ybl',
    balance: 22100.0,
    badgeBg: 'bg-orange-50 text-orange-700',
  },
  {
    id: 'bank-axis',
    bankName: 'Axis Bank',
    shortCode: 'AXIS',
    maskedNumber: '•• 6519',
    upiHandle: 'aarav.axis@ybl',
    balance: 5000.0,
    badgeBg: 'bg-rose-50 text-rose-700',
  },
  {
    id: 'bank-kotak',
    bankName: 'Kotak Mahindra Bank',
    shortCode: 'KOTAK',
    maskedNumber: '•• 7290',
    upiHandle: 'aarav.kotak@ybl',
    balance: 11250.0,
    badgeBg: 'bg-red-50 text-red-700',
  },
  {
    id: 'bank-pnb',
    bankName: 'Punjab National Bank',
    shortCode: 'PNB',
    maskedNumber: '•• 1842',
    upiHandle: 'aarav.pnb@ybl',
    balance: 6750.0,
    badgeBg: 'bg-amber-50 text-amber-800',
  },
];

const INITIAL_ACTIVITY: ActivityItem[] = [];

const RECEIVE_MONEY_SERVICE: ServiceItem = {
  id: 'receive-money',
  label: 'Receive Money',
  category: 'Incoming Transfer',
  description: 'Receive money from another demo account or add funds directly into your bank account.',
  defaultRecipient: '',
  recipientPlaceholder: 'Sender name, mobile, or UPI ID (optional)',
  icon: ArrowDownLeft,
  tintClass: 'bg-emerald-50 text-emerald-700',
};

const TRANSFER_SERVICES: ServiceItem[] = [
  {
    id: 'to-mobile',
    label: 'To Mobile Number',
    category: 'Money Transfer',
    description: 'Send a UPI transfer to any mobile number from your bank account.',
    defaultRecipient: '',
    recipientPlaceholder: 'Enter name or 10-digit mobile number',
    icon: Smartphone,
    tintClass: 'bg-[#5F259F] text-white',
  },
  {
    id: 'to-bank',
    label: 'To Bank / UPI ID',
    category: 'Money Transfer',
    description: 'Pay to a UPI ID or bank account handle.',
    defaultRecipient: '',
    recipientPlaceholder: 'Enter recipient name or UPI ID',
    icon: Landmark,
    tintClass: 'bg-[#5F259F] text-white',
  },
  {
    id: 'to-self',
    label: 'To Self Account',
    category: 'Self Transfer',
    description: 'Move balance between your own linked bank accounts.',
    defaultRecipient: 'Self Transfer',
    recipientPlaceholder: 'Transfer note',
    icon: ArrowLeftRight,
    tintClass: 'bg-[#5F259F] text-white',
  },
  {
    id: 'check-balance',
    label: 'Check Balance',
    category: 'Bank Accounts',
    description: 'View and adjust balances across all linked bank accounts.',
    defaultRecipient: '',
    recipientPlaceholder: '',
    icon: Wallet,
    tintClass: 'bg-[#5F259F] text-white',
  },
];

const BILL_SERVICES: ServiceItem[] = [
  {
    id: 'mobile-recharge',
    label: 'Mobile Recharge',
    category: 'Recharge & Bills',
    description: 'Simulate a prepaid or postpaid mobile plan payment.',
    defaultRecipient: 'Jio Prepaid Recharge',
    recipientPlaceholder: 'Mobile number or operator',
    icon: Smartphone,
    tintClass: 'bg-purple-50 text-[#5F259F]',
  },
  {
    id: 'dth',
    label: 'DTH',
    category: 'Recharge & Bills',
    description: 'Pay for a monthly DTH television pack using a bank account.',
    defaultRecipient: 'Tata Play DTH',
    recipientPlaceholder: 'Subscriber ID or provider',
    icon: Tv,
    tintClass: 'bg-indigo-50 text-indigo-700',
  },
  {
    id: 'electricity',
    label: 'Electricity',
    category: 'Utilities',
    description: 'Settle a simulated electricity utility bill from any account.',
    defaultRecipient: 'BESCOM Electricity',
    recipientPlaceholder: 'Electricity board or consumer ID',
    icon: Zap,
    tintClass: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'credit-card',
    label: 'Credit Card',
    category: 'Finance',
    description: 'Simulate paying a monthly credit card statement balance.',
    defaultRecipient: 'Regalia Credit Card',
    recipientPlaceholder: 'Card label or last 4 digits',
    icon: CreditCard,
    tintClass: 'bg-sky-50 text-sky-700',
  },
  {
    id: 'fastag',
    label: 'FASTag',
    category: 'Transit',
    description: 'Add balance to a highway toll FASTag wallet from your bank account.',
    defaultRecipient: 'NHAI FASTag',
    recipientPlaceholder: 'Vehicle registration number',
    icon: Car,
    tintClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'broadband',
    label: 'Broadband',
    category: 'Utilities',
    description: 'Pay a simulated fiber internet monthly invoice.',
    defaultRecipient: 'ACT Fibernet',
    recipientPlaceholder: 'Provider or account ID',
    icon: Wifi,
    tintClass: 'bg-violet-50 text-violet-700',
  },
  {
    id: 'gas-cylinder',
    label: 'Book Cylinder',
    category: 'Utilities',
    description: 'Simulate LPG cylinder booking payment.',
    defaultRecipient: 'Indane Gas Booking',
    recipientPlaceholder: 'Distributor or LPG ID',
    icon: Flame,
    tintClass: 'bg-orange-50 text-orange-700',
  },
  {
    id: 'water-bill',
    label: 'Water Bill',
    category: 'Utilities',
    description: 'Settle a municipal water supply invoice in demo mode.',
    defaultRecipient: 'BWSSB Water Supply',
    recipientPlaceholder: 'RR Number or board name',
    icon: Droplets,
    tintClass: 'bg-cyan-50 text-cyan-700',
  },
];

const WEALTH_SERVICES: ServiceItem[] = [
  {
    id: 'motor-insurance',
    label: 'Bike & Car',
    category: 'Insurance',
    description: 'Simulate a motor insurance renewal payment.',
    defaultRecipient: 'Motor Shield Renewal',
    recipientPlaceholder: 'Policy or vehicle number',
    icon: ShieldCheck,
    tintClass: 'bg-purple-50 text-[#5F259F]',
  },
  {
    id: 'health-insurance',
    label: 'Health Cover',
    category: 'Insurance',
    description: 'Simulate a family health premium installment.',
    defaultRecipient: 'Health Care Premium',
    recipientPlaceholder: 'Policy number',
    icon: HeartPulse,
    tintClass: 'bg-rose-50 text-rose-700',
  },
  {
    id: 'mutual-funds',
    label: 'SIP & Funds',
    category: 'Investments',
    description: 'Allocate funds to a simulated index SIP.',
    defaultRecipient: 'Nifty 50 Index SIP',
    recipientPlaceholder: 'Fund name',
    icon: TrendingUp,
    tintClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'digital-gold',
    label: '24K Gold',
    category: 'Investments',
    description: 'Simulate purchasing digital gold into your demo vault.',
    defaultRecipient: '24K Digital Gold',
    recipientPlaceholder: 'Vault order label',
    icon: Coins,
    tintClass: 'bg-amber-50 text-amber-700',
  },
];

const NEARBY_STORES = [
  { id: 'st-1', name: 'FreshMart Superstore', category: 'Groceries', distance: '320 m away' },
  { id: 'st-2', name: 'Arogya Pharmacy', category: 'Health & Wellness', distance: '450 m away' },
  { id: 'st-3', name: 'Third Wave Roasters', category: 'Cafe & Bakery', distance: '680 m away' },
  { id: 'st-4', name: 'City Fuel Station', category: 'Fuel & EV', distance: '1.1 km away' },
];

const STORAGE_BANKS_KEY = 'paypulse_dummy_banks_v1';
const STORAGE_HISTORY_KEY = 'paypulse_dummy_history_v1';
const STORAGE_PROFILE_KEY = 'paypulse_demo_profile_v1';
const STORAGE_POLICIES_KEY = 'paypulse_demo_policies_v1';
const STORAGE_PIN_KEY = 'paypulse_demo_pin_v1';
const STORAGE_HOLDINGS_KEY = 'paypulse_demo_holdings_v1';
const STORAGE_TRADES_KEY = 'paypulse_demo_trades_v1';
const STORAGE_REALIZED_PNL_KEY = 'paypulse_demo_realized_pnl_v1';
const DEFAULT_PIN = '1234';

interface UserProfile {
  name: string;
  mobile: string;
  photoDataUrl: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Aarav Mehta',
  mobile: '9845012812',
  photoDataUrl: '',
};

function formatINR(value: number): string {
  return `₹${value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function buildUpiSlug(name: string): string {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned.slice(0, 16) || 'user';
}

function formatNowLabel(): string {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `Today, ${timeStr}`;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setSplashFading(true);
    }, 1750);
    const hideTimer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const [bankAccounts, setBankAccounts] = useState<DummyBankAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BANKS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as DummyBankAccount[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((b) => b.id));
          const missingDefaults = INITIAL_BANKS.filter((b) => !existingIds.has(b.id));
          return [...parsed, ...missingDefaults];
        }
      }
    } catch {
      // Fallback to initial dummy banks
    }
    return INITIAL_BANKS;
  });

  const [transactions, setTransactions] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const legacySeedIds = new Set(['act-1', 'act-2', 'act-3', 'act-4']);
          return parsed.filter(
            (item): item is ActivityItem => Boolean(item && !legacySeedIds.has(item.id))
          );
        }
      }
    } catch {
      // Fallback to empty activity
    }
    return INITIAL_ACTIVITY;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BANKS_KEY, JSON.stringify(bankAccounts));
    } catch {
      // Ignore storage quota issues
    }
  }, [bankAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(transactions));
    } catch {
      // Ignore storage quota issues
    }
  }, [transactions]);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<UserProfile>;
        if (parsed && typeof parsed.name === 'string') {
          return {
            name: parsed.name || DEFAULT_PROFILE.name,
            mobile: parsed.mobile || DEFAULT_PROFILE.mobile,
            photoDataUrl: parsed.photoDataUrl || '',
          };
        }
      }
    } catch {
      // Fallback to default profile
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
    } catch {
      // Ignore storage quota issues
    }
  }, [userProfile]);

  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [hideBalance, setHideBalance] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState<'all' | 'debit' | 'credit'>('all');

  // Sheets & Modals
  const [showCheckBalanceSheet, setShowCheckBalanceSheet] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [activeInsuranceType, setActiveInsuranceType] = useState<InsuranceTypeId | null>(null);
  const [creditLoanMode, setCreditLoanMode] = useState<CreditLoanMode | null>(null);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showQrSheet, setShowQrSheet] = useState(false);

  // Invest & Trading (Profit & Loss) State
  const [instruments, setInstruments] = useState<DemoInstrument[]>(INITIAL_INSTRUMENTS);
  const [holdings, setHoldings] = useState<DemoHolding[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HOLDINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DemoHolding>[];
        if (Array.isArray(parsed)) {
          return parsed
            .filter((h): h is Partial<DemoHolding> & { symbol: string; quantity: number; avgPrice: number } =>
              Boolean(h.symbol && typeof h.quantity === 'number' && typeof h.avgPrice === 'number')
            )
            .map((h) => ({
              symbol: h.symbol,
              quantity: h.quantity,
              avgPrice: h.avgPrice,
              fundingBankId:
                h.fundingBankId ||
                INITIAL_HOLDINGS.find((d) => d.symbol === h.symbol)?.fundingBankId ||
                'bank-hdfc',
            }));
        }
      }
    } catch {
      // Fallback to initial holdings
    }
    return INITIAL_HOLDINGS;
  });
  const [tradeHistory, setTradeHistory] = useState<DemoTradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRADES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to initial trade history
    }
    return INITIAL_TRADE_HISTORY;
  });
  const [realizedPnl, setRealizedPnl] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REALIZED_PNL_KEY);
      if (saved !== null) {
        const num = Number(saved);
        if (!Number.isNaN(num)) return num;
      }
    } catch {
      // Fallback
    }
    return 1420.5;
  });
  const [marketDay, setMarketDay] = useState<number>(1);
  const [isLiveFeed, setIsLiveFeed] = useState(true);
  const [investInitialFilter, setInvestInitialFilter] = useState<
    'all' | 'stock' | 'fund' | 'gold' | 'holdings'
  >('all');
  const [tradeModalState, setTradeModalState] = useState<{
    symbol: string;
    side: 'buy' | 'sell';
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HOLDINGS_KEY, JSON.stringify(holdings));
    } catch {
      // Ignore storage errors
    }
  }, [holdings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TRADES_KEY, JSON.stringify(tradeHistory));
    } catch {
      // Ignore storage errors
    }
  }, [tradeHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REALIZED_PNL_KEY, String(realizedPnl));
    } catch {
      // Ignore storage errors
    }
  }, [realizedPnl]);

  const [autoCreditProfit, setAutoCreditProfit] = useState(true);
  const [lastProfitCreditNotice, setLastProfitCreditNotice] = useState<string | null>(null);

  const instrumentsRef = useRef(instruments);
  const holdingsRef = useRef(holdings);
  const bankAccountsRef = useRef(bankAccounts);
  const autoCreditProfitRef = useRef(autoCreditProfit);

  useEffect(() => {
    instrumentsRef.current = instruments;
  }, [instruments]);

  useEffect(() => {
    holdingsRef.current = holdings;
  }, [holdings]);

  useEffect(() => {
    bankAccountsRef.current = bankAccounts;
  }, [bankAccounts]);

  useEffect(() => {
    autoCreditProfitRef.current = autoCreditProfit;
  }, [autoCreditProfit]);

  const settleProfitsToBanks = (
    nextInstruments: DemoInstrument[],
    minProfitPerHolding = 1
  ) => {
    const currentHoldings = holdingsRef.current;
    const currentBanks = bankAccountsRef.current;
    if (currentBanks.length === 0) return;

    const bankCreditMap = new Map<string, number>();
    const settledPriceBySymbol = new Map<string, number>();
    const creditTxList: ActivityItem[] = [];
    const profitTradeRecords: DemoTradeRecord[] = [];
    let totalCredited = 0;

    currentHoldings.forEach((h, idx) => {
      if (h.quantity <= 0) return;
      const inst = nextInstruments.find((i) => i.symbol === h.symbol);
      if (!inst) return;
      const profit = Math.round((inst.currentPrice - h.avgPrice) * h.quantity * 100) / 100;
      if (profit < minProfitPerHolding) return;

      const targetBank =
        currentBanks.find((b) => b.id === h.fundingBankId) ?? currentBanks[0];
      if (!targetBank) return;

      totalCredited = Math.round((totalCredited + profit) * 100) / 100;
      bankCreditMap.set(
        targetBank.id,
        Math.round(((bankCreditMap.get(targetBank.id) ?? 0) + profit) * 100) / 100
      );
      settledPriceBySymbol.set(h.symbol, inst.currentPrice);

      const nowLabel = formatNowLabel();
      creditTxList.push({
        id: `inv-prof-${Date.now()}-${idx}`,
        title: `Trading Profit · ${inst.symbol}`,
        subtitle: `Credited · ${nowLabel} · Direct to ${targetBank.shortCode} ${targetBank.maskedNumber}`,
        amount: profit,
        type: 'credit',
        category: 'Trading Profit',
        bankLabel: `${targetBank.bankName} ${targetBank.maskedNumber}`,
      });

      profitTradeRecords.push({
        id: `trd-prof-${Date.now()}-${idx}`,
        symbol: inst.symbol,
        name: `${inst.name} (Profit Credit)`,
        side: 'sell',
        quantity: h.quantity,
        price: inst.currentPrice,
        totalAmount: profit,
        realizedPnl: profit,
        bankLabel: `${targetBank.shortCode} ${targetBank.maskedNumber}`,
        timestamp: nowLabel,
      });
    });

    if (totalCredited <= 0) return;

    setBankAccounts((prev) =>
      prev.map((bank) => {
        const addAmt = bankCreditMap.get(bank.id);
        return addAmt
          ? { ...bank, balance: Math.round((bank.balance + addAmt) * 100) / 100 }
          : bank;
      })
    );
    setHoldings((prev) =>
      prev.map((h) => {
        const newAvg = settledPriceBySymbol.get(h.symbol);
        return typeof newAvg === 'number' ? { ...h, avgPrice: newAvg } : h;
      })
    );
    setRealizedPnl((prev) => Math.round((prev + totalCredited) * 100) / 100);
    setTransactions((prev) => [...creditTxList, ...prev]);
    setTradeHistory((prev) => [...profitTradeRecords, ...prev]);
    setLastProfitCreditNotice(
      `${formatINR(totalCredited)} trading profit credited directly to your linked Bank Account(s)!`
    );
  };

  // Balanced live demo price ticks (moves both up & down naturally)
  useEffect(() => {
    if (!isLiveFeed) return;
    const timer = window.setInterval(() => {
      const nextInstruments = instrumentsRef.current.map((inst) => {
        const pctShift = (Math.random() - 0.5) * 0.014; // +-0.7% live swing
        const nextPrice = Math.max(
          10,
          Math.round(inst.currentPrice * (1 + pctShift) * 100) / 100
        );
        return {
          ...inst,
          currentPrice: nextPrice,
          history: [...inst.history.slice(-15), nextPrice],
        };
      });
      setInstruments(nextInstruments);
      if (autoCreditProfitRef.current) {
        settleProfitsToBanks(nextInstruments, 25);
      }
    }, 2800);
    return () => window.clearInterval(timer);
  }, [isLiveFeed]);

  // Strict 4-Digit Security PIN State
  const [securityPin, setSecurityPin] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PIN_KEY);
      if (saved && /^\d{4}$/.test(saved)) return saved;
    } catch {
      // Fallback to default PIN
    }
    return DEFAULT_PIN;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PIN_KEY, securityPin);
    } catch {
      // Ignore storage errors
    }
  }, [securityPin]);

  const [pinPrompt, setPinPrompt] = useState<{
    title: string;
    subtitle: string;
    onVerified: () => void;
  } | null>(null);

  const [demoPolicies, setDemoPolicies] = useState<DemoPolicy[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POLICIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial policies
    }
    return INITIAL_DEMO_POLICIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POLICIES_KEY, JSON.stringify(demoPolicies));
    } catch {
      // Ignore storage errors
    }
  }, [demoPolicies]);

  // Profile Edit & PIN Change State
  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const [profileNameDraft, setProfileNameDraft] = useState(userProfile.name);
  const [profileMobileDraft, setProfileMobileDraft] = useState(userProfile.mobile);
  const [profileError, setProfileError] = useState('');
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Per-bank custom balance editor state inside Check Balance
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [customBalanceInput, setCustomBalanceInput] = useState('');

  // Payment Simulator Sheet State
  const [paymentService, setPaymentService] = useState<ServiceItem | null>(null);
  const [recipientInput, setRecipientInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [selectedBankId, setSelectedBankId] = useState<string>(bankAccounts[0]?.id ?? 'bank-hdfc');
  const [targetBankId, setTargetBankId] = useState<string>(bankAccounts[1]?.id ?? 'bank-sbi');
  const [paymentError, setPaymentError] = useState('');
  const [completedReceipt, setCompletedReceipt] = useState<{
    recipient: string;
    amount: number;
    bankName: string;
    maskedNumber: string;
    remainingBalance: number;
    refId: string;
    category: string;
    direction?: 'debit' | 'credit';
    note?: string;
    timestamp?: string;
  } | null>(null);

  const primaryBank = bankAccounts[0];
  const goldInstrument = instruments.find((i) => i.symbol === 'GOLD24K') ?? instruments[0];
  const autoInstrument = instruments.find((i) => i.symbol === 'TATAMOTORS') ?? instruments[0];
  const goldChangePct =
    goldInstrument.prevClose > 0
      ? ((goldInstrument.currentPrice - goldInstrument.prevClose) / goldInstrument.prevClose) * 100
      : 0;
  const silverPerKg = Math.round(goldInstrument.currentPrice * 12.22);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filterServices = (items: ServiceItem[]) =>
    normalizedQuery
      ? items.filter(
          (item) =>
            item.label.toLowerCase().includes(normalizedQuery) ||
            item.category.toLowerCase().includes(normalizedQuery)
        )
      : items;

  const filteredTransfers = filterServices(TRANSFER_SERVICES);
  const filteredBills = filterServices(BILL_SERVICES);
  const filteredWealth = filterServices(WEALTH_SERVICES);

  const filteredActivity = transactions.filter((item) =>
    activityFilter === 'all' ? true : item.type === activityFilter
  );

  const requestPinVerification = (
    subtitle: string,
    onVerified: () => void,
    title = 'Enter Security PIN'
  ) => {
    setPinPrompt({ title, subtitle, onVerified });
  };

  const openCheckBalanceWithPin = () => {
    requestPinVerification(
      'Verify your exact 4-digit PIN to check balances',
      () => setShowCheckBalanceSheet(true),
      'Check Bank Balance'
    );
  };

  const totalPortfolioInvested = holdings.reduce(
    (sum, h) => sum + h.quantity * h.avgPrice,
    0
  );
  const totalPortfolioCurrent = holdings.reduce((sum, h) => {
    const inst = instruments.find((i) => i.symbol === h.symbol);
    return sum + h.quantity * (inst?.currentPrice ?? h.avgPrice);
  }, 0);
  const totalUnrealizedPnl = totalPortfolioCurrent - totalPortfolioInvested;

  const openServiceAction = (service: ServiceItem) => {
    if (service.id === 'check-balance') {
      openCheckBalanceWithPin();
      return;
    }
    if (service.id === 'mobile-recharge') {
      setShowRechargeModal(true);
      return;
    }
    if (service.id === 'motor-insurance') {
      setActiveInsuranceType('bike');
      return;
    }
    if (service.id === 'health-insurance') {
      setActiveInsuranceType('health');
      return;
    }
    if (service.id === 'mutual-funds') {
      setTradeModalState({ symbol: 'PARAGFLEXI', side: 'buy' });
      return;
    }
    if (service.id === 'digital-gold') {
      setTradeModalState({ symbol: 'GOLD24K', side: 'buy' });
      return;
    }
    setPaymentService(service);
    setRecipientInput(service.defaultRecipient);
    setAmountInput('');
    setPaymentNote('');
    setPaymentError('');
    setCompletedReceipt(null);
    if (!bankAccounts.some((b) => b.id === selectedBankId)) {
      setSelectedBankId(bankAccounts[0]?.id ?? '');
    }
    if (service.id === 'to-self') {
      const otherBank = bankAccounts.find((b) => b.id !== selectedBankId) ?? bankAccounts[0];
      if (otherBank) setTargetBankId(otherBank.id);
    }
  };

  const handleSimulateNextDay = () => {
    setMarketDay((d) => d + 1);
    const marketRegime = (Math.random() - 0.5) * 0.04; // daily market bias +-2%
    const nextInstruments = instrumentsRef.current.map((inst) => {
      const stockShock = (Math.random() - 0.5) * 0.06; // +-3% stock move
      const nextPrice = Math.max(
        10,
        Math.round(inst.currentPrice * (1 + marketRegime + stockShock) * 100) / 100
      );
      return {
        ...inst,
        prevClose: inst.currentPrice,
        currentPrice: nextPrice,
        history: [...inst.history.slice(-15), nextPrice],
      };
    });
    setInstruments(nextInstruments);
    if (autoCreditProfitRef.current) {
      settleProfitsToBanks(nextInstruments, 1);
    }
  };

  const handleNudgeMarket = (factor: number) => {
    const nextInstruments = instrumentsRef.current.map((inst) => {
      const nextPrice = Math.max(10, Math.round(inst.currentPrice * factor * 100) / 100);
      return {
        ...inst,
        currentPrice: nextPrice,
        history: [...inst.history.slice(-15), nextPrice],
      };
    });
    setInstruments(nextInstruments);
    if (autoCreditProfitRef.current) {
      settleProfitsToBanks(nextInstruments, 1);
    }
  };

  const handleResetMarket = () => {
    setMarketDay(1);
    setInstruments(INITIAL_INSTRUMENTS);
  };

  const handleExecuteTrade = ({
    symbol,
    side,
    quantity,
    bankId,
  }: {
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    bankId: string;
  }) => {
    const inst = instruments.find((i) => i.symbol === symbol);
    if (!inst) {
      return { error: 'Instrument not found.' };
    }

    const price = inst.currentPrice;
    const totalAmount = Math.round(quantity * price * 100) / 100;

    if (side === 'buy') {
      const bank = bankAccounts.find((b) => b.id === bankId);
      if (!bank) {
        return { error: 'Bank account not found.' };
      }
      if (totalAmount > bank.balance) {
        return {
          error: `Insufficient balance in ${bank.bankName} (${formatINR(bank.balance)} available).`,
        };
      }
      const updatedBalance = Math.round((bank.balance - totalAmount) * 100) / 100;
      setBankAccounts((prev) =>
        prev.map((b) => (b.id === bank.id ? { ...b, balance: updatedBalance } : b))
      );

      setHoldings((prev) => {
        const existing = prev.find((h) => h.symbol === symbol);
        if (!existing) {
          return [{ symbol, quantity, avgPrice: price, fundingBankId: bank.id }, ...prev];
        }
        const newQty = Math.round((existing.quantity + quantity) * 1000) / 1000;
        const newAvg =
          Math.round(
            ((existing.quantity * existing.avgPrice + quantity * price) / newQty) * 100
          ) / 100;
        return prev.map((h) =>
          h.symbol === symbol
            ? { ...h, quantity: newQty, avgPrice: newAvg, fundingBankId: bank.id }
            : h
        );
      });

      const tradeRecord: DemoTradeRecord = {
        id: `trd-${Date.now()}`,
        symbol,
        name: inst.name,
        side: 'buy',
        quantity,
        price,
        totalAmount,
        bankLabel: `${bank.shortCode} ${bank.maskedNumber}`,
        timestamp: formatNowLabel(),
      };
      setTradeHistory((prev) => [tradeRecord, ...prev]);

      setTransactions((prev) => [
        {
          id: `inv-${Date.now()}`,
          title: `Bought ${quantity} ${inst.symbol} @ ${formatINR(price)}`,
          subtitle: `${formatNowLabel()} · Paid via ${bank.shortCode} ${bank.maskedNumber} · Trading Demo`,
          amount: totalAmount,
          type: 'debit',
          category: 'Invest & Trading',
          bankLabel: `${bank.bankName} ${bank.maskedNumber}`,
        },
        ...prev,
      ]);

      return {
        side: 'buy' as const,
        symbol,
        quantity,
        price,
        totalAmount,
        bankName: bank.bankName,
        maskedNumber: bank.maskedNumber,
        updatedBalance,
      };
    }

    // SELL ORDER — Always return proceeds (including profit/loss) to the original paying bank account
    const existing = holdings.find((h) => h.symbol === symbol);
    if (!existing || quantity > existing.quantity) {
      return {
        error: `Insufficient ${symbol} holdings to sell.`,
      };
    }

    const targetReturnBank =
      bankAccounts.find((b) => b.id === existing.fundingBankId) ??
      bankAccounts.find((b) => b.id === bankId) ??
      bankAccounts[0];
    if (!targetReturnBank) {
      return { error: 'Original paying bank account not found.' };
    }

    const bookedPnl = Math.round((price - existing.avgPrice) * quantity * 100) / 100;
    const updatedBalance = Math.round((targetReturnBank.balance + totalAmount) * 100) / 100;

    setBankAccounts((prev) =>
      prev.map((b) => (b.id === targetReturnBank.id ? { ...b, balance: updatedBalance } : b))
    );
    setRealizedPnl((prev) => Math.round((prev + bookedPnl) * 100) / 100);

    setHoldings((prev) =>
      prev
        .map((h) =>
          h.symbol === symbol
            ? { ...h, quantity: Math.round((h.quantity - quantity) * 1000) / 1000 }
            : h
        )
        .filter((h) => h.quantity > 0)
    );

    const tradeRecord: DemoTradeRecord = {
      id: `trd-${Date.now()}`,
      symbol,
      name: inst.name,
      side: 'sell',
      quantity,
      price,
      totalAmount,
      realizedPnl: bookedPnl,
      bankLabel: `${targetReturnBank.shortCode} ${targetReturnBank.maskedNumber}`,
      timestamp: formatNowLabel(),
    };
    setTradeHistory((prev) => [tradeRecord, ...prev]);

    setTransactions((prev) => [
      {
        id: `inv-${Date.now()}`,
        title: `Sold ${quantity} ${inst.symbol} (${bookedPnl >= 0 ? 'Profit' : 'Loss'} ${formatSignedINR(bookedPnl)})`,
        subtitle: `${formatNowLabel()} · Returned to ${targetReturnBank.shortCode} ${targetReturnBank.maskedNumber} · Trading Demo`,
        amount: totalAmount,
        type: 'credit',
        category: 'Invest & Trading',
        bankLabel: `${targetReturnBank.bankName} ${targetReturnBank.maskedNumber}`,
      },
      ...prev,
    ]);

    return {
      side: 'sell' as const,
      symbol,
      quantity,
      price,
      totalAmount,
      realizedPnl: bookedPnl,
      bankName: targetReturnBank.bankName,
      maskedNumber: targetReturnBank.maskedNumber,
      updatedBalance,
    };
  };

  const handleExecuteRecharge = ({
    mobileNumber,
    operatorName,
    planLabel,
    amount,
    bankId,
  }: {
    mobileNumber: string;
    operatorName: string;
    planLabel: string;
    amount: number;
    bankId: string;
  }) => {
    const sourceBank = bankAccounts.find((b) => b.id === bankId);
    if (!sourceBank) {
      return { error: 'Please select a bank account.' };
    }
    if (amount > sourceBank.balance) {
      return {
        error: `Insufficient balance in ${sourceBank.bankName} (${formatINR(sourceBank.balance)} available).`,
      };
    }

    const remainingBalance = Math.round((sourceBank.balance - amount) * 100) / 100;
    setBankAccounts((prev) =>
      prev.map((bank) =>
        bank.id === sourceBank.id ? { ...bank, balance: remainingBalance } : bank
      )
    );

    const newTx: ActivityItem = {
      id: `rch-${Date.now()}`,
      title: `${operatorName} · +91 ${mobileNumber}`,
      subtitle: `${formatNowLabel()} · ${sourceBank.shortCode} ${sourceBank.maskedNumber} · Demo`,
      amount,
      type: 'debit',
      category: `SIM Recharge (${planLabel})`,
      bankLabel: `${sourceBank.bankName} ${sourceBank.maskedNumber}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      remainingBalance,
      bankName: sourceBank.bankName,
      maskedNumber: sourceBank.maskedNumber,
    };
  };

  const handlePurchasePolicy = ({
    type,
    title,
    holderOrVehicle,
    planName,
    coverAmount,
    premium,
    bankId,
  }: {
    type: InsuranceTypeId;
    title: string;
    holderOrVehicle: string;
    planName: string;
    coverAmount: string;
    premium: number;
    bankId: string;
  }) => {
    const sourceBank = bankAccounts.find((b) => b.id === bankId);
    if (!sourceBank) {
      return { error: 'Please select a bank account.' };
    }
    if (premium > sourceBank.balance) {
      return {
        error: `Insufficient balance in ${sourceBank.bankName} (${formatINR(sourceBank.balance)} available).`,
      };
    }

    const remainingBalance = Math.round((sourceBank.balance - premium) * 100) / 100;
    setBankAccounts((prev) =>
      prev.map((bank) =>
        bank.id === sourceBank.id ? { ...bank, balance: remainingBalance } : bank
      )
    );

    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const validUntil = nextYear.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newPolicy: DemoPolicy = {
      id: `pol-${Date.now()}`,
      policyNumber: `PPE-${String(Date.now()).slice(-6)}`,
      type,
      title,
      holderOrVehicle,
      planName,
      coverAmount,
      premium,
      validUntil,
      bankLabel: `${sourceBank.bankName} ${sourceBank.maskedNumber}`,
    };

    setDemoPolicies((prev) => [newPolicy, ...prev]);

    const newTx: ActivityItem = {
      id: `ins-${Date.now()}`,
      title: `${title} · ${planName}`,
      subtitle: `${formatNowLabel()} · ${sourceBank.shortCode} ${sourceBank.maskedNumber} · Demo`,
      amount: premium,
      type: 'debit',
      category: `Insurance (${holderOrVehicle})`,
      bankLabel: `${sourceBank.bankName} ${sourceBank.maskedNumber}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      policy: newPolicy,
      remainingBalance,
    };
  };

  const handleQrScanSuccess = (result: ParsedQrResult) => {
    setShowScannerModal(false);
    const recipientText = result.upiId
      ? result.payeeName !== result.upiId
        ? `${result.payeeName} (${result.upiId})`
        : result.upiId
      : result.payeeName;

    setPaymentService({
      id: 'qr-scan-pay',
      label: result.payeeName,
      category: 'QR / WhatsApp Pay',
      description: 'Pay scanned QR or WhatsApp payment request from any bank account.',
      defaultRecipient: recipientText,
      recipientPlaceholder: 'Recipient name or UPI ID',
      icon: QrCode,
      tintClass: 'bg-[#5F259F] text-white',
    });
    setRecipientInput(recipientText);
    setAmountInput(result.amount);
    setPaymentError('');
    setCompletedReceipt(null);
    if (!bankAccounts.some((b) => b.id === selectedBankId)) {
      setSelectedBankId(bankAccounts[0]?.id ?? '');
    }
  };

  const adjustBankBalance = (bankId: string, delta: number) => {
    setBankAccounts((prev) =>
      prev.map((bank) =>
        bank.id === bankId
          ? { ...bank, balance: Math.max(0, Math.round((bank.balance + delta) * 100) / 100) }
          : bank
      )
    );
  };

  const handleSetCustomBalance = (bankId: string) => {
    const parsed = Number(customBalanceInput);
    if (Number.isNaN(parsed) || parsed < 0) return;
    setBankAccounts((prev) =>
      prev.map((bank) =>
        bank.id === bankId ? { ...bank, balance: Math.round(parsed * 100) / 100 } : bank
      )
    );
    setEditingBankId(null);
    setCustomBalanceInput('');
  };

  const handleResetDemo = () => {
    setBankAccounts(INITIAL_BANKS);
    setTransactions(INITIAL_ACTIVITY);
    setEditingBankId(null);
    setCustomBalanceInput('');
  };

  const handleDisburseLoan = ({
    title,
    category,
    amount,
    bankId,
  }: {
    title: string;
    category: string;
    amount: number;
    bankId: string;
  }) => {
    const destBank = bankAccounts.find((b) => b.id === bankId);
    if (!destBank) {
      return { error: 'Please select a bank account.' };
    }
    const newBalance = Math.round((destBank.balance + amount) * 100) / 100;
    setBankAccounts((prev) =>
      prev.map((bank) => (bank.id === destBank.id ? { ...bank, balance: newBalance } : bank))
    );

    const newTx: ActivityItem = {
      id: `loan-${Date.now()}`,
      title,
      subtitle: `${formatNowLabel()} · Credited to ${destBank.shortCode} ${destBank.maskedNumber} · Demo`,
      amount,
      type: 'credit',
      category,
      bankLabel: `${destBank.bankName} ${destBank.maskedNumber}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    return {
      newBalance,
      bankName: destBank.bankName,
      maskedNumber: destBank.maskedNumber,
    };
  };

  const openProfileDrawer = () => {
    setProfileNameDraft(userProfile.name);
    setProfileMobileDraft(userProfile.mobile);
    setProfileError('');
    setProfileSavedNotice(false);
    setNewPinInput('');
    setConfirmPinInput('');
    setPinChangeError('');
    setPinChangeSuccess(false);
    setShowProfileSheet(true);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPinInput)) {
      setPinChangeError('New PIN must be exactly 4 digits.');
      setPinChangeSuccess(false);
      return;
    }
    if (confirmPinInput !== newPinInput) {
      setPinChangeError('New PIN and Confirm PIN must match.');
      setPinChangeSuccess(false);
      return;
    }
    setSecurityPin(newPinInput);
    setNewPinInput('');
    setConfirmPinInput('');
    setPinChangeError('');
    setPinChangeSuccess(true);
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const size = 240;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setUserProfile((prev) => ({ ...prev, photoDataUrl: dataUrl }));
        setProfileSavedNotice(true);
        setProfileError('');
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setProfileError('Could not load the selected photo.');
    };

    img.src = objectUrl;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = profileNameDraft.trim();
    const cleanMobile = profileMobileDraft.replace(/\D/g, '');

    if (!trimmedName) {
      setProfileError('Please enter your name.');
      return;
    }
    if (cleanMobile.length !== 10) {
      setProfileError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setUserProfile((prev) => ({
      ...prev,
      name: trimmedName,
      mobile: cleanMobile,
    }));
    const newSlug = buildUpiSlug(trimmedName);
    setBankAccounts((prev) =>
      prev.map((bank) => ({
        ...bank,
        upiHandle: `${newSlug}@ok${bank.shortCode.toLowerCase()}.demo`,
      }))
    );
    setProfileError('');
    setProfileSavedNotice(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentService) return;

    const amount = Math.round(Number(amountInput) * 100) / 100;
    const sourceBank = bankAccounts.find((b) => b.id === selectedBankId);

    if (!sourceBank) {
      setPaymentError('Please select a bank account.');
      return;
    }
    if (Number.isNaN(amount) || amount <= 0) {
      setPaymentError('Enter a valid amount greater than ₹0.');
      return;
    }

    const isReceiveMoney = paymentService.id === 'receive-money';
    if (isReceiveMoney) {
      const senderLabel = recipientInput.trim() || 'Demo Account Sender';
      const updatedBalance = Math.round((sourceBank.balance + amount) * 100) / 100;

      setBankAccounts((prev) =>
        prev.map((bank) =>
          bank.id === sourceBank.id ? { ...bank, balance: updatedBalance } : bank
        )
      );

      const creditTx: ActivityItem = {
        id: `tx-cr-${Date.now()}`,
        title: `Received from ${senderLabel}`,
        subtitle: `Credited · ${formatNowLabel()} · ${sourceBank.shortCode} ${sourceBank.maskedNumber}`,
        amount,
        type: 'credit',
        category: 'Incoming Transfer',
        bankLabel: `${sourceBank.bankName} ${sourceBank.maskedNumber}`,
      };

      setTransactions((prev) => [creditTx, ...prev]);
      setPaymentError('');
      playPhonePeSuccessChime();
      setCompletedReceipt({
        recipient: senderLabel,
        amount,
        bankName: sourceBank.bankName,
        maskedNumber: sourceBank.maskedNumber,
        remainingBalance: updatedBalance,
        refId: `PPE${String(Date.now()).slice(-8)}`,
        category: 'Incoming Transfer',
        direction: 'credit',
        note: paymentNote.trim() || undefined,
        timestamp: formatNowLabel(),
      });
      return;
    }

    const isSelfTransfer = paymentService.id === 'to-self';
    const isToMobile = paymentService.id === 'to-mobile';
    const destBank = isSelfTransfer ? bankAccounts.find((b) => b.id === targetBankId) : undefined;

    if (isToMobile) {
      const mobileDigits = recipientInput.replace(/\D/g, '');
      if (mobileDigits.length !== 10 && !(mobileDigits.length === 12 && mobileDigits.startsWith('91'))) {
        setPaymentError('Please enter a valid 10-digit mobile number to continue.');
        return;
      }
    }

    if (isSelfTransfer && (!destBank || destBank.id === sourceBank.id)) {
      setPaymentError('Choose a different destination bank account.');
      return;
    }

    // Check if paying to own UPI handle or own mobile number -> auto-credit matching bank account!
    const normalizedRecipient = recipientInput.trim().toLowerCase();
    const cleanInputDigits = recipientInput.replace(/\D/g, '').slice(-10);
    const matchedOwnBank =
      bankAccounts.find((b) => normalizedRecipient.includes(b.upiHandle.toLowerCase())) ??
      (isToMobile && cleanInputDigits === userProfile.mobile ? bankAccounts[0] : undefined);

    // If sending from another demo account directly to the exact same own bank account -> credit it!
    if (matchedOwnBank && matchedOwnBank.id === sourceBank.id) {
      const updatedBalance = Math.round((sourceBank.balance + amount) * 100) / 100;
      setBankAccounts((prev) =>
        prev.map((bank) =>
          bank.id === sourceBank.id ? { ...bank, balance: updatedBalance } : bank
        )
      );
      const creditTx: ActivityItem = {
        id: `tx-cr-${Date.now()}`,
        title: `Added to ${sourceBank.shortCode} (${userProfile.name})`,
        subtitle: `Credited · ${formatNowLabel()} · ${sourceBank.shortCode} ${sourceBank.maskedNumber}`,
        amount,
        type: 'credit',
        category: 'Account Credit',
        bankLabel: `${sourceBank.bankName} ${sourceBank.maskedNumber}`,
      };
      setTransactions((prev) => [creditTx, ...prev]);
      setPaymentError('');
      playPhonePeSuccessChime();
      setCompletedReceipt({
        recipient: `${sourceBank.bankName} (${userProfile.name})`,
        amount,
        bankName: sourceBank.bankName,
        maskedNumber: sourceBank.maskedNumber,
        remainingBalance: updatedBalance,
        refId: `PPE${String(Date.now()).slice(-8)}`,
        category: 'Account Credit',
        direction: 'credit',
        note: paymentNote.trim() || undefined,
        timestamp: formatNowLabel(),
      });
      return;
    }

    if (amount > sourceBank.balance) {
      setPaymentError(
        `Insufficient balance in ${sourceBank.bankName} (${formatINR(sourceBank.balance)} available).`
      );
      return;
    }

    const receivingOwnBank = isSelfTransfer ? destBank : matchedOwnBank;

    const recipientLabel = isSelfTransfer
      ? `To ${destBank!.bankName} ${destBank!.maskedNumber}`
      : isToMobile
        ? `+91 ${recipientInput.replace(/\D/g, '').slice(-10)}`
        : recipientInput.trim() || paymentService.label;

    const remainingBalance = Math.round((sourceBank.balance - amount) * 100) / 100;

    requestPinVerification(
      `Pay ${formatINR(amount)} to ${recipientLabel} · ${sourceBank.shortCode} ${sourceBank.maskedNumber}`,
      () => {
        setBankAccounts((prev) =>
          prev.map((bank) => {
            if (bank.id === sourceBank.id) {
              return { ...bank, balance: remainingBalance };
            }
            if (receivingOwnBank && bank.id === receivingOwnBank.id) {
              return { ...bank, balance: Math.round((bank.balance + amount) * 100) / 100 };
            }
            return bank;
          })
        );

        const newTx: ActivityItem = {
          id: `tx-${Date.now()}`,
          title: recipientLabel,
          subtitle: `Paid · ${formatNowLabel()} · ${sourceBank.shortCode} ${sourceBank.maskedNumber}`,
          amount,
          type: 'debit',
          category: paymentService.category,
          bankLabel: `${sourceBank.bankName} ${sourceBank.maskedNumber}`,
        };

        const creditEntries: ActivityItem[] = receivingOwnBank
          ? [
              {
                id: `tx-cr-${Date.now() + 1}`,
                title: `Added to ${receivingOwnBank.bankName} ${receivingOwnBank.maskedNumber}`,
                subtitle: `Credited · ${formatNowLabel()} · From ${sourceBank.shortCode} ${sourceBank.maskedNumber}`,
                amount,
                type: 'credit',
                category: 'Account Credit',
                bankLabel: `${receivingOwnBank.bankName} ${receivingOwnBank.maskedNumber}`,
              },
            ]
          : [];

        setTransactions((prev) => [...creditEntries, newTx, ...prev]);
        setPaymentError('');
        playPhonePeSuccessChime();
        setCompletedReceipt({
          recipient: recipientLabel,
          amount,
          bankName: sourceBank.bankName,
          maskedNumber: sourceBank.maskedNumber,
          remainingBalance,
          refId: `PPE${String(Date.now()).slice(-8)}`,
          category: paymentService.category,
          direction: 'debit',
          note: paymentNote.trim() || undefined,
          timestamp: formatNowLabel(),
        });
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] text-slate-900 pb-20 md:pb-10">
      <SplashScreen isVisible={showSplash} isFading={splashFading} />
      {/* Compact Sticky Top Header (56px height) with PhonePe Purple Emblem */}
      <header className="sticky top-0 z-30 h-14 bg-gradient-to-r from-[#2E0F54] via-[#4A1785] to-[#5F259F] text-white shadow-sm">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            aria-label="PhonePe Home"
            className="flex items-center gap-2.5 min-h-[44px] pr-2 rounded-xl hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white text-left shrink-0"
          >
            <PhonePeLogo size="md" />
            <div className="leading-tight min-w-0">
              <div className="flex items-center gap-1 text-sm font-bold tracking-tight whitespace-nowrap">
                <span>PhonePe</span>
              </div>
              <p className="text-[10px] text-purple-200 font-medium truncate max-w-[120px] sm:max-w-xs">
                UPI · Demo
              </p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
            {(
              [
                { key: 'home', label: 'Home' },
                { key: 'stores', label: 'Stores' },
                { key: 'invest', label: 'Invest' },
                { key: 'wealth', label: 'Insurance' },
                { key: 'history', label: 'History' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'text-white border-amber-400 font-semibold'
                    : 'border-transparent hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              aria-label="Scan QR code"
              className="min-h-[44px] min-w-[44px] px-2 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/10 active:bg-white/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ScanLine className="w-5 h-5 text-white" />
              <span className="hidden sm:inline text-xs font-medium whitespace-nowrap">Scan QR</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQrSheet(true)}
              aria-label="Show My QR"
              className="min-h-[44px] min-w-[44px] px-2 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/10 active:bg-white/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <QrCode className="w-5 h-5 text-white" />
              <span className="hidden sm:inline text-xs font-medium whitespace-nowrap">My QR</span>
            </button>
            <button
              type="button"
              onClick={openProfileDrawer}
              aria-label={`Open profile for ${userProfile.name}`}
              className="min-h-[44px] min-w-[44px] pl-1 pr-2 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/10 active:bg-white/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center shrink-0 overflow-hidden">
                {userProfile.photoDataUrl ? (
                  <img
                    src={userProfile.photoDataUrl}
                    alt={userProfile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-white truncate max-w-[96px]">
                {userProfile.name}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-4">
              {/* Compact Live Gold, Silver & Auto Rate Strip */}
              <section
                aria-label="Live Gold and Asset Rates"
                className="bg-white rounded-xl border border-slate-200/80 px-3 py-2 grid grid-cols-3 divide-x divide-slate-100"
              >
                <button
                  type="button"
                  onClick={() => setTradeModalState({ symbol: 'GOLD24K', side: 'buy' })}
                  className="pr-2 text-left hover:bg-slate-50 rounded-l-lg py-0.5 transition-colors min-w-0"
                >
                  <p className="text-[10px] text-slate-500 truncate">24K Gold / 1g</p>
                  <p className="font-numeric text-xs font-semibold text-slate-900 truncate">
                    ₹{goldInstrument.currentPrice.toFixed(0)}{' '}
                    <span className={goldChangePct >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                      {goldChangePct >= 0 ? '+' : ''}
                      {goldChangePct.toFixed(1)}%
                    </span>
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('invest')}
                  className="px-2.5 text-left hover:bg-slate-50 py-0.5 transition-colors min-w-0"
                >
                  <p className="text-[10px] text-slate-500 truncate">Silver / 1kg</p>
                  <p className="font-numeric text-xs font-semibold text-slate-900 truncate">
                    ₹{silverPerKg.toLocaleString('en-IN')}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setTradeModalState({ symbol: 'TATAMOTORS', side: 'buy' })}
                  className="pl-2.5 text-left hover:bg-slate-50 rounded-r-lg py-0.5 transition-colors min-w-0"
                >
                  <p className="text-[10px] text-slate-500 truncate">Auto · Tata</p>
                  <p className="font-numeric text-xs font-semibold text-slate-900 truncate">
                    ₹{autoInstrument.currentPrice.toFixed(1)} · Day {marketDay}
                  </p>
                </button>
              </section>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, bills, or transfers"
                  aria-label="Search services"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#5F259F] transition-colors"
                />
              </div>

              {/* Transfer Money Grid */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-4">
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <h2 className="text-sm font-semibold text-slate-900">Transfer Money</h2>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openServiceAction(RECEIVE_MONEY_SERVICE)}
                      className="text-xs font-semibold text-emerald-700 hover:underline py-0.5"
                    >
                      + Receive Money
                    </button>
                    <button
                      type="button"
                      onClick={openProfileDrawer}
                      className="text-xs font-semibold text-[#5F259F] hover:underline py-0.5 truncate max-w-[120px]"
                    >
                      {userProfile.name} · Edit
                    </button>
                  </div>
                </div>

                {filteredTransfers.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No transfer services match &ldquo;{searchQuery}&rdquo;
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {filteredTransfers.map((service) => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => openServiceAction(service)}
                          className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all min-h-[44px]"
                        >
                          <span
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${service.tintClass}`}
                          >
                            <Icon className="w-5 h-5" />
                          </span>
                          <span className="mt-2 text-[11px] sm:text-xs font-medium text-slate-800 leading-tight line-clamp-2">
                            {service.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* 3-Tile Quick Strip */}
              <section className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={openCheckBalanceWithPin}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3 text-left hover:border-[#5F259F]/40 active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <Landmark className="w-4 h-4 text-[#5F259F]" />
                  <p className="mt-2 text-xs font-semibold text-slate-900 truncate">Bank Accounts</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    PIN Protected · {bankAccounts.length}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('stores')}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3 text-left hover:border-[#5F259F]/40 active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <Store className="w-4 h-4 text-[#5F259F]" />
                  <p className="mt-2 text-xs font-semibold text-slate-900 truncate">Partner Stores</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {NEARBY_STORES.length} nearby
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="bg-white rounded-2xl border border-slate-200/80 p-3 text-left hover:border-[#5F259F]/40 active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <Users className="w-4 h-4 text-[#5F259F]" />
                  <p className="mt-2 text-xs font-semibold text-slate-900 truncate">Ledger</p>
                  <p className="text-[11px] text-slate-500 font-numeric truncate">
                    {transactions.length} entries
                  </p>
                </button>
              </section>

              {/* Invest & Trading (Profit & Loss) Card */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Invest &amp; Trading (P&amp;L)
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Portfolio {formatINR(totalPortfolioCurrent)} ·{' '}
                      <span
                        className={`font-numeric font-semibold ${
                          totalUnrealizedPnl >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {totalUnrealizedPnl >= 0 ? 'Profit' : 'Loss'}{' '}
                        {formatSignedINR(totalUnrealizedPnl)}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInvestInitialFilter('all');
                      setActiveTab('invest');
                    }}
                    className="text-xs font-semibold text-[#5F259F] hover:underline py-1 whitespace-nowrap shrink-0"
                  >
                    Open Terminal
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setTradeModalState({ symbol: 'RELIANCE', side: 'buy' })}
                    className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all min-h-[44px]"
                  >
                    <span className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center transition-transform group-hover:scale-105">
                      <TrendingUp className="w-5 h-5" />
                    </span>
                    <span className="mt-2 text-[11px] font-medium text-slate-800 leading-tight line-clamp-2">
                      Trade Stocks
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTradeModalState({ symbol: 'PARAGFLEXI', side: 'buy' })}
                    className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all min-h-[44px]"
                  >
                    <span className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5F259F] flex items-center justify-center transition-transform group-hover:scale-105">
                      <BarChart3 className="w-5 h-5" />
                    </span>
                    <span className="mt-2 text-[11px] font-medium text-slate-800 leading-tight line-clamp-2">
                      SIP &amp; ETF
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTradeModalState({ symbol: 'GOLD24K', side: 'buy' })}
                    className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all min-h-[44px]"
                  >
                    <span className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center transition-transform group-hover:scale-105">
                      <Coins className="w-5 h-5" />
                    </span>
                    <span className="mt-2 text-[11px] font-medium text-slate-800 leading-tight line-clamp-2">
                      24K Gold
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInvestInitialFilter('holdings');
                      setActiveTab('invest');
                    }}
                    className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all min-h-[44px]"
                  >
                    <span
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        totalUnrealizedPnl >= 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {totalUnrealizedPnl >= 0 ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </span>
                    <span className="mt-2 text-[11px] font-medium text-slate-800 leading-tight line-clamp-2">
                      Profit &amp; Loss
                    </span>
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Recharge & Pay Bills Grid */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900">Recharge &amp; Pay Bills</h2>
                  <span className="text-xs text-slate-500">Demo Biller</span>
                </div>

                {filteredBills.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No billers match &ldquo;{searchQuery}&rdquo;
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                    {filteredBills.map((service) => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => openServiceAction(service)}
                          className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all min-h-[44px]"
                        >
                          <span
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${service.tintClass}`}
                          >
                            <Icon className="w-5 h-5" />
                          </span>
                          <span className="mt-2 text-[11px] sm:text-xs font-medium text-slate-800 leading-tight line-clamp-2">
                            {service.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Loans & Credit Cards Grid */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900">Loans &amp; Credit Cards</h2>
                  <span className="text-xs text-slate-500">Demo Credit</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      {
                        mode: 'credit-card',
                        label: 'Apply Credit Card',
                        icon: CreditCard,
                        tintClass: 'bg-sky-50 text-sky-700',
                      },
                      {
                        mode: 'gold-loan',
                        label: 'Gold Loan',
                        icon: Coins,
                        tintClass: 'bg-amber-50 text-amber-700',
                      },
                      {
                        mode: 'personal-loan',
                        label: 'Personal Loan',
                        icon: BadgeIndianRupee,
                        tintClass: 'bg-emerald-50 text-emerald-700',
                      },
                      {
                        mode: 'credit-score',
                        label: 'Credit Score',
                        icon: Gauge,
                        tintClass: 'bg-purple-50 text-[#5F259F]',
                      },
                    ] as const
                  ).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.mode}
                        type="button"
                        onClick={() => setCreditLoanMode(item.mode)}
                        className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all min-h-[44px]"
                      >
                        <span
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${item.tintClass}`}
                        >
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="mt-2 text-[11px] sm:text-xs font-medium text-slate-800 leading-tight line-clamp-2">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Insurance & Wealth Grid */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900">Insurance &amp; Wealth</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('wealth')}
                    className="text-xs font-semibold text-[#5F259F] hover:underline py-1"
                  >
                    Open Hub
                  </button>
                </div>

                {filteredWealth.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No wealth services match &ldquo;{searchQuery}&rdquo;
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {filteredWealth.map((service) => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => openServiceAction(service)}
                          className="group flex flex-col items-center text-center p-1.5 rounded-xl hover:bg-slate-50 active:scale-[0.97] transition-all min-h-[44px]"
                        >
                          <span
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${service.tintClass}`}
                          >
                            <Icon className="w-5 h-5" />
                          </span>
                          <span className="mt-2 text-[11px] sm:text-xs font-medium text-slate-800 leading-tight line-clamp-2">
                            {service.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Recent Activity */}
              <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-semibold text-[#5F259F] hover:underline py-1"
                  >
                    See All
                  </button>
                </div>

                {transactions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No payments yet. Only payments, recharges, and trades you make appear here.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {transactions.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              item.type === 'credit'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.type === 'credit' ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                            <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`font-numeric text-sm font-semibold whitespace-nowrap block ${
                              item.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                            }`}
                          >
                            {item.type === 'credit' ? '+' : '-'}
                            {formatINR(item.amount)}
                          </span>
                          <span
                            className={`text-[11px] font-medium block ${
                              item.type === 'credit' ? 'text-emerald-700' : 'text-[#5F259F]'
                            }`}
                          >
                            {item.type === 'credit' ? 'Credited' : 'Paid'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* Invest & Trading (Profit & Loss) Hub View */}
        {activeTab === 'invest' && (
          <InvestTradingHub
            instruments={instruments}
            holdings={holdings}
            trades={tradeHistory}
            bankAccounts={bankAccounts}
            marketDay={marketDay}
            realizedPnl={realizedPnl}
            isLiveFeed={isLiveFeed}
            autoCreditProfit={autoCreditProfit}
            lastProfitCreditNotice={lastProfitCreditNotice}
            onToggleLiveFeed={() => setIsLiveFeed((prev) => !prev)}
            onToggleAutoCreditProfit={() => setAutoCreditProfit((prev) => !prev)}
            onCreditAllProfits={() => settleProfitsToBanks(instrumentsRef.current, 1)}
            onDismissProfitNotice={() => setLastProfitCreditNotice(null)}
            onSimulateNextDay={handleSimulateNextDay}
            onNudgeMarket={handleNudgeMarket}
            onResetMarket={handleResetMarket}
            initialFilter={investInitialFilter}
            onOpenTrade={(symbol, side) => setTradeModalState({ symbol, side })}
          />
        )}

        {/* Insurance Hub View */}
        {activeTab === 'wealth' && (
          <InsuranceHubSection
            policies={demoPolicies}
            onSelectProduct={(type) => setActiveInsuranceType(type)}
          />
        )}

        {/* Stores Directory View */}
        {activeTab === 'stores' && (
          <section className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-base font-semibold text-slate-900">Nearby Partner Stores</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Indiranagar · Tap any store to pay from your bank account
                </p>
              </div>
              <Store className="w-5 h-5 text-[#5F259F]" />
            </div>

            <div className="divide-y divide-slate-100">
              {NEARBY_STORES.map((store) => (
                <div key={store.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5F259F] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{store.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {store.category} · {store.distance}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openServiceAction({
                        id: store.id,
                        label: store.name,
                        category: store.category,
                        description: `Simulate a store payment at ${store.name} (${store.distance}).`,
                        defaultRecipient: store.name,
                        recipientPlaceholder: 'Merchant name',
                        icon: Store,
                        tintClass: 'bg-purple-50 text-[#5F259F]',
                      })
                    }
                    className="min-h-[40px] px-3.5 rounded-lg text-xs font-semibold text-[#5F259F] bg-purple-50 hover:bg-purple-100 transition-colors whitespace-nowrap shrink-0"
                  >
                    Pay Store
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activity History View */}
        {activeTab === 'history' && (
          <section className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-base font-semibold text-slate-900">Transaction History</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your bank account debits and credits only
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: 'debit', label: 'Debits' },
                      { id: 'credit', label: 'Credits' },
                    ] as const
                  ).map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActivityFilter(filter.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        activityFilter === filter.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredActivity.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                {transactions.length === 0
                  ? 'No transactions yet. Only payments, recharges, and trades you make appear here.'
                  : 'No transactions found for this filter.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredActivity.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.type === 'credit'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.type === 'credit' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {item.subtitle} · {item.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`font-numeric text-sm font-semibold whitespace-nowrap block ${
                          item.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {item.type === 'credit' ? '+' : '-'}
                        {formatINR(item.amount)}
                      </span>
                      <span
                        className={`text-[11px] font-medium block ${
                          item.type === 'credit' ? 'text-emerald-700' : 'text-[#5F259F]'
                        }`}
                      >
                        {item.type === 'credit' ? 'Credited' : 'Paid'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar with Central Scan QR */}
      <nav
        aria-label="Primary navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 items-center"
      >
        {(
          [
            { key: 'home', label: 'Home', icon: Home },
            { key: 'invest', label: 'Invest', icon: TrendingUp },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`h-full flex flex-col items-center justify-center transition-colors ${
                isActive ? 'text-[#5F259F]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5 leading-none">{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowScannerModal(true)}
          aria-label="Scan QR code"
          className="h-full flex flex-col items-center justify-center"
        >
          <span className="w-10 h-10 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform">
            <ScanLine className="w-5 h-5" />
          </span>
        </button>

        {(
          [
            { key: 'wealth', label: 'Insurance', icon: Shield },
            { key: 'history', label: 'History', icon: Clock },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`h-full flex flex-col items-center justify-center transition-colors ${
                isActive ? 'text-[#5F259F]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5 leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* CHECK BANK BALANCE — DUMMY BANK MODELS & BALANCE EDITOR SHEET */}
      {showCheckBalanceSheet && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowCheckBalanceSheet(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="check-balance-title"
            className="w-full sm:max-w-lg max-h-[88vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">Linked Bank Accounts</p>
                <h3 id="check-balance-title" className="text-base font-semibold text-slate-900">
                  Check &amp; Adjust Bank Balances
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckBalanceSheet(false)}
                aria-label="Close check balance"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {bankAccounts.length} Linked Bank Accounts
                </p>
                <button
                  type="button"
                  onClick={() => setHideBalance((prev) => !prev)}
                  aria-label={hideBalance ? 'Show bank balances' : 'Hide bank balances'}
                  className="min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center text-[#5F259F] hover:bg-purple-100 transition-colors"
                >
                  {hideBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleResetDemo}
                className="min-h-[36px] px-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
            </div>

            {/* Unified Security PIN Info & Direct Reset across All Banks */}
            <form
              onSubmit={handleChangePin}
              className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  <LockKeyhole className="w-3.5 h-3.5 text-[#5F259F]" />
                  <span>Unified PIN for All {bankAccounts.length} Accounts</span>
                </span>
                <span className="text-[11px] text-slate-500 font-numeric">
                  {securityPin === DEFAULT_PIN ? 'Default: 1234' : 'Custom PIN Set'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Forgot old PIN? Create a new 4-digit PIN directly — no previous PIN required. Applies to all {bankAccounts.length} bank accounts.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPinInput}
                  onChange={(e) => {
                    setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setPinChangeError('');
                    setPinChangeSuccess(false);
                  }}
                  placeholder="New 4-digit PIN"
                  aria-label="New unified 4-digit PIN"
                  className="flex-1 min-w-0 h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-numeric focus:outline-none focus:border-[#5F259F]"
                />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPinInput}
                  onChange={(e) => {
                    setConfirmPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setPinChangeError('');
                    setPinChangeSuccess(false);
                  }}
                  placeholder="Confirm PIN"
                  aria-label="Confirm new unified 4-digit PIN"
                  className="flex-1 min-w-0 h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-numeric focus:outline-none focus:border-[#5F259F]"
                />
                <button
                  type="submit"
                  className="h-9 px-3 rounded-lg bg-[#5F259F] hover:bg-[#4B1C80] text-white text-xs font-semibold whitespace-nowrap shrink-0"
                >
                  Save New PIN
                </button>
              </div>
              {pinChangeError && (
                <p className="text-[11px] font-medium text-rose-600">{pinChangeError}</p>
              )}
              {pinChangeSuccess && (
                <p className="text-[11px] font-medium text-emerald-700">
                  New PIN saved! Works across all {bankAccounts.length} bank accounts without old PIN.
                </p>
              )}
            </form>

            <div className="mt-4 space-y-3">
              {bankAccounts.map((bank) => {
                const isEditing = editingBankId === bank.id;
                return (
                  <div
                    key={bank.id}
                    className="rounded-xl border border-slate-200/90 p-3.5 bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <BankLogo shortCode={bank.shortCode} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {bank.bankName}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {bank.maskedNumber} · Unified PIN Active
                          </p>
                        </div>
                      </div>
                      <p className="font-numeric text-base font-semibold text-slate-900 whitespace-nowrap shrink-0">
                        {hideBalance ? '₹ ••••••' : formatINR(bank.balance)}
                      </p>
                    </div>

                    {/* Increase / Decrease Controls */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustBankBalance(bank.id, -500)}
                          className="min-h-[36px] px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all inline-flex items-center gap-1"
                        >
                          <Minus className="w-3 h-3" />
                          <span>₹500</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustBankBalance(bank.id, 500)}
                          className="min-h-[36px] px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>₹500</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustBankBalance(bank.id, 2000)}
                          className="min-h-[36px] px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition-all inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>₹2,000</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (isEditing) {
                            setEditingBankId(null);
                          } else {
                            setEditingBankId(bank.id);
                            setCustomBalanceInput(String(bank.balance));
                          }
                        }}
                        className="min-h-[36px] px-3 rounded-lg text-xs font-semibold text-[#5F259F] bg-purple-50 hover:bg-purple-100 transition-colors"
                      >
                        {isEditing ? 'Cancel' : 'Edit Balance'}
                      </button>
                    </div>

                    {isEditing && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={customBalanceInput}
                          onChange={(e) => setCustomBalanceInput(e.target.value)}
                          placeholder="Enter exact balance"
                          aria-label={`Set balance for ${bank.bankName}`}
                          className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-sm font-numeric focus:outline-none focus:border-[#5F259F]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSetCustomBalance(bank.id)}
                          className="h-10 px-4 rounded-lg bg-[#5F259F] text-white text-xs font-semibold hover:bg-[#4B1C80] transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PHONEPE-STYLE PAYMENT SHEET & FULL-GREEN SUCCESS SCREEN */}
      {paymentService && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setPaymentService(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-sheet-title"
            className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!completedReceipt ? (
              <form onSubmit={handleSubmitPayment}>
                {/* PhonePe Signature Purple Checkout Header */}
                <div className="bg-gradient-to-r from-[#3B1068] via-[#5F259F] to-[#6D28D9] text-white px-5 pt-4 pb-5">
                  <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-3 sm:hidden" />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-white/15 border border-white/25 flex items-center justify-center shrink-0 font-bold text-base text-white">
                        {recipientInput.trim()
                          ? recipientInput.trim().charAt(0).toUpperCase()
                          : <paymentService.icon className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-purple-200 font-medium flex items-center gap-1.5">
                          <span>{paymentService.category}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-0.5 text-emerald-300">
                            <ShieldCheck className="w-3 h-3" /> Verified UPI
                          </span>
                        </p>
                        <h3
                          id="payment-sheet-title"
                          className="text-base font-semibold text-white truncate"
                        >
                          {recipientInput.trim() || paymentService.label}
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPaymentService(null)}
                      aria-label="Close payment modal"
                      className="min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center text-white/80 hover:bg-white/15 shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Recipient or Destination Bank */}
                  {paymentService.id === 'to-self' ? (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Transfer To Bank Account
                      </label>
                      <select
                        value={targetBankId}
                        onChange={(e) => setTargetBankId(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#5F259F]"
                      >
                        {bankAccounts.map((bank) => (
                          <option key={bank.id} value={bank.id}>
                            {bank.bankName} ({bank.maskedNumber}) — {formatINR(bank.balance)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="recipient-field"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        {paymentService.id === 'receive-money'
                          ? 'Sender Name / UPI ID'
                          : 'Paying To (Name, Mobile or UPI ID)'}
                      </label>
                      <input
                        id="recipient-field"
                        type="text"
                        value={recipientInput}
                        onChange={(e) => setRecipientInput(e.target.value)}
                        placeholder={paymentService.recipientPlaceholder}
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#5F259F]"
                      />
                    </div>
                  )}

                  {/* PhonePe Centered Big Amount Box */}
                  <div className="rounded-2xl bg-purple-50/50 border border-purple-200/80 p-4 text-center">
                    <label
                      htmlFor="amount-field"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-[#5F259F] mb-1"
                    >
                      Enter Amount
                    </label>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl font-bold text-slate-900">₹</span>
                      <input
                        id="amount-field"
                        type="number"
                        min="1"
                        step="0.01"
                        value={amountInput}
                        onChange={(e) => {
                          setAmountInput(e.target.value);
                          setPaymentError('');
                        }}
                        placeholder="0"
                        className="w-40 text-center bg-transparent border-b-2 border-[#5F259F]/30 focus:border-[#5F259F] pb-1 text-3xl font-numeric font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                      {[100, 500, 1000, 2000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setAmountInput(String(preset));
                            setPaymentError('');
                          }}
                          className="px-3 py-1 rounded-lg bg-white border border-purple-200 hover:bg-purple-100/70 text-xs font-numeric font-semibold text-[#5F259F] transition-colors"
                        >
                          +₹{preset}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      placeholder="Add a message (optional)"
                      aria-label="Payment note"
                      className="mt-3 w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#5F259F]"
                    />
                  </div>

                  {/* Choose Bank Account */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        {paymentService.id === 'receive-money'
                          ? 'Credit To Bank Account'
                          : 'Pay Using Bank Account'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentService(null);
                          openCheckBalanceWithPin();
                        }}
                        className="text-xs font-semibold text-[#5F259F] hover:underline"
                      >
                        Check Balance
                      </button>
                    </div>
                    <div className="space-y-2">
                      {bankAccounts.map((bank) => {
                        const isSelected = selectedBankId === bank.id;
                        return (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() => {
                              setSelectedBankId(bank.id);
                              setPaymentError('');
                            }}
                            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors ${
                              isSelected
                                ? 'border-[#5F259F] bg-purple-50/50'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <BankLogo shortCode={bank.shortCode} size="sm" />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-900 truncate">
                                  {bank.bankName} · {bank.maskedNumber}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate font-numeric">
                                  {bank.upiHandle}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-numeric text-xs font-semibold text-slate-900">
                                {formatINR(bank.balance)}
                              </span>
                              <span
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-[#5F259F] bg-[#5F259F]' : 'border-slate-300'
                                }`}
                              >
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {paymentError && (
                    <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
                      {paymentError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className={`w-full h-12 rounded-xl active:scale-[0.99] text-white text-sm font-bold tracking-wide transition-all shadow-sm ${
                      paymentService.id === 'receive-money'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-[#5F259F] hover:bg-[#4B1C80]'
                    }`}
                  >
                    {paymentService.id === 'receive-money'
                      ? amountInput && Number(amountInput) > 0
                        ? `ADD ${formatINR(Number(amountInput))} TO BANK`
                        : 'ADD MONEY TO BANK'
                      : amountInput && Number(amountInput) > 0
                        ? `PROCEED TO PAY ${formatINR(Number(amountInput))}`
                        : 'PROCEED TO PAY'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {/* PhonePe Signature Full-Green Payment Success Header */}
                <div className="bg-gradient-to-br from-[#15803D] via-[#16A34A] to-[#22C55E] text-white px-5 pt-7 pb-6 text-center relative">
                  <div className="w-16 h-16 rounded-full bg-white/20 ring-4 ring-white/30 flex items-center justify-center mx-auto shadow-lg">
                    <div className="w-12 h-12 rounded-full bg-white text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  </div>
                  <h3
                    id="payment-sheet-title"
                    className="mt-4 text-lg font-bold text-white leading-snug"
                  >
                    {completedReceipt.direction === 'credit'
                      ? `Received ${formatINR(completedReceipt.amount)} Successfully`
                      : `Payment of ${formatINR(completedReceipt.amount)} successful`}
                  </h3>
                  <p className="mt-1 text-xs text-emerald-100">
                    {completedReceipt.timestamp || formatNowLabel()} · PhonePe UPI
                  </p>
                </div>

                {/* PhonePe-Style White Transaction Breakdown Card */}
                <div className="p-5 bg-slate-50/70 space-y-4">
                  <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-[#5F259F] font-bold text-sm flex items-center justify-center shrink-0">
                          {completedReceipt.recipient.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-500">
                            {completedReceipt.direction === 'credit' ? 'Received From' : 'Paid To'}
                          </p>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {completedReceipt.recipient}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`font-numeric text-lg font-bold shrink-0 ${
                          completedReceipt.direction === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {completedReceipt.direction === 'credit' ? '+' : ''}
                        {formatINR(completedReceipt.amount)}
                      </p>
                    </div>

                    <div className="pt-3 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">Transaction ID</span>
                        <span className="font-numeric font-semibold text-slate-900">
                          {completedReceipt.refId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">
                          {completedReceipt.direction === 'credit' ? 'Credited To' : 'Debited From'}
                        </span>
                        <span className="font-medium text-slate-900">
                          {completedReceipt.bankName} {completedReceipt.maskedNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">Updated Account Balance</span>
                        <span className="font-numeric font-semibold text-slate-900">
                          {formatINR(completedReceipt.remainingBalance)}
                        </span>
                      </div>
                      {completedReceipt.note && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500">Message</span>
                          <span className="font-medium text-slate-800 truncate max-w-[180px]">
                            {completedReceipt.note}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Powered by UPI · PhonePe Demo
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentService(null);
                        setCompletedReceipt(null);
                        setActiveTab('history');
                      }}
                      className="h-11 rounded-xl border border-purple-200 bg-white text-sm font-semibold text-[#5F259F] hover:bg-purple-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentService(null);
                        setCompletedReceipt(null);
                      }}
                      className="h-11 rounded-xl bg-[#5F259F] text-white text-sm font-semibold hover:bg-[#4B1C80] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Drawer (Editable Name, Photo & Mobile Number) */}
      {showProfileSheet && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowProfileSheet(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-dialog-title"
            className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-[#5F259F] text-white flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                  {userProfile.photoDataUrl ? (
                    <img
                      src={userProfile.photoDataUrl}
                      alt={userProfile.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3
                    id="profile-dialog-title"
                    className="text-base font-semibold text-slate-900 truncate"
                  >
                    {userProfile.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-numeric">
                    +91 {userProfile.mobile} · Demo Profile
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileSheet(false)}
                aria-label="Close profile"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Upload Controls */}
            <div className="mt-4 flex items-center gap-2">
              <input
                ref={profilePhotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => profilePhotoInputRef.current?.click()}
                className="flex-1 h-10 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-4 h-4 text-[#5F259F]" />
                <span>{userProfile.photoDataUrl ? 'Change Photo' : 'Upload Photo'}</span>
              </button>
              {userProfile.photoDataUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setUserProfile((prev) => ({ ...prev, photoDataUrl: '' }));
                    setProfileSavedNotice(true);
                  }}
                  aria-label="Remove profile photo"
                  className="h-10 px-3 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-xs font-medium text-rose-600 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {/* Editable Name & Mobile Number Form */}
            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
              <div>
                <label
                  htmlFor="profile-name-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="profile-name-input"
                  type="text"
                  value={profileNameDraft}
                  onChange={(e) => {
                    setProfileNameDraft(e.target.value);
                    setProfileError('');
                    setProfileSavedNotice(false);
                  }}
                  placeholder="Enter your name"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#5F259F]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-mobile-input"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-numeric font-medium text-slate-500">
                    +91
                  </span>
                  <input
                    id="profile-mobile-input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={profileMobileDraft}
                    onChange={(e) => {
                      setProfileMobileDraft(e.target.value.replace(/\D/g, '').slice(0, 10));
                      setProfileError('');
                      setProfileSavedNotice(false);
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full h-11 pl-11 pr-3.5 rounded-xl border border-slate-200 text-sm font-numeric font-medium text-slate-900 focus:outline-none focus:border-[#5F259F]"
                  />
                </div>
              </div>

              {profileError && (
                <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {profileError}
                </p>
              )}

              {profileSavedNotice && !profileError && (
                <p className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  Profile updated successfully.
                </p>
              )}

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#5F259F] hover:bg-[#4B1C80] text-white text-sm font-semibold transition-colors"
              >
                Save Profile
              </button>
            </form>

            {/* Forgot / Create New Security PIN Section */}
            <form
              onSubmit={handleChangePin}
              className="mt-4 pt-4 border-t border-slate-200/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 inline-flex items-center gap-1.5">
                  <LockKeyhole className="w-3.5 h-3.5 text-[#5F259F]" />
                  <span>Unified PIN (All {bankAccounts.length} Accounts)</span>
                </span>
                <span className="text-[11px] text-slate-500 font-numeric">
                  Current: {securityPin === DEFAULT_PIN ? '1234 (Default)' : 'Custom Set'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Forgot your old PIN? Create a new 4-digit PIN directly — no previous PIN required. Applies automatically to all linked bank accounts.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPinInput}
                  onChange={(e) => {
                    setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setPinChangeError('');
                    setPinChangeSuccess(false);
                  }}
                  placeholder="New 4-digit PIN"
                  aria-label="New 4-digit PIN"
                  className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-numeric focus:outline-none focus:border-[#5F259F]"
                />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPinInput}
                  onChange={(e) => {
                    setConfirmPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setPinChangeError('');
                    setPinChangeSuccess(false);
                  }}
                  placeholder="Confirm New PIN"
                  aria-label="Confirm New 4-digit PIN"
                  className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-numeric focus:outline-none focus:border-[#5F259F]"
                />
              </div>
              {pinChangeError && (
                <p className="text-xs font-medium text-rose-600">{pinChangeError}</p>
              )}
              {pinChangeSuccess && (
                <p className="text-xs font-medium text-emerald-700">
                  New Unified PIN created! Works across all {bankAccounts.length} bank accounts without old PIN.
                </p>
              )}
              <button
                type="submit"
                className="w-full h-10 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors"
              >
                Create / Update Unified PIN
              </button>
            </form>

            <div className="mt-4 rounded-xl border border-slate-200/80 divide-y divide-slate-100 text-sm">
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-slate-600">Bank Accounts Linked</span>
                <span className="font-numeric font-medium text-slate-900">
                  {bankAccounts.length} Accounts
                </span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-slate-600">Primary UPI Handle</span>
                <span className="font-numeric text-xs font-medium text-slate-900">
                  {primaryBank.upiHandle}
                </span>
              </div>
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-slate-600">Environment</span>
                <span className="font-medium text-emerald-700">Sandbox Mode</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My QR Preview Modal */}
      {showQrSheet && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowQrSheet(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-dialog-title"
            className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex items-center justify-between">
              <h3 id="qr-dialog-title" className="text-base font-semibold text-slate-900">
                Demo Receive QR
              </h3>
              <button
                type="button"
                onClick={() => setShowQrSheet(false)}
                aria-label="Close QR dialog"
                className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 mx-auto w-44 h-44 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative">
              <QrCode className="w-32 h-32 text-slate-900" />
              <div className="mt-1 flex items-center gap-1.5">
                <PhonePeLogo size="sm" />
                <span className="text-xs font-bold text-[#5F259F]">PhonePe</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-900">{userProfile.name}</p>
            <p className="text-xs text-slate-500 font-numeric mt-0.5">
              +91 {userProfile.mobile} · {primaryBank.upiHandle}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowQrSheet(false);
                  openProfileDrawer();
                }}
                className="h-10 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50"
              >
                Change Name
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowQrSheet(false);
                  openServiceAction(RECEIVE_MONEY_SERVICE);
                }}
                className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                + Receive Money
              </button>
            </div>
          </div>
        </div>
      )}
      {/* QR Scanner Modal (Camera + WhatsApp/Gallery Image + WhatsApp Link Paste) */}
      <QrScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={handleQrScanSuccess}
      />

      {/* Demo Mobile Recharge Modal (Jio, Airtel, Vi, BSNL) */}
      <MobileRechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        bankAccounts={bankAccounts}
        onRequestPin={requestPinVerification}
        onExecuteRecharge={handleExecuteRecharge}
        onViewHistory={() => setActiveTab('history')}
      />

      {/* Demo Insurance Quote & Policy Modal */}
      <InsuranceQuoteModal
        activeType={activeInsuranceType}
        onClose={() => setActiveInsuranceType(null)}
        bankAccounts={bankAccounts}
        onRequestPin={requestPinVerification}
        onPurchasePolicy={handlePurchasePolicy}
        onViewHistory={() => setActiveTab('history')}
      />

      {/* Credit Card, Gold Loan, Personal Loan & Credit Score Modal */}
      <CreditLoanModal
        mode={creditLoanMode}
        onClose={() => setCreditLoanMode(null)}
        defaultName={userProfile.name}
        defaultMobile={userProfile.mobile}
        bankAccounts={bankAccounts}
        onRequestPin={requestPinVerification}
        onDisburseLoan={handleDisburseLoan}
        onViewHistory={() => setActiveTab('history')}
      />

      {/* Invest & Trading Buy/Sell Order Modal */}
      <TradeOrderModal
        isOpen={Boolean(tradeModalState)}
        instrument={
          tradeModalState
            ? instruments.find((i) => i.symbol === tradeModalState.symbol) ?? instruments[0]
            : null
        }
        instruments={instruments}
        holding={
          tradeModalState
            ? holdings.find((h) => h.symbol === tradeModalState.symbol)
            : undefined
        }
        initialSide={tradeModalState?.side ?? 'buy'}
        bankAccounts={bankAccounts}
        onClose={() => setTradeModalState(null)}
        onSelectSymbol={(symbol) =>
          setTradeModalState((prev) => ({ symbol, side: prev?.side ?? 'buy' }))
        }
        onRequestPin={requestPinVerification}
        onExecuteTrade={handleExecuteTrade}
        onViewHistory={() => setActiveTab('history')}
      />

      {/* Strict 4-Digit Security PIN Verification Modal */}
      <PinVerifyModal
        isOpen={Boolean(pinPrompt)}
        title={pinPrompt?.title ?? 'Enter Security PIN'}
        subtitle={pinPrompt?.subtitle ?? ''}
        expectedPin={securityPin}
        onResetPin={(newPin) => setSecurityPin(newPin)}
        onCancel={() => setPinPrompt(null)}
        onSuccess={() => {
          const cb = pinPrompt?.onVerified;
          setPinPrompt(null);
          cb?.();
        }}
      />

      <OfflineIndicator />
    </div>
  );
}
