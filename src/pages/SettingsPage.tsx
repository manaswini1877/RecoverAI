import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Settings,
  Building2,
  Users,
  Bell,
  RotateCcw,
  Shield,
  CheckCircle2,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetDemoData, showToast } = useRecovery();
  const [workspaceName, setWorkspaceName] = useState('Acme Commerce');
  const [slackChannel, setSlackChannel] = useState('#payments-recoverai');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [overrunAlerts, setOverrunAlerts] = useState(true);

  const handleSave = () => {
    showToast('Workspace settings updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">
            Workspace & Demo Settings
          </h2>
          <p className="text-xs text-muted mt-1">
            Manage merchant profile, notification routing, and demo state parameters.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-bright text-white text-xs font-bold shadow-glow-violet transition-all w-fit"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Workspace Profile Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Building2 className="w-4 h-4 text-primary-bright" />
          <h3 className="text-sm font-bold text-main">Merchant Workspace Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-muted font-medium block mb-1">Merchant Name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-main text-xs focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-muted font-medium block mb-1">Settlement Currency</label>
            <input
              type="text"
              disabled
              value="INR (₹) — Indian Rupee"
              className="w-full bg-surface-elevated/50 border border-border rounded-xl px-3 py-2 text-muted text-xs cursor-not-allowed font-mono"
            />
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-bright" />
            <h3 className="text-sm font-bold text-main">Team & Operator Roles</h3>
          </div>
          <span className="text-[10px] font-mono text-muted">Demo Workspace Team</span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { name: 'Alex Morgan', role: 'Operations Lead (Current)', email: 'alex.morgan@acme.demo', status: 'Active' },
            { name: 'Priya Sharma', role: 'Customer Support Lead', email: 'priya.s@acme.demo', status: 'Active' },
            { name: 'Karan Verma', role: 'Fintech & Risk Analyst', email: 'karan.v@acme.demo', status: 'Active' },
          ].map((m, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border/60">
              <div>
                <div className="font-semibold text-main">{m.name}</div>
                <div className="text-[11px] text-muted">{m.email}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-primary-bright font-semibold">{m.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Routing */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Bell className="w-4 h-4 text-primary-bright" />
          <h3 className="text-sm font-bold text-main">Escalation & Overrun Alerts</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-muted font-medium block mb-1">Slack Channel for Escalations</label>
            <input
              type="text"
              value={slackChannel}
              onChange={(e) => setSlackChannel(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-xl px-3 py-2 text-main text-xs font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-main cursor-pointer">
              <input
                type="checkbox"
                checked={overrunAlerts}
                onChange={(e) => setOverrunAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span>Immediate alert on agent cart expansion &gt;15% (Intent Drift)</span>
            </label>
            <label className="flex items-center gap-2 text-main cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span>Daily recovered revenue summary digest</span>
            </label>
          </div>
        </div>
      </div>

      {/* Reset State & Disclaimers */}
      <div className="bg-surface border border-coral/30 rounded-2xl p-5 sm:p-6 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-coral font-bold text-sm">
          <RotateCcw className="w-4 h-4" />
          <span>Demo Data Management</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Reset all local storage records (cases, active agents, customer preferences, and event activity) back to default demo seed state.
        </p>
        <button
          type="button"
          onClick={resetDemoData}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coral/15 hover:bg-coral/25 border border-coral/40 text-coral text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Workspace Demo Data</span>
        </button>
      </div>
    </div>
  );
};
