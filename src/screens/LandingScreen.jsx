import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebaseService';
import { ChevronRight, Lock, Eye, Server } from 'lucide-react';

export default function LandingScreen() {
  const navigate = useNavigate();
  const [showStepper, setShowStepper] = useState(false);
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    cycleStartDate: '',
    cycleLength: 28,
    language: 'English'
  });

  const languages = ['English', 'Telugu', 'Tamil', 'Malayalam', 'Kannada', 'Hindi'];

  const handleLanguageSelect = (lang) => {
    setOnboardingData(prev => ({ ...prev, language: lang }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreateAccount = () => {
    navigate('/login');
  };

  const handleContinueAnonymous = async () => {
    try {
      await signInAnonymously(auth);
      navigate('/forum');
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
    }
  };

  const getProgressWidth = () => {
    const widths = { 1: '33%', 2: '66%', 3: '100%' };
    return widths[step] || '0%';
  };

  return (
    <div className="min-h-screen bg-kurobeni overflow-hidden">
      {/* Botanical SVG background (top-right) */}
      <div className="absolute -top-20 -right-20 w-96 h-96 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 20 Q60 35, 55 50 Q50 65, 50 80 M50 50 Q40 55, 30 50 M50 50 Q60 55, 70 50 M50 40 Q45 35, 40 30 M50 40 Q55 35, 60 30"
            stroke="#c59c79"
            strokeWidth="0.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!showStepper ? (
        // Landing Page
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl w-full space-y-8">
            {/* Header Chip */}
            <div className="text-center">
              <div className="inline-block px-4 py-2 rounded-full border border-copper/40 bg-copper/5 mb-6">
                <span className="text-xs uppercase font-mono tracking-widest text-copper">
                  Women's Health • AI-Powered
                </span>
              </div>

              {/* Hero Headline */}
              <h1 className="text-5xl md:text-6xl font-serif italic text-ivory mb-4 leading-tight">
                Know your body.<br />
                <span className="text-copper">Trust your cycle.</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg text-ivory/70 font-light max-w-xl mx-auto mb-8">
                AI-powered symptom insights, multilingual community, and evidence-backed remedies — all in one place.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 justify-center mb-12">
                {['AI Analysis', '6 Languages', 'Privacy-First'].map((feature) => (
                  <div
                    key={feature}
                    className="px-6 py-2 rounded-full border border-copper/30 bg-copper/5 text-sm font-mono text-copper uppercase tracking-widest"
                  >
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setShowStepper(true)}
                className="w-full sm:w-auto px-12 py-3 bg-copper text-kurobeni rounded-lg font-serif italic text-lg hover:bg-copper/90 transition-colors mb-4 flex items-center justify-center gap-2"
              >
                Begin Your Journey <ChevronRight size={20} />
              </button>

              {/* Sign In Link */}
              <p className="text-sm">
                <span className="text-ivory/60">Already have an account? </span>
                <button
                  onClick={() => navigate('/login')}
                  className="text-copper hover:underline font-mono uppercase tracking-widest text-xs ml-2"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Onboarding Stepper
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
          <div className="glass-card p-8 max-w-md w-full rounded-2xl space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-1 bg-ivory/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-copper transition-all duration-300"
                  style={{ width: getProgressWidth() }}
                />
              </div>
              <p className="text-xs uppercase font-mono tracking-widest text-copper text-center">
                Step {step} of 3
              </p>
            </div>

            {/* Step 1 - Cycle */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-ivory">When did your period start?</h2>
                
                <div>
                  <label className="text-xs uppercase font-mono tracking-widest text-copper mb-2 block">
                    Last Period Date
                  </label>
                  <input
                    type="date"
                    value={onboardingData.cycleStartDate}
                    onChange={(e) => setOnboardingData(prev => ({
                      ...prev,
                      cycleStartDate: e.target.value
                    }))}
                    className="w-full px-4 py-2 bg-ivory/5 border border-ivory/20 rounded-lg text-ivory focus:outline-none focus:border-copper"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-mono tracking-widest text-copper mb-3 block">
                    Cycle Length: {onboardingData.cycleLength} days
                  </label>
                  <input
                    type="range"
                    min="21"
                    max="35"
                    value={onboardingData.cycleLength}
                    onChange={(e) => setOnboardingData(prev => ({
                      ...prev,
                      cycleLength: parseInt(e.target.value)
                    }))}
                    className="w-full accent-copper"
                  />
                </div>

                <button
                  onClick={() => setStep(0)}
                  className="text-sm text-copper hover:underline font-mono uppercase tracking-widest"
                >
                  Skip for now →
                </button>
              </div>
            )}

            {/* Step 2 - Language */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-ivory">Choose your language</h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`p-4 rounded-lg border transition-all text-center ${
                        onboardingData.language === lang
                          ? 'border-copper bg-copper/10 text-copper'
                          : 'border-ivory/20 bg-ivory/5 text-ivory hover:border-copper/30'
                      }`}
                    >
                      <p className="text-sm font-serif">{lang}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 - Privacy */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-ivory">Your data, your control</h2>
                
                <div className="space-y-3">
                  {[
                    { icon: Lock, text: 'Stored securely on Firebase' },
                    { icon: Eye, text: 'Never sold or shared' },
                    { icon: Server, text: 'Export or delete anytime' }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="p-4 border border-teal/30 rounded-lg bg-teal/5 flex items-start gap-3">
                        <Icon className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-ivory">{item.text}</p>
                      </div>
                    );
                  })}
                </div>

                <label className="flex items-start gap-3 p-3 hover:bg-ivory/5 rounded-lg cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-copper mt-0.5" />
                  <span className="text-xs text-ivory/80">
                    I agree to the terms and understand my data is secure
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  className="flex-1 px-4 py-2 border border-ivory/20 text-ivory rounded-lg hover:border-copper/30 transition-colors"
                >
                  ← Back
                </button>
              )}
              
              {step < 3 && (
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 py-2 bg-copper/20 text-copper rounded-lg hover:bg-copper/30 transition-colors font-mono uppercase text-sm"
                >
                  Next →
                </button>
              )}

              {step === 3 && (
                <>
                  <button
                    onClick={handleCreateAccount}
                    className="flex-1 px-4 py-2 bg-copper text-kurobeni rounded-lg hover:bg-copper/90 transition-colors font-mono uppercase text-sm"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={handleContinueAnonymous}
                    className="flex-1 px-4 py-2 border border-copper/30 text-copper rounded-lg hover:bg-copper/5 transition-colors font-mono uppercase text-sm"
                  >
                    Continue Anon
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
