import { RecoveryPolicy, PaymentCase, AgentTrustProfile } from '../types';

export const DEFAULT_RECOVERY_POLICY: RecoveryPolicy = {
  id: 'pol_default_v1.4',
  workspaceId: 'ws_acme_commerce',
  maxAutomaticAmount: 10000,
  maxAttempts: 2,
  minimumDelayMinutes: 15,
  duplicateRiskThreshold: 20, // 20%
  minimumConfidence: 70, // 70%
  humanApprovalThreshold: 25000, // ₹25,000
  maxAgentTransactionAmount: 12000, // ₹12,000
  dailyAgentSpendLimit: 30000, // ₹30,000
  maxCartModificationPct: 15, // 15%
  lowTrustScorePauseThreshold: 70,
  allowedAgentCategories: ['Hotels & Travel', 'Groceries & Essentials', 'Office Supplies', 'Subscriptions & SaaS', 'Fashion & Retail'],
  allowedPaymentMethods: ['UPI', 'Credit Card', 'Debit Card', 'NetBanking'],
  agentCanRetryPayment: false, // Agents must request recovery link rather than blind retry
  authorizationExpiryHours: 24,
  maxMessagesPerCustomer24h: 2,
  autonomyLevel: 'act_automatically', // 'observe_only' | 'recommend_actions' | 'prepare_actions' | 'act_automatically'
  allowedChannels: ['whatsapp', 'email', 'sms'],
  updatedAt: new Date().toISOString(),
};

export interface PolicyEvaluationResult {
  isAllowed: boolean;
  requiresHumanApproval: boolean;
  isBlocked: boolean;
  reasons: string[];
  appliedRule: string;
}

export class RecoveryPolicyService {
  /**
   * Generates a dynamic, natural language description of the active Recovery Constitution
   */
  public static generateNaturalLanguagePreview(policy: RecoveryPolicy): string {
    const channelList = policy.allowedChannels.map((c) => c.toUpperCase()).join(', ');
    const autonomyDescriptions = {
      observe_only: 'operates in passive observation mode, monitoring failed checkouts without generating actions',
      recommend_actions: 'diagnoses failures and generates recommendations for human operators without dispatching',
      prepare_actions: 'prepares recovery links and messages for one-click operator dispatch',
      act_automatically: `automatically executes safe recovery links for cases under ₹${policy.maxAutomaticAmount.toLocaleString('en-IN')}`,
    };

    return `RecoverAI ${autonomyDescriptions[policy.autonomyLevel]} when customer intent is above ${policy.minimumConfidence}%, duplicate-charge risk is below ${policy.duplicateRiskThreshold}%, and no successful debit signal exists. AI agents are authorized up to ₹${policy.maxAgentTransactionAmount.toLocaleString('en-IN')} in approved categories (${policy.allowedAgentCategories.slice(0, 2).join(', ')}). Any cart modification above ${policy.maxCartModificationPct}%, transactions above ₹${policy.humanApprovalThreshold.toLocaleString('en-IN')}, agent trust score below ${policy.lowTrustScorePauseThreshold}, or duplicate debit risk requires human approval. Customer communications are restricted to ${policy.maxMessagesPerCustomer24h} messages/24h via ${channelList}.`;
  }

  /**
   * Evaluates a payment case & agent profile against the recovery constitution
   */
  public static evaluatePolicy(params: {
    amount: number;
    requestedAmount?: number;
    originalAuthorizedAmount?: number;
    confidence: number;
    duplicateRisk: number;
    category?: string;
    agentProfile?: AgentTrustProfile;
    customerOptedOut?: boolean;
    policy: RecoveryPolicy;
  }): PolicyEvaluationResult {
    const {
      amount,
      requestedAmount,
      originalAuthorizedAmount,
      confidence,
      duplicateRisk,
      category,
      agentProfile,
      customerOptedOut,
      policy,
    } = params;

    const reasons: string[] = [];
    let isBlocked = false;
    let requiresHumanApproval = false;

    // Check 1: Customer Opt-Out
    if (customerOptedOut) {
      return {
        isAllowed: false,
        requiresHumanApproval: false,
        isBlocked: true,
        reasons: ['Customer has explicitly opted out of payment recovery communications.'],
        appliedRule: 'Privacy Rule §4: No contact permitted for opted-out customers.',
      };
    }

    // Check 2: High Value Threshold
    if (amount > policy.humanApprovalThreshold) {
      requiresHumanApproval = true;
      reasons.push(
        `Order amount (₹${amount.toLocaleString('en-IN')}) exceeds high-value threshold of ₹${policy.humanApprovalThreshold.toLocaleString('en-IN')}.`
      );
    }

    // Check 3: Agent Specific Constraints (if agent initiated)
    if (agentProfile) {
      // Agent status check
      if (agentProfile.status === 'paused' || agentProfile.status === 'revoked') {
        isBlocked = true;
        reasons.push(`Agent '${agentProfile.agentName}' status is currently '${agentProfile.status}'.`);
      }

      // Agent trust score check
      if (agentProfile.trustScore < policy.lowTrustScorePauseThreshold) {
        requiresHumanApproval = true;
        reasons.push(
          `Agent trust score (${agentProfile.trustScore}/100) is below the minimum threshold (${policy.lowTrustScorePauseThreshold}/100).`
        );
      }

      // Max Agent Transaction Amount
      const effectiveAmount = requestedAmount || amount;
      if (effectiveAmount > policy.maxAgentTransactionAmount) {
        requiresHumanApproval = true;
        reasons.push(
          `Requested amount (₹${effectiveAmount.toLocaleString('en-IN')}) exceeds agent limit of ₹${policy.maxAgentTransactionAmount.toLocaleString('en-IN')}.`
        );
      }

      // Category check
      if (category && !policy.allowedAgentCategories.includes(category)) {
        isBlocked = true;
        reasons.push(`Category '${category}' is not in the agent's authorized scope.`);
      }

      // Intent Drift / Cart Modification check
      if (originalAuthorizedAmount && requestedAmount && requestedAmount > originalAuthorizedAmount) {
        const increasePct = ((requestedAmount - originalAuthorizedAmount) / originalAuthorizedAmount) * 100;
        if (increasePct > policy.maxCartModificationPct) {
          requiresHumanApproval = true;
          reasons.push(
            `Agent increased checkout amount by ${increasePct.toFixed(1)}% (exceeds authorized deviation limit of ${policy.maxCartModificationPct}%).`
          );
        }
      }
    }

    // Check 4: Duplicate Charge Risk
    if (duplicateRisk >= policy.duplicateRiskThreshold) {
      isBlocked = true;
      reasons.push(
        `Duplicate charge risk (${duplicateRisk}%) exceeds safety threshold of ${policy.duplicateRiskThreshold}%.`
      );
    }

    // Check 5: Minimum Decision Confidence
    if (confidence < policy.minimumConfidence) {
      requiresHumanApproval = true;
      reasons.push(
        `Agent decision confidence (${confidence}%) is below minimum standard (${policy.minimumConfidence}%).`
      );
    }

    // Autonomy Level Check
    if (policy.autonomyLevel === 'observe_only') {
      return {
        isAllowed: false,
        requiresHumanApproval: false,
        isBlocked: false,
        reasons: ['Merchant autonomy setting is set to Observe Only.'],
        appliedRule: 'Autonomy Level: Passive Monitoring',
      };
    }

    if (policy.autonomyLevel === 'recommend_actions' || policy.autonomyLevel === 'prepare_actions') {
      requiresHumanApproval = true;
    }

    const isAllowed = !isBlocked && (!requiresHumanApproval || policy.autonomyLevel === 'act_automatically');

    return {
      isAllowed,
      requiresHumanApproval,
      isBlocked,
      reasons,
      appliedRule: isBlocked
        ? 'Constitution Safeguard: Action blocked by policy constraint.'
        : requiresHumanApproval
        ? 'Constitution Safeguard: Human operator review mandated.'
        : 'Constitution Authorization: Approved for autonomous recovery.',
    };
  }
}
