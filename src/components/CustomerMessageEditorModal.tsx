import React, { useState } from 'react';
import { PaymentCase } from '../types';
import { X, MessageSquare, Mail, Smartphone, Send, Check } from 'lucide-react';

interface CustomerMessageEditorModalProps {
  caseItem: PaymentCase | null;
  onClose: () => void;
  onSave: (message: { channel: 'whatsapp' | 'sms' | 'email'; subject?: string; body: string }) => void;
}

export const CustomerMessageEditorModal: React.FC<CustomerMessageEditorModalProps> = ({
  caseItem,
  onClose,
  onSave,
}) => {
  if (!caseItem) return null;

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'sms' | 'email'>(
    caseItem.messagePayload?.channel || 'whatsapp'
  );
  const [subject, setSubject] = useState(
    caseItem.messagePayload?.subject || 'Action Required: Complete your reserved order'
  );
  const [body, setBody] = useState(
    caseItem.messagePayload?.body ||
      `Hi ${caseItem.customerAlias}, your payment of ₹${caseItem.amount.toLocaleString(
        'en-IN'
      )} did not complete. Your order is safely reserved for 20 minutes. Click here to safely complete: https://pay.acme.demo/r/${caseItem.id.toLowerCase()}. We will not charge you twice.`
  );

  const handleSaveAndSend = () => {
    onSave({ channel: activeTab, subject, body });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-main p-1 rounded-lg hover:bg-surface-elevated transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pb-4 mb-5 border-b border-border">
          <div className="text-[10px] font-mono tracking-widest text-primary-bright uppercase font-semibold">
            Contextual Communication Center
          </div>
          <h3 className="text-xl font-bold text-main mt-0.5">
            Customer Recovery Communication
          </h3>
          <p className="text-xs text-muted mt-1">
            Trust-aware, non-manipulative copy prepared for {caseItem.customerAlias} ({caseItem.id}).
          </p>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-mint/15 border-mint/40 text-mint shadow-glow-mint'
                : 'bg-surface-elevated border-border text-muted hover:text-main'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sms')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              activeTab === 'sms'
                ? 'bg-primary/15 border-primary/40 text-primary-bright shadow-glow-violet'
                : 'bg-surface-elevated border-border text-muted hover:text-main'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            SMS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              activeTab === 'email'
                ? 'bg-amber/15 border-amber/40 text-amber'
                : 'bg-surface-elevated border-border text-muted hover:text-main'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>

        {/* Live Channel Mock Device Preview */}
        <div className="bg-surface-elevated border border-border rounded-xl p-4 mb-4">
          <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Live Device Preview</span>
            <span className="text-mint font-mono text-[10px]">No Double-Charge Disclaimer Included</span>
          </div>

          {activeTab === 'whatsapp' && (
            <div className="bg-[#0b141a] border border-[#202c33] rounded-lg p-3 max-w-md mx-auto font-sans text-xs shadow-inner">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[#202c33] text-[11px] text-[#8696a0]">
                <div className="w-6 h-6 rounded-full bg-mint/20 text-mint flex items-center justify-center font-bold text-[10px]">
                  AC
                </div>
                <span>Acme Commerce Verified · Official</span>
              </div>
              <div className="bg-[#005c4b] text-[#e9edef] p-3 rounded-lg rounded-tl-none leading-relaxed">
                {body}
                <div className="text-[9px] text-[#8696a0] text-right mt-1.5">10:43 AM · Delivered ✓✓</div>
              </div>
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-3 max-w-md mx-auto font-sans text-xs">
              <div className="text-[10px] text-zinc-400 text-center mb-2 font-mono">SMS · VM-ACMEPAY</div>
              <div className="bg-zinc-800 text-zinc-100 p-3 rounded-2xl rounded-bl-sm leading-relaxed">
                {body}
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="bg-surface border border-border rounded-lg p-4 font-sans text-xs space-y-2">
              <div className="border-b border-border pb-2 space-y-1">
                <div className="text-muted text-[11px]">
                  <strong className="text-main">From:</strong> checkout-recovery@acme.demo
                </div>
                <div className="text-muted text-[11px]">
                  <strong className="text-main">Subject:</strong> {subject}
                </div>
              </div>
              <div className="text-main leading-relaxed pt-2 whitespace-pre-wrap">{body}</div>
            </div>
          )}
        </div>

        {/* Message Editor Form */}
        <div className="space-y-3">
          {activeTab === 'email' && (
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs text-main focus:outline-none focus:border-primary"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-muted mb-1">Message Body</label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-surface-elevated border border-border rounded-lg p-3 text-xs text-main font-mono leading-relaxed focus:outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-muted hover:text-main rounded-xl hover:bg-surface-elevated transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndSend}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-bright text-white shadow-glow-violet transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Update & Ready Message
          </button>
        </div>
      </div>
    </div>
  );
};
