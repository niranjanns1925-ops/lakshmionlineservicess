// src/pages/Login.tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Logo } from '../components/Logo';

export function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (role: 'Admin' | 'User') => {
    setLoading(true);
    setError(null);
    try {
      await login(role);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.message?.includes('popup-closed-by-user')) {
        // Log it but don't show a scary error to the user as they initiated it
        console.log('Login popup was closed by user');
      } else {
        setError('Authentication failed. Please try again.');
        console.error('Login Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#fdfdfb] overflow-y-auto">
      {/* Hero Panel */}
      <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-primary to-[#03140f] p-12 lg:p-24 flex-col justify-center relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl -ml-48 -mb-48" />
        
        {/* Decorative Grid Pinlines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 max-w-xl"
        >
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-10 border border-white/20 shadow-2xl">
            <Logo size={40} variant="light" />
          </div>
          
          <h1 className="text-white text-5xl lg:text-7xl font-bold font-serif mb-6 leading-[1.1] tracking-tight">
            Trusted <span className="text-accent italic">Governance</span> <br />Digital Empowerment.
          </h1>
          <p className="text-white/60 text-lg lg:text-xl font-medium max-w-md leading-relaxed">
            Lakshmi E-Sevai Maiyam — Bridging the digital divide with secure, efficient, and dignified public service delivery.
          </p>
        </motion.div>

        {/* Floating Stat Decorations */}
        <div className="absolute bottom-24 right-24 hidden xl:block">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] text-white shadow-2xl"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] font-extrabold opacity-60 mb-2">Service Excellence</p>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-serif font-black text-accent">99.9%</p>
              <p className="text-sm font-bold opacity-60">Uptime</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Login Card Panel */}
      <div className="w-full lg:w-[500px] flex items-center justify-center p-8 lg:p-12 bg-[#fdfdfb] relative min-h-screen">
        <div className="absolute top-0 right-0 p-10">
           <Logo size={32} className="opacity-10 lg:opacity-5" />
        </div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-md py-12"
        >
          <div className="mb-12 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="lg:hidden mb-8">
               <Logo size={64} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary mb-3">Service Gateway</h2>
            <p className="text-muted font-medium text-sm">Welcome to the Lakshmi E-Sevai Maiyam digital hub.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-5">
            <button
              id="userLoginBtn"
              onClick={() => handleLogin('User')}
              disabled={loading}
              className="w-full group bg-white border-2 border-border p-8 rounded-[32px] flex items-center gap-6 transition-all duration-500 hover:border-primary hover:shadow-[0_20px_50px_rgba(6,95,70,0.1)] disabled:opacity-50"
            >
              <div className="w-16 h-16 rounded-[20px] bg-surface-alt flex items-center justify-center font-bold text-3xl group-hover:bg-primary/5 transition-colors">🇮🇳</div>
              <div className="text-left">
                <p className="font-bold text-lg text-primary group-hover:text-primary mb-0.5">{loading ? 'Connecting...' : 'Citizen Access'}</p>
                <p className="text-xs text-muted font-bold uppercase tracking-wider">Public Services Hub</p>
              </div>
              <div className="ml-auto text-muted group-hover:text-primary transition-transform duration-500 group-hover:translate-x-2">→</div>
            </button>

            <button
              id="adminLoginBtn"
              onClick={() => handleLogin('Admin')}
              disabled={loading}
              className="w-full group bg-white border-2 border-border p-8 rounded-[32px] flex items-center gap-6 transition-all duration-500 hover:border-accent hover:shadow-[0_20px_50px_rgba(251,191,36,0.1)] disabled:opacity-50"
            >
              <div className="w-16 h-16 rounded-[20px] bg-surface-alt flex items-center justify-center font-bold text-3xl group-hover:bg-accent/5 transition-colors">🏢</div>
              <div className="text-left">
                <p className="font-bold text-lg text-primary group-hover:text-accent mb-0.5">{loading ? 'Connecting...' : 'Officer Portal'}</p>
                <p className="text-xs text-muted font-bold uppercase tracking-wider">Governance Mgmt</p>
              </div>
              <div className="ml-auto text-muted group-hover:text-accent transition-transform duration-500 group-hover:translate-x-2">→</div>
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-border/50 text-center flex flex-col items-center gap-4">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <p className="text-[10px] text-muted font-bold uppercase tracking-[0.3em]">Institutional Grade Encryption</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
