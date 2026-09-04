export type InitiatedBy =
  | 'human'
  | 'shopping_agent'
  | 'merchant_agent'
  | 'subscription_agent'
  | 'travel_agent'
  | 'procurement_agent';

export interface AgentTrustProfile {
  agentId: string;
  agentName: string;
  agentType: string;
  trustScore: number;
  verifiedIdentity: boolean;
  successfulTransactions: number;
  policyViolations: number;
  velocityRisk: number; // 0 - 100
  allowedCategories: string[];
  maxTransactionAmount: number;
  dailySpendLimit: number;
  dailySpentSoFar: number;
  humanApprovalThreshold: number;
  canRetryPayment: boolean;
  status: 'active' | 'paused' | 'revoked' | 'under_review';
  expiresAt: string;
  lastActivity: string;
  apiKeyHash?: string;
  creatorOrg?: string;
}

export interface SafetyCheckItem {
  name: string;
  passed: boolean;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AgentDecision {
  caseId: string;
  customerIntent: number; // 0 - 100
  agentTrustScore: number; // 0 - 100
  intentMatch: number; // 0 - 100
  recoverability: number; // 0 - 100
  duplicateChargeRisk: number; // 0 - 100
  authorizationCompliant: boolean;
  intentDriftDetected: boolean;
  recommendedAction: string;
  actionKey: 'alternate_upi_link' | 'update_card_link' | 'balance_reminder' | 'bank_outage_pause' | 'reconcile_webhook' | 'block_duplicate_debit' | 'abandoned_cart_reminder' | 'escalate_human' | 'block_agent_scope' | 'no_action_optout';
  delayMinutes: number;
  channel: 'whatsapp' | 'sms' | 'email' | 'in_app' | 'human_support' | 'none';
  maxAttempts: number;
  confidence: number; // 0 - 100
  explanation: string;
  safetyChecks: SafetyCheckItem[];
  status: 'recommended' | 'prepared' | 'executing' | 'completed' | 'blocked' | 'escalated';
  policyVersion: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  stage: string;
  description: string;
  status: 'completed' | 'active' | 'warning' | 'error' | 'pending';
  actor: string;
  metadata?: Record<string, any>;
}

export interface AgentActionReceipt {
  receiptId: string;
  caseId: string;
  orderId: string;
  agentName?: string;
  customerAlias: string;
  originalPaymentAmount: number;
  recoveredAmount: number;
  paymentStatus?: string;
  recoveryAction?: string;
  outcomeDisplay?: string;
  failureDiagnosis: string;
  customerIntentScore: number;
  duplicateChargeRisk: number;
  actionSelected: string;
  attemptsCount: number;
  customerCommunicationCount: number;
  finalOutcome: 'RECOVERED_SUCCESSFULLY' | 'BLOCKED_BY_SAFETY' | 'ESCALATED_TO_HUMAN' | 'DISMISSED_BY_CUSTOMER' | 'EXPIRED';
  trustSafeguardsApplied: string[];
  retriesAvoided: number;
  duplicateRiskPrevented: boolean;
  authViolationBlocked: boolean;
  humanApprovalRequired: boolean;
  decisionConfidence: number;
  policyVersion: string;
  timestamp: string;
}

export interface PaymentCase {
  id: string;
  workspaceId: string;
  customerAlias: string;
  customerId: string;
  orderId: string;
  amount: number;
  currency: 'INR' | 'USD';
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'NetBanking' | 'Wallet';
  paymentStatus?: 'FAILED' | 'RECOVERED' | 'CAPTURE_SIMULATED' | 'BLOCKED' | 'PENDING';
  failureType:
    | 'temporary_bank_timeout'
    | 'card_expired'
    | 'insufficient_balance'
    | 'bank_outage'
    | 'webhook_delay'
    | 'duplicate_debit'
    | 'customer_abandoned'
    | 'high_value_failure'
    | 'agent_scope_exceeded'
    | 'category_mismatch'
    | 'customer_opted_out'
    | 'successful_recovery';
  status:
    | 'diagnosing'
    | 'in_progress'
    | 'action_ready'
    | 'waiting_delay'
    | 'recovered'
    | 'escalated'
    | 'blocked'
    | 'expired'
    | 'paused';
  initiatedBy: InitiatedBy;
  agentId?: string;
  agentName?: string;
  agentIntent?: string;
  authorizationScope?: string[];
  originalAuthorizedAmount?: number;
  requestedAmount?: number;
  category?: string;
  decision: AgentDecision;
  timeline: TimelineEvent[];
  messagePayload?: {
    channel: 'whatsapp' | 'sms' | 'email';
    subject?: string;
    body: string;
    sentAt?: string;
    status: 'draft' | 'ready' | 'sent' | 'edited';
  };
  rawPayload?: Record<string, any>;
  receipt?: AgentActionReceipt;
  auditLog: Array<{
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    details: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface RecoveryPolicy {
  id: string;
  workspaceId: string;
  maxAutomaticAmount: number;
  maxAttempts: number;
  minimumDelayMinutes: number;
  duplicateRiskThreshold: number; // e.g. 20%
  minimumConfidence: number; // e.g. 70%
  humanApprovalThreshold: number; // e.g. ₹25,000
  maxAgentTransactionAmount: number; // e.g. ₹12,000
  dailyAgentSpendLimit: number; // e.g. ₹30,000
  maxCartModificationPct: number; // e.g. 15%
  lowTrustScorePauseThreshold: number; // e.g. 70
  allowedAgentCategories: string[];
  allowedPaymentMethods: string[];
  agentCanRetryPayment: boolean;
  authorizationExpiryHours: number;
  maxMessagesPerCustomer24h: number;
  autonomyLevel: 'observe_only' | 'recommend_actions' | 'prepare_actions' | 'act_automatically';
  allowedChannels: Array<'whatsapp' | 'email' | 'sms'>;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  alias: string;
  previousSuccessfulPayments: number;
  previousFailedPayments: number;
  recoveryRate: number;
  lifetimeRecoveredValue: number;
  preferredPaymentMethod: string;
  communicationPreference: 'whatsapp' | 'email' | 'sms' | 'none';
  optedOut: boolean;
  riskNotes: string;
  recentActivity: string;
  createdAt: string;
  history: Array<{
    caseId: string;
    amount: number;
    date: string;
    outcome: string;
  }>;
}

export interface LiveEventStreamItem {
  id: string;
  timestamp: string;
  type:
    | 'PAYMENT_EVENT_RECEIVED'
    | 'AGENT_CHECKOUT_INITIATED'
    | 'AGENT_IDENTITY_VERIFIED'
    | 'SCOPE_COMPLIANCE_CHECKED'
    | 'FAILURE_CLASSIFIED'
    | 'INTENT_SCORED'
    | 'DUPLICATE_RISK_CHECKED'
    | 'POLICY_EVALUATED'
    | 'ACTION_PREPARED'
    | 'ACTION_BLOCKED'
    | 'HUMAN_APPROVAL_REQUESTED'
    | 'CUSTOMER_PAID'
    | 'CUSTOMER_IGNORED'
    | 'RECEIPT_GENERATED';
  caseId: string;
  agentName?: string;
  customerAlias: string;
  title: string;
  details: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  confidence?: number;
  badge?: string;
  amount?: number;
}

export interface AnalyticsSummary {
  recoverableRevenue: number;
  recoveredRevenue: number;
  recoveryRate: number;
  trustIncidentsPrevented: number;
  avgRecoveryTimeMinutes: number;
  outOfScopeBlockedAmount: number;
  agentCheckoutVolume: number;
  agentCheckoutConversion: number;
  humanApprovalsPending: number;
}
