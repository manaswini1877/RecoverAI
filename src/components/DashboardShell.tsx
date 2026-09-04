import React, { useState, useEffect } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  LayoutDashboard,
  Bot,
  Shield,
  Layers,
  Activity,
  BarChart3,
  Sliders,
  Users,
  Zap,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Building2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { SimulationModal } from './SimulationModal';
import { CommandPalette } from './CommandPalette';

interface DashboardShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const { cases, resetDemoData } = useRecovery();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [dateRange, setDateRange] = useState('7 days');
  const [showNotifications, setShowNotifications] = useState(false);

  // Global Keyboard shortcuts: Ctrl+K / Cmd+K / D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (
        e.key.toLowerCase() === 'd' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
      ) {
        onNavigate('/demo');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNavigate]);

  const navLinks = [
    { label: 'Overview', path: '/app/overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      label: 'Agent Checkout',
      path: '/app/agent-checkout',
      icon: <Bot className="w-4 h-4" />,
      badge: 'Agentic',
      badgeColor: 'bg-primary/20 text-primary-bright border-primary/40',
    },
    { label: 'AI Agents', path: '/app/agents', icon: <Shield className="w-4 h-4" /> },
    {
      label: 'Payment Cases',
      path: '/app/cases',
      icon: <Layers className="w-4 h-4" />,
      count: cases.filter((c) => c.status === 'action_ready' || c.status === 'in_progress' || c.status === 'escalated').length,
    },
    {
      label: 'Live Agent',
      path: '/app/live-agent',
      icon: <Activity className="w-4 h-4" />,
      pulse: true,
    },
    { label: 'Analytics', path: '/app/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Customers', path: '/app/customers', icon: <Users className="w-4 h-4" /> },
    { label: 'Recovery Policies', path: '/app/policies', icon: <Sliders className="w-4 h-4" /> },
    { label: 'Integrations', path: '/app/integrations', icon: <Zap className="w-4 h-4" /> },
    { label: 'Settings', path: '/app/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const pendingApprovals = cases.filter((c) => c.status === 'escalated').length;

  return (
    <div className="flex h-screen bg-background text-main overflow-hidden font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-surface flex-shrink-0">
        {/* Workspace Switcher */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-dark via-primary to-primary-bright flex items-center justify-center text-white shadow-glow-violet font-bold text-sm">
                R
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight text-main flex items-center gap-1.5">
                  RecoverAI
                  <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-primary/20 text-primary-bright border border-primary/30">
                    DEMO
                  </span>
                </div>
                <div className="text-[11px] text-muted truncate max-w-[130px]">
                  Acme Commerce
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              title="View Public Landing Page"
              className="text-subtle hover:text-muted p-1 rounded-lg hover:bg-surface-elevated transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Guided Demo Shortcut Banner */}
        <div className="px-3 pt-3">
          <button
            type="button"
            onClick={() => onNavigate('/demo')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 hover:border-primary/60 transition-all text-left group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-bright animate-pulse" />
              <div>
                <div className="text-xs font-semibold text-main group-hover:text-primary-bright transition-colors">
                  Hackathon Demo
                </div>
                <div className="text-[10px] text-muted">TravelMate-204 Flow</div>
              </div>
            </div>
            <kbd className="text-[9px] font-mono bg-surface-highlight px-1.5 py-0.5 rounded border border-border text-muted">
              D
            </kbd>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] uppercase font-mono font-semibold text-muted tracking-wider">
            Merchant Operations
          </div>
          {navLinks.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/app/overview' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-surface-elevated text-primary-bright border border-primary/30 font-semibold shadow-sm'
                    : 'text-muted hover:text-main hover:bg-surface-elevated/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-primary-bright' : 'text-muted'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.pulse && (
                    <span className="w-1.5 h-1.5 rounded-full bg-mint animate-ping" />
                  )}
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber/20 text-amber border border-amber/30">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User / Workspace Footer */}
        <div className="p-3 border-t border-border bg-surface-elevated/30">
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-surface-highlight border border-border flex items-center justify-center font-mono font-bold text-xs text-primary-bright">
                AM
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-main truncate">Alex Morgan</div>
                <div className="text-[10px] text-muted truncate">Operations Lead</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-mint" title="Connected in Demo Mode" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-border bg-surface/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-20">
          {/* Left Title & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-muted hover:text-main rounded-lg hover:bg-surface-elevated"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted hidden sm:inline">Acme Commerce /</span>
              <h1 className="text-sm sm:text-base font-bold text-main tracking-tight">
                {navLinks.find((l) => currentPath.startsWith(l.path))?.label || 'Recovery Command Center'}
              </h1>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Palette Trigger */}
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-elevated border border-border hover:border-border-light rounded-xl text-xs text-muted hover:text-main transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search & Commands...</span>
              <kbd className="text-[10px] font-mono bg-surface px-1.5 py-0.5 rounded border border-border">
                ⌘K
              </kbd>
            </button>

            {/* Date Range Selector */}
            <div className="hidden md:flex items-center bg-surface-elevated border border-border rounded-xl p-0.5 text-xs font-medium">
              {['Today', '7 days', '30 days'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDateRange(range)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    dateRange === range
                      ? 'bg-surface text-main font-semibold shadow-sm'
                      : 'text-muted hover:text-main'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Currency Pill */}
            <span className="hidden sm:inline-flex text-[11px] font-mono font-medium px-2 py-1 rounded-lg bg-surface-elevated border border-border text-muted">
              INR (₹)
            </span>

            {/* Simulate Event Button */}
            <button
              type="button"
              onClick={() => setIsSimulatorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-bright text-white text-xs font-semibold shadow-glow-violet transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulate Event</span>
              <span className="sm:hidden">Simulate</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-muted hover:text-main rounded-xl hover:bg-surface-elevated border border-transparent hover:border-border transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {pendingApprovals > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-xl p-3 shadow-2xl z-50 text-xs">
                  <div className="font-semibold text-main pb-2 border-b border-border flex justify-between">
                    <span>Active Notifications</span>
                    <span className="text-[10px] text-muted">Demo Workspace</span>
                  </div>
                  <div className="py-2 space-y-2">
                    {pendingApprovals > 0 ? (
                      <div
                        onClick={() => {
                          onNavigate('/app/cases');
                          setShowNotifications(false);
                        }}
                        className="p-2 rounded-lg bg-amber/10 border border-amber/30 text-amber cursor-pointer hover:bg-amber/15"
                      >
                        <div className="font-semibold">Human Approval Pending</div>
                        <div className="text-[11px] text-muted mt-0.5">
                          {pendingApprovals} high-value or intent-drift case(s) need operator review.
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted text-center py-4">No critical alerts pending.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}

          {/* Prototype Synthetic Data Footer Notice */}
          <footer className="mt-12 pt-6 border-t border-border/60 text-center text-xs text-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              RecoverAI is an independent hackathon prototype demonstrating trust-aware agentic checkout and recovery using synthetic data.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={resetDemoData}
                className="text-subtle hover:text-coral flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Demo Workspace
              </button>
              <span>·</span>
              <span className="font-mono text-[10px]">Track 1: AI Growth & Agentic Commerce</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-64 bg-surface border-r border-border h-full flex flex-col p-4 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary text-white font-bold flex items-center justify-center text-xs">
                  R
                </div>
                <span className="font-bold text-sm text-main">RecoverAI</span>
              </div>
              <button onClick={() => setIsMobileOpen(false)} className="text-muted p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  onNavigate('/demo');
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-xl bg-primary/20 text-primary-bright font-semibold text-xs mb-3"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Guided Demo</span>
              </button>

              {navLinks.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs ${
                    currentPath.startsWith(item.path)
                      ? 'bg-surface-elevated text-primary-bright font-bold'
                      : 'text-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <SimulationModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSelectCase={(caseId) => onNavigate(`/app/cases/${caseId}`)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(route) => onNavigate(route)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />
    </div>
  );
};
