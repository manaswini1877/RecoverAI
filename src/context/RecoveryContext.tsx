import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PaymentCase,
  AgentTrustProfile,
  CustomerProfile,
  RecoveryPolicy,
  LiveEventStreamItem,
  AgentActionReceipt,
  AnalyticsSummary,
} from '../types';
import {
  INITIAL_PAYMENT_CASES,
  SEED_CUSTOMERS,
  INITIAL_ACTIVITY_STREAM,
} from '../data/seedData';
import { INITIAL_AGENTS } from '../services/AgentTrustService';
import { DEFAULT_RECOVERY_POLICY, RecoveryPolicyService } from '../services/RecoveryPolicyService';
import { RecoveryDecisionEngine } from '../services/RecoveryDecisionEngine';
import { AgentCheckoutService } from '../services/AgentCheckoutService';
import confetti from 'canvas-confetti';

interface RecoveryContextType {
  cases: PaymentCase[];
  agents: AgentTrustProfile[];
  customers: CustomerProfile[];
  policy: RecoveryPolicy;
  activityStream: LiveEventStreamItem[];
  analytics: AnalyticsSummary;
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  // Actions
  simulateEvent: (type: 'upi_timeout' | 'card_expired' | 'insufficient_balance' | 'bank_outage' | 'webhook_delay' | 'duplicate_debit' | 'agent_amount_increase' | 'customer_abandoned' | 'high_value_failure' | 'customer_paid' | 'customer_ignored') => PaymentCase | void;
  approveAction: (caseId: string) => void;
  pauseAction: (caseId: string) => void;
  escalateAction: (caseId: string) => void;
  rejectAction: (caseId: string) => void;
  markRecovered: (caseId: string) => void;
  completeDemoSafeRecovery: () => AgentActionReceipt;
  updatePolicy: (updates: Partial<RecoveryPolicy>) => void;
  updateAgent: (agentId: string, updates: Partial<AgentTrustProfile>) => void;
  updateCustomer: (customerId: string, updates: Partial<CustomerProfile>) => void;
  resetDemoData: () => void;
  exportReceiptJSON: (receipt: AgentActionReceipt) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const RecoveryContext = createContext<RecoveryContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  CASES: 'recoverai_cases_v1',
  AGENTS: 'recoverai_agents_v1',
  CUSTOMERS: 'recoverai_customers_v1',
  POLICY: 'recoverai_policy_v1',
  ACTIVITY: 'recoverai_activity_v1',
};

export const RecoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<PaymentCase[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CASES);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_CASES;
  });

  const [agents, setAgents] = useState<AgentTrustProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.AGENTS);
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : SEED_CUSTOMERS;
  });

  const [policy, setPolicy] = useState<RecoveryPolicy>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.POLICY);
    return saved ? JSON.parse(saved) : DEFAULT_RECOVERY_POLICY;
  });

  const [activityStream, setActivityStream] = useState<LiveEventStreamItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVITY);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_STREAM;
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CASES, JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AGENTS, JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.POLICY, JSON.stringify(policy));
  }, [policy]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVITY, JSON.stringify(activityStream));
  }, [activityStream]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Dynamic analytics calculation
  const analytics: AnalyticsSummary = React.useMemo(() => {
    let recoverableRevenue = 0;
    const baseRecoveredRevenue = 186500;
    let dynamicRecovered = 0;
    let trustIncidentsPrevented = 27;
    let outOfScopeBlockedAmount = 42000;
    let recoveredCount = 0;
    let agentCheckouts = 0;
    let agentRecovered = 0;
    let humanApprovalsPending = 0;

    cases.forEach((c) => {
      if (c.status === 'recovered') {
        recoveredCount++;
        if (c.id !== 'REC-10492') {
          dynamicRecovered += (c.originalAuthorizedAmount || c.amount);
        }
        if (c.initiatedBy !== 'human') {
          agentRecovered += (c.originalAuthorizedAmount || c.amount);
        }
      } else if (c.status !== 'blocked' && c.status !== 'expired') {
        recoverableRevenue += c.amount;
      }

      if (c.status === 'blocked' && c.failureType === 'duplicate_debit') {
        trustIncidentsPrevented++;
      }
      if (c.status === 'blocked' && c.failureType === 'agent_scope_exceeded') {
        outOfScopeBlockedAmount += (c.requestedAmount || c.amount) - (c.originalAuthorizedAmount || 0);
      }
      if (c.status === 'escalated') {
        humanApprovalsPending++;
      }
      if (c.initiatedBy !== 'human') {
        agentCheckouts++;
      }
    });

    const totalActionable = cases.filter((c) => c.status !== 'expired').length;
    const dynamicRate = dynamicRecovered > 0 ? Math.min(99.9, Number((60.2 + (dynamicRecovered / 1000)).toFixed(1))) : 60.2;
    const agentCheckoutConversion = agentCheckouts > 0 ? Number(((agentRecovered / (agentCheckouts * 9000)) * 100).toFixed(1)) : 74.5;

    return {
      recoverableRevenue: Math.max(recoverableRevenue, 310000),
      recoveredRevenue: baseRecoveredRevenue + dynamicRecovered,
      recoveryRate: dynamicRate,
      trustIncidentsPrevented,
      avgRecoveryTimeMinutes: 8.2,
      outOfScopeBlockedAmount,
      agentCheckoutVolume: agentCheckouts,
      agentCheckoutConversion: 78.4,
      humanApprovalsPending,
    };
  }, [cases]);

  // Simulator Engine
  const simulateEvent = (
    type:
      | 'upi_timeout'
      | 'card_expired'
      | 'insufficient_balance'
      | 'bank_outage'
      | 'webhook_delay'
      | 'duplicate_debit'
      | 'agent_amount_increase'
      | 'customer_abandoned'
      | 'high_value_failure'
      | 'customer_paid'
      | 'customer_ignored'
  ): PaymentCase | void => {
    const timestamp = 'Just now';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCaseId = `REC-${randomNum}`;

    if (type === 'customer_paid') {
      // Find latest pending or active case and mark recovered
      const targetCase = cases.find((c) => c.status === 'action_ready' || c.status === 'in_progress' || c.id === 'REC-10482');
      if (targetCase) {
        markRecovered(targetCase.id);
        return;
      }
    }

    if (type === 'customer_ignored') {
      const targetCase = cases.find((c) => c.status === 'action_ready' || c.status === 'in_progress');
      if (targetCase) {
        setCases((prev) =>
          prev.map((c) =>
            c.id === targetCase.id
              ? {
                  ...c,
                  status: 'expired',
                  updatedAt: new Date().toISOString(),
                  timeline: [
                    ...c.timeline,
                    {
                      id: `tl-${Date.now()}`,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      stage: 'Link Expired',
                      description: 'Customer did not complete checkout within 20m reservation window. Cart released.',
                      status: 'warning',
                      actor: 'RecoverAI Agent',
                    },
                  ],
                }
              : c
          )
        );
        showToast(`Case ${targetCase.id} expired: Reservation window closed.`);
        return;
      }
    }

    if (type === 'agent_amount_increase') {
      const agent = agents.find((a) => a.agentId === 'agt_travel_204') || agents[0];
      const caseItem: PaymentCase = {
        id: newCaseId,
        workspaceId: 'ws_acme_commerce',
        customerAlias: 'Customer T-204',
        customerId: 'cust_t204',
        orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        amount: 18000,
        currency: 'INR',
        paymentMethod: 'UPI',
        failureType: 'agent_scope_exceeded',
        status: 'blocked',
        initiatedBy: 'travel_agent',
        agentId: agent.agentId,
        agentName: agent.agentName,
        agentIntent: 'Upgrade room to luxury suite and add airport limousine',
        authorizationScope: ['Hotels & Travel', 'Max ₹12,000 limit'],
        originalAuthorizedAmount: 9800,
        requestedAmount: 18000,
        category: 'Hotels & Travel',
        decision: {
          caseId: newCaseId,
          customerIntent: 88,
          agentTrustScore: agent.trustScore,
          intentMatch: 65,
          recoverability: 60,
          duplicateChargeRisk: 4,
          authorizationCompliant: false,
          intentDriftDetected: true,
          recommendedAction: 'AGENT CHECKOUT BLOCKED: Requested amount (₹18,000) exceeds authorized limit (₹12,000). Human approval required.',
          actionKey: 'block_agent_scope',
          delayMinutes: 0,
          channel: 'in_app',
          maxAttempts: 0,
          confidence: 94,
          explanation: `TravelMate-204 attempted to increase checkout amount from ₹9,800 to ₹18,000 (+83.7% deviation). Maximum authorized limit is ₹12,000. Autonomous charge blocked.`,
          safetyChecks: [
            { name: 'Agent Identity Verified', passed: true, description: 'Cryptographic signature valid.', severity: 'low' },
            { name: 'Amount Within Limit', passed: false, description: '₹18,000 exceeds ₹12,000 ceiling by ₹6,000.', severity: 'critical' },
            { name: 'Intent Drift (<15%)', passed: false, description: '+83.7% deviation flagged as out-of-scope drift.', severity: 'critical' },
            { name: 'Category Match', passed: true, description: 'Hotels & Travel authorized.', severity: 'low' },
            { name: 'Human Sign-off Required', passed: false, description: 'Mandatory operator approval gated.', severity: 'high' },
          ],
          status: 'blocked',
          policyVersion: policy.id,
          createdAt: new Date().toISOString(),
        },
        timeline: [
          {
            id: `tl-1-${Date.now()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            stage: 'Agent Scope Expansion Attempted',
            description: 'TravelMate-204 requested cart amount increase to ₹18,000.',
            status: 'warning',
            actor: 'TravelMate-204',
          },
          {
            id: `tl-2-${Date.now()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            stage: 'Autonomous Charge Blocked',
            description: 'Constitution Safeguard: Amount overrun of ₹6,000 blocked. Human approval required.',
            status: 'error',
            actor: 'RecoverAI Trust Layer',
          },
        ],
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor: 'Trust Layer',
            action: 'SCOPE_VIOLATION_BLOCKED',
            details: 'Blocked autonomous payment above ₹12,000 ceiling.',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCases((prev) => [caseItem, ...prev]);
      setActivityStream((prev) => [
        {
          id: `evt-${Date.now()}`,
          timestamp,
          type: 'ACTION_BLOCKED',
          caseId: newCaseId,
          agentName: agent.agentName,
          customerAlias: 'Customer T-204',
          title: 'Agent Amount Increase Blocked (₹18,000)',
          details: 'TravelMate-204 requested amount exceeded ₹12,000 limit by ₹6,000. Human approval required.',
          severity: 'critical',
          amount: 18000,
          badge: 'SCOPE_OVERRUN',
        },
        ...prev,
      ]);

      showToast(`⚠️ AGENT CHECKOUT BLOCKED: TravelMate-204 requested ₹18,000 (exceeds ₹12,000 limit).`);
      return caseItem;
    }

    // Standard failure types
    const mapping: Record<string, { amount: number; method: PaymentCase['paymentMethod']; failType: PaymentCase['failureType']; initiatedBy: PaymentCase['initiatedBy']; alias: string; agent?: AgentTrustProfile }> = {
      upi_timeout: {
        amount: 4999,
        method: 'UPI',
        failType: 'temporary_bank_timeout',
        initiatedBy: 'shopping_agent',
        alias: 'Customer A-104',
        agent: agents[0],
      },
      card_expired: {
        amount: 12500,
        method: 'Credit Card',
        failType: 'card_expired',
        initiatedBy: 'human',
        alias: 'Customer B-219',
      },
      insufficient_balance: {
        amount: 2499,
        method: 'UPI',
        failType: 'insufficient_balance',
        initiatedBy: 'human',
        alias: 'Customer C-882',
      },
      bank_outage: {
        amount: 15000,
        method: 'Debit Card',
        failType: 'bank_outage',
        initiatedBy: 'human',
        alias: 'Customer E-309',
      },
      webhook_delay: {
        amount: 8200,
        method: 'NetBanking',
        failType: 'webhook_delay',
        initiatedBy: 'human',
        alias: 'Customer D-511',
      },
      duplicate_debit: {
        amount: 6800,
        method: 'UPI',
        failType: 'duplicate_debit',
        initiatedBy: 'shopping_agent',
        alias: 'Customer G-108',
        agent: agents[1],
      },
      customer_abandoned: {
        amount: 1299,
        method: 'UPI',
        failType: 'customer_abandoned',
        initiatedBy: 'human',
        alias: 'Customer F-991',
      },
      high_value_failure: {
        amount: 42000,
        method: 'Credit Card',
        failType: 'high_value_failure',
        initiatedBy: 'procurement_agent',
        alias: 'Customer H-741',
        agent: agents[2],
      },
    };

    const config = mapping[type] || mapping.upi_timeout;
    const decision = RecoveryDecisionEngine.evaluateCase({
      caseId: newCaseId,
      amount: config.amount,
      failureType: config.failType,
      paymentMethod: config.method,
      customerAlias: config.alias,
      initiatedBy: config.initiatedBy,
      agentProfile: config.agent,
      policy,
    });

    const newCase: PaymentCase = {
      id: newCaseId,
      workspaceId: 'ws_acme_commerce',
      customerAlias: config.alias,
      customerId: `cust_${Math.floor(100 + Math.random() * 900)}`,
      orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      amount: config.amount,
      currency: 'INR',
      paymentMethod: config.method,
      failureType: config.failType,
      status: decision.status === 'blocked' ? 'blocked' : decision.status === 'escalated' ? 'escalated' : 'action_ready',
      initiatedBy: config.initiatedBy,
      agentId: config.agent?.agentId,
      agentName: config.agent?.agentName,
      agentIntent: config.agent ? `Autonomous order checkout for ${config.alias}` : undefined,
      category: config.agent ? config.agent.allowedCategories[0] : undefined,
      decision,
      timeline: [
        {
          id: `tl-1-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 'Payment Interrupted',
          description: `Transaction of ₹${config.amount.toLocaleString('en-IN')} failed via ${config.method}.`,
          status: 'warning',
          actor: 'Payment Gateway',
        },
        {
          id: `tl-2-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: 'AI Diagnosis & Safety Check',
          description: decision.explanation,
          status: decision.status === 'blocked' ? 'error' : 'completed',
          actor: 'RecoverAI Engine',
        },
      ],
      messagePayload: {
        channel: decision.channel === 'email' ? 'email' : 'whatsapp',
        body: `Hi ${config.alias}, your payment of ₹${config.amount.toLocaleString('en-IN')} was paused. Complete securely: https://pay.acme.demo/r/${newCaseId.toLowerCase()}`,
        status: 'ready',
      },
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'Simulator',
          action: 'EVENT_INJECTED',
          details: `Simulated ${config.failType} payment event.`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCases((prev) => [newCase, ...prev]);
    setActivityStream((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp,
        type: decision.status === 'blocked' ? 'ACTION_BLOCKED' : 'ACTION_PREPARED',
        caseId: newCaseId,
        agentName: config.agent?.agentName,
        customerAlias: config.alias,
        title: `${config.failType.replace(/_/g, ' ').toUpperCase()} Diagnosed`,
        details: decision.recommendedAction,
        severity: decision.status === 'blocked' ? 'critical' : 'info',
        amount: config.amount,
        confidence: decision.confidence,
        badge: decision.status === 'blocked' ? 'SAFETY_BLOCK' : 'AI_RECOMMENDATION',
      },
      ...prev,
    ]);

    showToast(`Payment event simulated: ${newCase.id} (${config.failType})`);
    return newCase;
  };

  const approveAction = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const updatedTimeline = [
            ...c.timeline,
            {
              id: `tl-${Date.now()}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              stage: 'Human Operator Approved',
              description: 'Operator manually approved and dispatched recovery action.',
              status: 'completed' as const,
              actor: 'Alex Morgan (Operations)',
            },
          ];
          return {
            ...c,
            status: 'in_progress' as const,
            timeline: updatedTimeline,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    showToast(`Case ${caseId}: Recovery action approved and dispatched.`);
  };

  const pauseAction = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: 'paused' as const,
            timeline: [
              ...c.timeline,
              {
                id: `tl-${Date.now()}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                stage: 'Recovery Paused',
                description: 'Operator temporarily suspended recovery actions on this case.',
                status: 'warning' as const,
                actor: 'Alex Morgan (Operations)',
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    showToast(`Case ${caseId}: Recovery paused.`);
  };

  const escalateAction = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: 'escalated' as const,
            timeline: [
              ...c.timeline,
              {
                id: `tl-${Date.now()}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                stage: 'Escalated to Tier-2 Support',
                description: 'Case escalated for high-touch customer phone/white-glove verification.',
                status: 'warning' as const,
                actor: 'Alex Morgan (Operations)',
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    showToast(`Case ${caseId}: Escalated to Tier-2 operations team.`);
  };

  const rejectAction = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status: 'blocked' as const,
            timeline: [
              ...c.timeline,
              {
                id: `tl-${Date.now()}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                stage: 'Amount Change Rejected',
                description: 'Operator rejected out-of-scope amount change. Enforced original ₹9,800 limit.',
                status: 'error' as const,
                actor: 'Alex Morgan (Operations)',
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    showToast(`Case ${caseId}: Scope overrun rejected by operator.`);
  };

  const markRecovered = (caseId: string) => {
    let recoveredTarget: PaymentCase | undefined;
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const receipt = AgentCheckoutService.generateReceipt({
            caseItem: c,
            recoveredAmount: c.originalAuthorizedAmount || c.amount,
            finalOutcome: 'RECOVERED_SUCCESSFULLY',
            authViolationBlocked: c.failureType === 'agent_scope_exceeded',
            humanApprovalRequired: c.amount > policy.humanApprovalThreshold,
          });

          recoveredTarget = {
            ...c,
            status: 'recovered' as const,
            receipt,
            timeline: [
              ...c.timeline,
              {
                id: `tl-${Date.now()}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                stage: 'Payment Recovered & Captured',
                description: `Customer completed checkout for ₹${(c.originalAuthorizedAmount || c.amount).toLocaleString('en-IN')}. Receipt ${receipt.receiptId} issued.`,
                status: 'completed' as const,
                actor: c.customerAlias,
              },
            ],
            updatedAt: new Date().toISOString(),
          };
          return recoveredTarget;
        }
        return c;
      })
    );

    // Fire celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#35D0A0', '#A78BFA', '#F4F7FB'],
      });
    } catch (e) {
      // ignore
    }

    if (recoveredTarget) {
      setActivityStream((prev) => [
        {
          id: `evt-${Date.now()}`,
          timestamp: 'Just now',
          type: 'CUSTOMER_PAID',
          caseId,
          agentName: recoveredTarget?.agentName,
          customerAlias: recoveredTarget?.customerAlias || 'Customer',
          title: `Revenue Recovered (₹${(recoveredTarget?.originalAuthorizedAmount || recoveredTarget?.amount || 0).toLocaleString('en-IN')})`,
          details: `Safe recovery completed without duplicate charge or unnecessary retries.`,
          severity: 'success',
          amount: recoveredTarget?.originalAuthorizedAmount || recoveredTarget?.amount,
          badge: 'RECOVERED',
        },
        ...prev,
      ]);
      showToast(`🎉 Revenue Recovered: ₹${(recoveredTarget.originalAuthorizedAmount || recoveredTarget.amount).toLocaleString('en-IN')} for ${caseId}!`);
    }
  };

  const completeDemoSafeRecovery = (): AgentActionReceipt => {
    const targetCaseId = 'REC-10482';
    const amount = 9800;

    const receipt: AgentActionReceipt = {
      receiptId: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      caseId: targetCaseId,
      orderId: 'ORD-77192',
      agentName: 'TravelMate-204',
      customerAlias: 'Customer T-204',
      originalPaymentAmount: 9800,
      recoveredAmount: 9800,
      outcomeDisplay: 'RECOVERED',
      paymentStatus: 'CAPTURE_SIMULATED',
      recoveryAction: 'Alternate UPI link',
      failureDiagnosis: 'TEMPORARY UPI TIMEOUT',
      customerIntentScore: 91,
      duplicateChargeRisk: 4,
      actionSelected: 'Alternate UPI link',
      attemptsCount: 1,
      customerCommunicationCount: 1,
      finalOutcome: 'RECOVERED_SUCCESSFULLY',
      trustSafeguardsApplied: [
        'Agent identity cryptographic validation (mTLS)',
        'Scope boundary check (₹12,000 limit strictly enforced)',
        'Duplicate charge prevention check executed (4% risk)',
        'Cooldown buffer observed (10m delay before alternate link)',
      ],
      retriesAvoided: 1,
      duplicateRiskPrevented: true,
      authViolationBlocked: false,
      humanApprovalRequired: false,
      decisionConfidence: 93,
      policyVersion: 'v1.4',
      timestamp: new Date().toISOString(),
    };

    setCases((prev) => {
      const exists = prev.some((c) => c.id === targetCaseId);
      if (exists) {
        return prev.map((c) =>
          c.id === targetCaseId
            ? {
                ...c,
                status: 'recovered' as const,
                paymentStatus: 'CAPTURE_SIMULATED' as const,
                receipt,
                timeline: [
                  ...c.timeline,
                  {
                    id: `tl-${Date.now()}`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    stage: 'Payment Recovered via Alternate Link',
                    description: 'Customer T-204 completed payment of ₹9,800 via alternate UPI link. Zero duplicate debits.',
                    status: 'completed' as const,
                    actor: 'Customer T-204',
                  },
                ],
                updatedAt: new Date().toISOString(),
              }
            : c
        );
      }
      return prev;
    });

    setActivityStream((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: 'Just now',
        type: 'CUSTOMER_PAID',
        caseId: targetCaseId,
        agentName: 'TravelMate-204',
        customerAlias: 'Customer T-204',
        title: 'Revenue Recovered (₹9,800)',
        details: 'Customer T-204 completed payment of ₹9,800 via alternate UPI link. Zero duplicate debits.',
        severity: 'success',
        amount,
        badge: 'RECOVERED',
      },
      ...prev,
    ]);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#35D0A0', '#A78BFA', '#F4F7FB'],
      });
    } catch (e) {}

    showToast('Safe Recovery Completed! ₹9,800 captured via alternate UPI link.');
    return receipt;
  };

  const updatePolicy = (updates: Partial<RecoveryPolicy>) => {
    const updated = {
      ...policy,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setPolicy(updated);
    showToast('Recovery Constitution updated successfully!');
  };

  const updateAgent = (agentId: string, updates: Partial<AgentTrustProfile>) => {
    setAgents((prev) =>
      prev.map((a) => (a.agentId === agentId ? { ...a, ...updates } : a))
    );
    showToast(`Agent controls updated.`);
  };

  const updateCustomer = (customerId: string, updates: Partial<CustomerProfile>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, ...updates } : c))
    );
    showToast(`Customer preferences updated.`);
  };

  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CASES);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AGENTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.POLICY);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVITY);

    setCases(INITIAL_PAYMENT_CASES);
    setAgents(INITIAL_AGENTS);
    setCustomers(SEED_CUSTOMERS);
    setPolicy(DEFAULT_RECOVERY_POLICY);
    setActivityStream(INITIAL_ACTIVITY_STREAM);
    showToast('Demo workspace reset to initial state.');
  };

  const exportReceiptJSON = (receipt: AgentActionReceipt) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(receipt, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RecoverAI_Receipt_${receipt.caseId}_${receipt.receiptId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Downloaded receipt ${receipt.receiptId}`);
  };

  return (
    <RecoveryContext.Provider
      value={{
        cases,
        agents,
        customers,
        policy,
        activityStream,
        analytics,
        selectedCaseId,
        setSelectedCaseId,
        simulateEvent,
        approveAction,
        pauseAction,
        escalateAction,
        rejectAction,
        markRecovered,
        completeDemoSafeRecovery,
        updatePolicy,
        updateAgent,
        updateCustomer,
        resetDemoData,
        exportReceiptJSON,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-surface-elevated border border-primary/40 text-main px-4 py-3 rounded-xl shadow-card shadow-primary/20 animate-float">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </RecoveryContext.Provider>
  );
};

export const useRecovery = () => {
  const context = useContext(RecoveryContext);
  if (!context) {
    throw new Error('useRecovery must be used within a RecoveryProvider');
  }
  return context;
};
