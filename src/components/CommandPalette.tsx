import React, { useState, useEffect } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Search,
  Zap,
  LayoutDashboard,
  Bot,
  Layers,
  Activity,
  Sliders,
  Users,
  Settings,
  Shield,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onOpenSimulator: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSimulator,
}) => {
  const { cases, resetDemoData } = useRecovery();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // toggle handled by parent or opened
      }
      if (e.key.toLowerCase() === 'd' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        // shortcut D to jump to demo
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const navItems = [
    { label: 'Guided Hackathon Demo (TravelMate-204)', route: '/demo', icon: <Sparkles className="w-4 h-4 text-primary-bright" />, category: 'Quick Jump' },
    { label: 'Recovery Command Center Overview', route: '/app/overview', icon: <LayoutDashboard className="w-4 h-4 text-main" />, category: 'Navigation' },
    { label: 'Agentic Checkout Monitoring', route: '/app/agent-checkout', icon: <Bot className="w-4 h-4 text-primary-bright" />, category: 'Navigation' },
    { label: 'AI Agent Registry & Trust Controls', route: '/app/agents', icon: <Shield className="w-4 h-4 text-mint" />, category: 'Navigation' },
    { label: 'Failed-Payment Case Queue', route: '/app/cases', icon: <Layers className="w-4 h-4 text-main" />, category: 'Navigation' },
    { label: 'Live Agent Activity Stream', route: '/app/live-agent', icon: <Activity className="w-4 h-4 text-amber" />, category: 'Navigation' },
    { label: 'Revenue & Agentic Analytics', route: '/app/analytics', icon: <Activity className="w-4 h-4 text-mint" />, category: 'Navigation' },
    { label: 'Recovery Constitution & Policies', route: '/app/policies', icon: <Sliders className="w-4 h-4 text-primary-bright" />, category: 'Navigation' },
    { label: 'Customer Recovery Profiles', route: '/app/customers', icon: <Users className="w-4 h-4 text-main" />, category: 'Navigation' },
    { label: 'Mock Webhook & Event Integrations', route: '/app/integrations', icon: <Zap className="w-4 h-4 text-amber" />, category: 'Navigation' },
    { label: 'Workspace & Demo Settings', route: '/app/settings', icon: <Settings className="w-4 h-4 text-muted" />, category: 'Navigation' },
    { label: 'Public Marketing Landing Page', route: '/', icon: <Sparkles className="w-4 h-4 text-muted" />, category: 'Navigation' },
  ];

  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const matchedCases = cases
    .filter(
      (c) =>
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.customerAlias.toLowerCase().includes(query.toLowerCase()) ||
        c.failureType.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-surface-elevated">
          <Search className="w-5 h-5 text-muted" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, page name, or case ID (e.g. REC-10482)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-main placeholder-muted focus:outline-none"
          />
          <kbd className="text-[10px] font-mono bg-surface px-2 py-0.5 rounded border border-border text-muted">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {/* Quick Actions */}
          <div className="px-3 py-1 text-[10px] uppercase font-mono font-semibold text-muted">
            Quick Actions
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSimulator();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-main hover:bg-surface-elevated transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-primary-bright" />
              <span>Simulate Payment Failure Event</span>
            </div>
            <span className="text-[10px] font-mono text-muted">Action</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetDemoData();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-coral hover:bg-coral/10 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-coral" />
              <span>Reset Demo Workspace Data</span>
            </div>
            <span className="text-[10px] font-mono text-coral/80">Reset</span>
          </button>

          {/* Navigation Items */}
          <div className="px-3 pt-3 py-1 text-[10px] uppercase font-mono font-semibold text-muted">
            Pages & Views
          </div>
          {filteredNav.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onNavigate(item.route);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-main hover:bg-surface-elevated transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100" />
            </button>
          ))}

          {/* Cases Search */}
          {matchedCases.length > 0 && (
            <>
              <div className="px-3 pt-3 py-1 text-[10px] uppercase font-mono font-semibold text-muted">
                Payment Cases
              </div>
              {matchedCases.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onNavigate(`/app/cases/${c.id}`);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-main hover:bg-surface-elevated transition-colors font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary-bright font-bold">{c.id}</span>
                    <span className="text-muted">· {c.customerAlias} · ₹{c.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="text-[10px] text-muted capitalize">{c.status.replace('_', ' ')}</span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-surface-elevated flex items-center justify-between text-[11px] text-muted">
          <span>Navigation: <kbd className="font-mono bg-surface px-1.5 py-0.5 rounded border border-border">↑</kbd> <kbd className="font-mono bg-surface px-1.5 py-0.5 rounded border border-border">↓</kbd></span>
          <span>Shortcut: <kbd className="font-mono bg-surface px-1.5 py-0.5 rounded border border-border">D</kbd> for demo mode</span>
        </div>
      </div>
    </div>
  );
};
