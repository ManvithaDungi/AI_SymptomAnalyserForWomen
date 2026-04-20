import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { initializeAuth, loginWithEmail, signUpWithEmail } from '../services/firebaseService';
import { logger } from '../utils/logger';

export default function LoginScreen() {
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState('login');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [agreed, setAgreed] = useState(false);

   const handleAnonymousLogin = async () => {
      setLoading(true);
      setError('');
      try {
         await initializeAuth();
      } catch (err) {
         setError('Failed to sign in. Please try again.');
         setLoading(false);
      }
   };

   const handleEmailAuth = async (e) => {
      e.preventDefault();
      setError('');

      if (activeTab === 'signup' && password !== confirmPassword) {
         setError('Passwords do not match');
         return;
      }

      if (activeTab === 'signup' && !agreed) {
         setError('Please agree to the disclaimer');
         return;
      }

      setLoading(true);
      try {
         if (activeTab === 'signup') {
            await signUpWithEmail(email, password);
         } else {
            await loginWithEmail(email, password);
         }
      } catch (err) {
         logger.log('Login error code:', err.code);
         let msg = "Authentication failed";
         if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') msg = "No account found with this email";
         if (err.code === 'auth/wrong-password') msg = "Incorrect password";
         if (err.code === 'auth/email-already-in-use') msg = "Email already in use";
         if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters";
         setError(msg);
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen w-full flex items-center justify-center bg-kurobeni text-ivory relative overflow-hidden p-4">
         {/* Background gradient */}
         <div className="absolute inset-0 bg-gradient-to-br from-copper/5 via-transparent to-meadow/5 pointer-events-none"></div>

         <div className="w-full max-w-[480px] glass-card p-8 sm:p-12 relative z-10">

            {/* Header */}
            <div className="text-center mb-8">
               <div className="flex justify-center mb-6">
                  <Heart className="w-12 h-12 text-copper" />
               </div>
               <h1 className="text-4xl font-serif italic text-copper mb-2">Sahachari</h1>
               <p className="text-sm font-mono text-ivory/60 mb-4">సహచరి</p>
               <h2 className="text-2xl font-serif italic text-ivory mb-2">Welcome</h2>
               <p className="text-sm text-ivory/70">Your safe space for women's health</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-8 p-1 bg-blackberry/40 rounded-lg">
               <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-all duration-300 ${
                     activeTab === 'login' 
                        ? 'bg-copper/20 text-copper border border-copper/30' 
                        : 'text-ivory/60 hover:text-ivory'
                  }`}
               >
                  Sign In
               </button>
               <button
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-all duration-300 ${
                     activeTab === 'signup' 
                        ? 'bg-copper/20 text-copper border border-copper/30' 
                        : 'text-ivory/60 hover:text-ivory'
                  }`}
               >
                  Sign Up
               </button>
            </div>

            {/* Error Message */}
            {error && (
               <div className="mb-6 bg-rose/20 border border-rose/40 rounded-lg px-4 py-3 text-rose text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
               </div>
            )}

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-5">
               {/* Email */}
               <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-copper mb-2">Email</label>
                  <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="name@example.com"
                     className="w-full px-5 py-3 bg-blackberry/30 border border-copper/20 rounded-lg text-ivory placeholder:text-ivory/60 focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-all"
                     required
                  />
               </div>

               {/* Password */}
               <div>
                  <div className="flex justify-between items-center mb-2">
                     <label className="text-xs font-mono uppercase tracking-widest text-copper">Password</label>
                     {activeTab === 'login' && (
                        <a href="#" className="text-xs text-copper hover:text-copper/80 transition-colors">Forgot?</a>
                     )}
                  </div>
                  <div className="relative">
                     <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-5 py-3 bg-blackberry/30 border border-copper/20 rounded-lg text-ivory placeholder:text-ivory/60 focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-all"
                        required
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-copper transition-colors"
                     >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                  </div>
               </div>

               {/* Confirm Password (Sign Up only) */}
               {activeTab === 'signup' && (
                  <div>
                     <label className="block text-xs font-mono uppercase tracking-widest text-copper mb-2">Confirm Password</label>
                     <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-5 py-3 bg-blackberry/30 border border-copper/20 rounded-lg text-ivory placeholder:text-ivory/60 focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-all"
                        required
                     />
                  </div>
               )}

               {/* Disclaimer (Sign Up only) */}
               {activeTab === 'signup' && (
                  <div className="flex items-start gap-3 pt-2">
                     <input
                        type="checkbox"
                        id="disclaimer"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-copper rounded"
                     />
                     <label htmlFor="disclaimer" className="text-xs text-ivory/70 leading-relaxed cursor-pointer">
                        I understand this app provides health information for awareness only, not medical diagnosis.
                     </label>
                  </div>
               )}

               {/* Submit Button */}
               <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-6"
               >
                  {loading ? (
                     <>
                        <div className="w-4 h-4 border-2 border-kurobeni/30 border-t-kurobeni rounded-full animate-spin"></div>
                        Processing...
                     </>
                  ) : (
                     activeTab === 'login' ? 'Sign In' : 'Create Account'
                  )}
               </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
               <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-copper/20"></div>
               </div>
               <div className="relative flex justify-center text-xs">
                  <span className="bg-blackberry/60 px-3 text-ivory/60">or continue</span>
               </div>
            </div>

            {/* Anonymous Login */}
            <button
               onClick={handleAnonymousLogin}
               disabled={loading}
               className="btn-outline w-full py-3 flex items-center justify-center gap-2"
            >
               <Heart className="w-4 h-4" />
               Continue as Guest
            </button>

            <p className="text-xs text-ivory/50 text-center mt-6">
               Your data stays private and secure
            </p>
         </div>
      </div>
   );
}
