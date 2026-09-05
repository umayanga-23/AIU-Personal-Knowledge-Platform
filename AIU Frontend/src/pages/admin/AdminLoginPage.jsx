import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, ShieldCheck, Globe, Settings, ArrowRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

export function AdminLoginPage() {
  const [username, setUsername] = useState('induwaraumayangaz04@gmail.com');
  const [password, setPassword] = useState('Azind2003##');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [destination, setDestination] = useState('dashboard'); // 'public' | 'dashboard'

  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(username, password);
      addToast('Authenticated successfully as Administrator!', 'success');
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (destination === 'public') {
      navigate('/');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#05070d] text-slate-100 font-sans">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {!isSuccess ? (
          <>
            {/* Login Form Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan border border-cyan-500/20 flex items-center justify-center mx-auto mb-3 shadow-glow-cyan">
                <Lock className="w-6 h-6 text-cyan" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Admin Portal Access</h1>
              <p className="text-xs font-mono text-slate-400">Knowledge Platform Control Center</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Admin Email / Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan hover:bg-cyan-dark text-slate-950 font-bold text-xs font-mono rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>
            </form>

            <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-center space-y-1">
              <p className="text-[11px] font-mono text-slate-400 font-bold">Admin Account Credentials:</p>
              <p className="text-[11px] font-mono text-cyan truncate">Email: <span className="text-slate-200">induwaraumayangaz04@gmail.com</span></p>
              <p className="text-[11px] font-mono text-cyan">Password: <span className="text-slate-200">Azind2003##</span></p>
            </div>
          </>
        ) : (
          /* Success Destination Selection Gateway Screen */
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2 shadow-glow-emerald">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Authentication Successful!</h2>
              <p className="text-xs font-mono text-emerald-400">Authorized as Administrator</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Select where you would like to start your session. The <span className="text-cyan font-bold">🛡️ Admin Panel button</span> will now be unlocked in the Navbar across the public site.
            </p>

            {/* Destination Selection Cards */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setDestination('dashboard')}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-3.5 ${
                  destination === 'dashboard'
                    ? 'bg-cyan-500/10 border-cyan text-white shadow-glow-cyan'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${destination === 'dashboard' ? 'bg-cyan text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                  <Settings className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold font-mono">Open Admin Dashboard</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Manage projects, research papers, technical notes, & skills.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDestination('public')}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-3.5 ${
                  destination === 'public'
                    ? 'bg-cyan-500/10 border-cyan text-white shadow-glow-cyan'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${destination === 'public' ? 'bg-cyan text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold font-mono">View Public Site (with Admin Button)</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">Explore the live portfolio site with unlocked Admin navigation.</p>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-3 bg-cyan hover:bg-cyan-dark text-slate-950 font-extrabold text-xs font-mono rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Selected Destination</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
