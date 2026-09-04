import React, { useState } from 'react';
import { useRecovery } from '../context/RecoveryContext';
import {
  Zap,
  Globe,
  Bot,
  MessageSquare,
  BarChart3,
  Copy,
  Check,
  CheckCircle2,
  Shield,
  Lock,
  Send,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const { simulateEvent, showToast } = useRecovery();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState('agent.checkout.requested');

  const webhookEndpoint = 'https://demo.recoverai.app/events/payment';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    showToast('Simulated webhook URL copied to clipboard.');
  };

  const samplePayloads: Record<string, any> = {
    'agent.checkout.requested': {
      event: 'agent.checkout.requested',
      agent_id: 'agt_travel_204',
      agent_name: 'TravelMate-204',
      customer_alias: 'Customer T-204',
      order_id: 'ORD-77192',
      amount: 9800,
      currency: 'INR',
      payment_method: 'upi',
      category: 'Hotels & Travel',
      timestamp: new Date().toISOString(),
    },
    'payment.failed': {
      event: 'payment.failed',
      case_id: 'REC-10482',
      failure_code: 'UPI_TIMEOUT_U30',
      reason: 'Temporary bank switch timeout',
      amount: 4999,
      currency: 'INR',
      timestamp: new Date().toISOString(),
    },
    'agent.approval.required': {
      event: 'agent.approval.required',
      agent_id: 'agt_travel_204',
      requested_amount: 18000,
      authorized_limit: 12000,
      overrun_amount: 6000,
      reason: 'Agent cart expansion exceeds 15% deviation policy',
      timestamp: new Date().toISOString(),
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-main tracking-tight">
              Mock Event & Webhook Integrations
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint/15 text-mint border border-mint/30">
              SIMULATED WEBSOCKET CONNECTED
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Simulated payment webhooks, agent identity rails, and messaging connectors for prototype demonstration.
          </p>
        </div>
      </div>

      {/* Security Disclaimer Banner */}
      <div className="bg-surface border border-border rounded-2xl p-4.5 shadow-card flex items-start gap-3">
        <div className="p-2 rounded-xl bg-primary/15 text-primary-bright flex-shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div className="text-xs">
          <div className="font-semibold text-main">Demo Mode Synthetic Environment</div>
          <p className="text-muted leading-relaxed mt-0.5">
            Demo mode uses synthetic payment and agent events. Never paste production secrets, bank API credentials, or real customer card data into this prototype.
          </p>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-primary/15 text-primary-bright">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint/15 text-mint border border-mint/30">
              CONNECTED
            </span>
          </div>
          <h3 className="text-sm font-bold text-main">Payment Events Stream</h3>
          <p className="text-xs text-muted leading-relaxed">
            Ingests simulated payment authorizations, timeouts, insufficient balance flags, and delayed webhooks.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-mint/15 text-mint">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint/15 text-mint border border-mint/30">
              CONNECTED
            </span>
          </div>
          <h3 className="text-sm font-bold text-main">Agentic Checkout Gateway</h3>
          <p className="text-xs text-muted leading-relaxed">
            Validates autonomous shopping agent mTLS cryptographic signatures, spending bounds, and cart modifications.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-amber/15 text-amber">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mint/15 text-mint border border-mint/30">
              CONNECTED
            </span>
          </div>
          <h3 className="text-sm font-bold text-main">Customer Messaging Bus</h3>
          <p className="text-xs text-muted leading-relaxed">
            Simulates contextual WhatsApp, SMS, and Email delivery of 20-minute reservation recovery links.
          </p>
        </div>
      </div>

      {/* Webhook Endpoint & Event Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Endpoint Details */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-main pb-2 border-b border-border">
            Simulated Webhook Endpoint
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted font-mono text-[10px] uppercase block mb-1">
                Webhook Receiver URL (Simulated Sandbox Endpoint · Not a Live Public URL)
              </label>
              <div className="flex items-center gap-2 bg-surface-elevated p-2.5 rounded-xl border border-border">
                <span className="font-mono text-main flex-1 truncate text-xs">{webhookEndpoint}</span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1 text-primary-bright hover:underline text-xs"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-mint" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-muted font-mono text-[10px] uppercase block mb-1">
                Supported Event Types
              </label>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {[
                  'payment.failed',
                  'payment.authorized',
                  'payment.captured',
                  'payment.refunded',
                  'payment.pending',
                  'agent.checkout.requested',
                  'agent.authorization.failed',
                  'agent.approval.required',
                ].map((ev) => (
                  <button
                    key={ev}
                    type="button"
                    onClick={() => setSelectedEventType(ev)}
                    className={`px-2.5 py-1 rounded-lg border transition-colors ${
                      selectedEventType === ev
                        ? 'bg-primary/20 border-primary text-primary-bright font-bold'
                        : 'bg-surface-elevated border-border text-muted hover:text-main'
                    }`}
                  >
                    {ev}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payload Inspector & Test Dispatcher */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border mb-2">
              <span className="text-xs font-mono font-semibold text-primary-bright uppercase">
                Sample Event Payload Inspector
              </span>
              <button
                type="button"
                onClick={() => {
                  simulateEvent('upi_timeout');
                  showToast(`Test event '${selectedEventType}' dispatched.`);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary hover:bg-primary-bright text-white text-xs font-semibold shadow-glow-violet transition-all"
              >
                <Send className="w-3 h-3" />
                <span>Dispatch Test Event</span>
              </button>
            </div>

            <pre className="bg-[#050B14] p-3.5 rounded-xl border border-border text-[11px] font-mono text-[#A78BFA] overflow-x-auto leading-relaxed max-h-56">
{JSON.stringify(samplePayloads[selectedEventType] || samplePayloads['agent.checkout.requested'], null, 2)}
            </pre>
          </div>

          <div className="text-[11px] text-muted font-mono pt-1">
            Dispatching triggers the live decision engine and adds an event to the Live Agent stream.
          </div>
        </div>
      </div>

      {/* Production Requirements Guide */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-card space-y-3">
        <h3 className="text-sm font-bold text-main pb-2 border-b border-border">
          Production Architecture & Compliance Roadmap
        </h3>
        <p className="text-xs text-muted leading-relaxed">
          To transition this prototype into production-ready payment infrastructure, the following integrations and certifications would be integrated:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-surface-elevated p-3 rounded-xl border border-border space-y-1">
            <strong className="text-main block">1. Acquirer & Bank APIs</strong>
            <p className="text-muted leading-relaxed text-[11px]">
              Direct settlement webhook listeners, acquirer polling reconciliation APIs, and NPCI UPI auto-switch hooks.
            </p>
          </div>
          <div className="bg-surface-elevated p-3 rounded-xl border border-border space-y-1">
            <strong className="text-main block">2. Agent Registry mTLS</strong>
            <p className="text-muted leading-relaxed text-[11px]">
              Cryptographic X.509 client certificates and OAuth2.1 scoped token issuance for AI shopping agent clients.
            </p>
          </div>
          <div className="bg-surface-elevated p-3 rounded-xl border border-border space-y-1">
            <strong className="text-main block">3. PCI-DSS & Data Privacy</strong>
            <p className="text-muted leading-relaxed text-[11px]">
              Zero card data storage on server; tokenized vault handshakes; strict compliance with India DPDP Act 2023.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
