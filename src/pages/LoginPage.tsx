import React, { useState } from 'react';
import {
  Bot,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  User,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateHome }) => {
  const [selectedRole, setSelectedRole] = useState<'operations' | 'support' | 'admin'>('operations');
  const [email, setEmail] = useState('alex.morgan@acme.demo');

  const handleRoleSelect = (role: 'operations' | 'support' | 'admin') => {
    setSelectedRole(role);
    if (role === 'operations') setEmail('alex.morgan@acme.demo');
    if (role === 'support') setEmail('priya.sharma@acme.demo');
    if (role === 'admin') setEmail('karan.verma@acme.demo');
  };

  return (
    <div className="min-h-screen bg-background text-main flex flex-col justify-between font-sans selection:bg-primary/30">
      {/* Top Brand Bar */}
      <div className="p-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-dark via-primary to-primary-bright flex items-center justify-center text-white shadow-glow-violet font-bold text-sm">
            R
          </div>
          <span className="font-bold text-lg tracking-tight text-main group-hover:text-primary-bright transition-colors">
            RecoverAI
          </span>
        </button>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-muted">
          DEMO WORKSPACE LOGIN
        </span>
      </div>

      {/* Center Sign-in Box */}
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary-bright flex items-center justify-center mx-auto shadow-glow-violet">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-main">Merchant Operations Sign-In</h2>
            <p className="text-xs text-muted">
              Select an operator profile to access the RecoverAI command room in demo mode.
            </p>
          </div>

          {/* Quick Role Switcher */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-muted uppercase block font-semibold">
              Select Demo Role
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'operations', label: 'Operations', sub: 'Full access' },
                { id: 'support', label: 'Support', sub: 'Case review' },
                { id: 'admin', label: 'Risk Admin', sub: 'Policy rules' },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedRole === role.id
                      ? 'bg-primary/20 border-primary text-primary-bright font-bold shadow-glow-violet'
                      : 'bg-surface-elevated border-border text-muted hover:text-main'
                  }`}
                >
                  <div className="font-semibold text-main text-xs">{role.label}</div>
                  <div className="text-[9px] text-muted">{role.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted font-medium block mb-1">Operator Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-elevated border border-border rounded-xl pl-9 pr-3 py-2.5 text-main text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-muted font-medium block mb-1">Session Key (Demo Simulated)</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  disabled
                  value="demo_key_••••••••••••"
                  className="w-full bg-surface-elevated/60 border border-border rounded-xl pl-9 pr-3 py-2.5 text-muted text-xs font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-bright text-white font-bold text-xs shadow-glow-violet transition-all"
          >
            <span>Enter Demo Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <span className="text-[11px] text-muted">
              Pre-configured demo credentials · Zero real payment secrets required
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-subtle">
        RecoverAI is an independent hackathon prototype for Track 1: AI Growth & Agentic Commerce.
      </footer>
    </div>
  );
};
