import React, { useState } from 'react';
import {
  ShieldCheck,
  Bot,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lock,
  Layers,
  Scale,
  Activity,
  UserCheck,
  KeyRound,
  FileCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'agentic'>('agentic');

  return (
    <div className="min-h-screen bg-background text-main font-sans selection:bg-primary/30 selection:text-white">
      {/* Public Navbar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-dark via-primary to-primary-bright flex items-center justify-center text-white shadow-glow-violet font-bold text-sm">
              R
            </div>
            <div className="font-bold text-lg tracking-tight text-main flex items-center gap-2">
              RecoverAI
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary-bright border border-primary/30">
                PROTOTYPE
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted">
            <a href="#how-it-works" className="hover:text-main transition-colors">How It Works</a>
            <a href="#agentic-layer" className="hover:text-main transition-colors">Agent Trust Layer</a>
            <a href="#comparison" className="hover:text-main transition-colors">Why Not Blind Retries?</a>
            <a href="#differentiators" className="hover:text-main transition-colors">Capabilities</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/app/overview')}
              className="text-xs font-semibold px-3.5 py-2 text-muted hover:text-main rounded-xl hover:bg-surface-elevated transition-colors"
            >
              Merchant Ops
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/demo')}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-primary hover:bg-primary-bright text-white shadow-glow-violet transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-mint/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-primary/30 text-primary-bright text-xs font-mono font-medium mb-6 animate-float">
            <Bot className="w-3.5 h-3.5" />
            <span>TRUST-AWARE AGENTIC CHECKOUT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-main leading-[1.15] max-w-4xl mx-auto">
            Autonomous checkout needs a{' '}
            <span className="bg-gradient-to-r from-primary-bright via-primary to-mint bg-clip-text text-transparent">
              trust layer.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            RecoverAI helps merchants safely accept AI-agent-initiated payments, enforce spending intent, prevent duplicate charges, and recover interrupted checkouts.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/demo')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-bright text-white text-sm font-bold shadow-glow-violet transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch interactive demo</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/app/overview')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight border border-border text-main text-sm font-semibold transition-all"
            >
              <span>Explore merchant operations</span>
            </button>
          </div>

          {/* Interactive Hero Decision Widget */}
          <div className="mt-14 max-w-3xl mx-auto text-left">
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-mint animate-ping" />
                  <span className="text-xs font-mono font-semibold text-main">
                    LIVE RECOVERY & INTENT STREAM
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-elevated border border-border text-muted">
                  Protected by Recovery Constitution v1.4
                </span>
              </div>

              {/* Sample Event Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-surface-elevated p-3 rounded-xl border border-border/60">
                  <span className="text-[10px] text-muted font-mono uppercase block">Initiating Agent</span>
                  <div className="font-bold text-main mt-0.5 flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-primary-bright" />
                    TravelMate-204
                  </div>
                  <div className="text-[11px] text-muted mt-1">₹9,800 hotel checkout</div>
                </div>

                <div className="bg-surface-elevated p-3 rounded-xl border border-border/60">
                  <span className="text-[10px] text-muted font-mono uppercase block">Agent Verification</span>
                  <div className="font-bold text-mint mt-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-mint" />
                    Trust Score: 88/100
                  </div>
                  <div className="text-[11px] text-muted mt-1">Scope: Hotels (≤₹12k)</div>
                </div>

                <div className="bg-surface-elevated p-3 rounded-xl border border-border/60">
                  <span className="text-[10px] text-muted font-mono uppercase block">Safety Evaluation</span>
                  <div className="font-bold text-main mt-0.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mint" />
                    Duplicate Risk: 4%
                  </div>
                  <div className="text-[11px] text-muted mt-1">Failure: UPI Timeout</div>
                </div>

                <div className="bg-primary/10 p-3 rounded-xl border border-primary/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-primary-bright font-mono uppercase block">Decision</span>
                    <div className="font-bold text-primary-bright mt-0.5">Safe Alternate Link</div>
                  </div>
                  <div className="text-[10px] text-muted font-mono mt-1">10m cooldown buffer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="py-10 bg-surface/50 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-extrabold font-mono text-mint">₹1.86L</div>
              <div className="text-xs text-muted mt-1 font-medium">Recovered Revenue</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-extrabold font-mono text-main">60.2%</div>
              <div className="text-xs text-muted mt-1 font-medium">Recovery Success Rate</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-extrabold font-mono text-amber">27</div>
              <div className="text-xs text-muted mt-1 font-medium">Duplicate Debits Prevented</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-extrabold font-mono text-primary-bright">₹42,000</div>
              <div className="text-xs text-muted mt-1 font-medium">Out-of-Scope Agent Drift Blocked</div>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-[11px] font-mono text-subtle">
              Illustrative synthetic demo workspace data · Zero real payment credentials required
            </span>
          </div>
        </div>
      </section>

      {/* 4-Step "How It Works" Section */}
      <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold text-primary-bright uppercase tracking-wider">
            Agentic Checkout Pipeline
          </span>
          <h2 className="text-3xl font-bold text-main mt-2">How RecoverAI Protects and Converts</h2>
          <p className="text-sm text-muted mt-3">
            Every autonomous checkout flows through a deterministic trust layer before any payment action is authorized or retried.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-bright flex items-center justify-center font-bold font-mono text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-main">Verify</h3>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Confirm who or what initiated checkout. Validate agent cryptographic signatures, API keys, and historical trust scores.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-mint/10 text-mint flex items-center justify-center font-bold font-mono text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-main">Scope</h3>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Enforce strict spending ceilings, authorized product categories, valid time windows, and cart modification percentages (&lt;15%).
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber/10 text-amber flex items-center justify-center font-bold font-mono text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-main">Protect</h3>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Execute a 5-point safety check to detect duplicate debit signals, delayed webhooks, bank outages, and unapproved intent drift.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-bright flex items-center justify-center font-bold font-mono text-sm mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-main">Recover</h3>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Select the safest next-best action—alternate UPI link, card tokenization update, gentle reminder, or human operator escalation.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Differentiators */}
      <section id="differentiators" className="py-20 bg-surface/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold text-mint uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-bold text-main mt-2">Engineered for Safe Agentic Commerce</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="p-2.5 rounded-xl bg-primary/15 text-primary-bright w-fit mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-main">Agent Identity & Trust Scoring</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Dynamic 0–100 trust scores calculated from historical transactions, velocity risk, and identity verification.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="p-2.5 rounded-xl bg-mint/15 text-mint w-fit mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-main">Duplicate-Charge Protection</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Never blindly retries failed payments. Validates ledger signals and webhook reconciliation before dispatching links.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="p-2.5 rounded-xl bg-amber/15 text-amber w-fit mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-main">Intent Drift & Overrun Gates</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Automatically blocks checkout expansion when autonomous agents attempt unapproved cart amount increases.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="p-2.5 rounded-xl bg-primary/15 text-primary-bright w-fit mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-main">Next-Best-Action Engine</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Tailors recovery strategy by failure root cause: 10m buffer for UPI timeouts, tokenization links for expired cards.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="p-2.5 rounded-xl bg-mint/15 text-mint w-fit mb-4">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-main">Human-in-the-Loop Workflow</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Mandates operator sign-off for high-value carts (&gt;₹25,000) or low-confidence decisions while automating routine cases.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="p-2.5 rounded-xl bg-amber/15 text-amber w-fit mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-main">Auditable Agent Action Receipts</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Generates verifiable receipts detailing original amounts, safeguards applied, retries avoided, and decision confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section id="comparison" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold text-primary-bright uppercase tracking-wider">
            Clear Contrast
          </span>
          <h2 className="text-3xl font-bold text-main mt-2">Traditional Checkout vs. RecoverAI</h2>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-elevated">
                <th className="p-4 font-semibold text-muted w-1/3">Capability</th>
                <th className="p-4 font-semibold text-coral/90 w-1/3">Traditional Checkout</th>
                <th className="p-4 font-semibold text-mint w-1/3">RecoverAI Trust Layer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-4 font-medium text-main">Agent Identification</td>
                <td className="p-4 text-muted">Treats every payment attempt equally</td>
                <td className="p-4 text-main font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                  Verifies initiating agent & trust score
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-main">Spending Authorization</td>
                <td className="p-4 text-muted">Does not understand agent authorization scope</td>
                <td className="p-4 text-main font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                  Enforces amount, category, and time caps
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-main">Failure Handling</td>
                <td className="p-4 text-muted">Blindly retries failures immediately</td>
                <td className="p-4 text-main font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                  Chooses whether, when, and how to recover
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-main">Duplicate Charge Risk</td>
                <td className="p-4 text-muted">Risks charging customer twice on delayed webhooks</td>
                <td className="p-4 text-main font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                  Runs 5-point payment safety check
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-main">Intent Drift Protection</td>
                <td className="p-4 text-muted">Unsafe autonomous price hikes may pass</td>
                <td className="p-4 text-main font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                  Blocks cart modification &gt;15% for human review
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Final High Impact CTA */}
      <section className="py-20 bg-gradient-to-b from-transparent to-surface-elevated/40 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-main tracking-tight">
            Turn payment failure into a safe recovery decision.
          </h2>
          <p className="mt-4 text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Experience the full TravelMate-204 agentic checkout recovery simulation in the 5-step guided hackathon demo.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate('/demo')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primary-bright text-white font-bold shadow-glow-violet transition-all text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore the live demo now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
