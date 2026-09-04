import { AgentTrustProfile, RecoveryPolicy } from '../types';

export interface ScopeEvaluation {
  isCompliant: boolean;
  intentDriftDetected: boolean;
  isAmountOverLimit: boolean;
  isCategoryMismatch: boolean;
  originalAmount: number;
  requestedAmount: number;
  amountOverLimit: number;
  deviationPercentage: number;
  category: string;
  violations: string[];
  recommendedDecision: 'APPROVE' | 'REQUIRE_HUMAN_APPROVAL' | 'BLOCK_TRANSACTION';
  summary: string;
}

export class AuthorizationScopeService {
  /**
   * Evaluates whether an agent's payment request complies with its authorized scope
   */
  public static evaluateScope(params: {
    agent: AgentTrustProfile;
    originalAuthorizedAmount: number;
    requestedAmount: number;
    category: string;
    policy: RecoveryPolicy;
  }): ScopeEvaluation {
    const {
      agent,
      originalAuthorizedAmount,
      requestedAmount,
      category,
      policy,
    } = params;

    const violations: string[] = [];
    let isAmountOverLimit = false;
    let isCategoryMismatch = false;
    let intentDriftDetected = false;

    // 1. Amount limit check against Agent Limit & Policy Limit
    const maxPermitted = Math.min(agent.maxTransactionAmount, policy.maxAgentTransactionAmount);
    const amountOverLimit = Math.max(0, requestedAmount - maxPermitted);

    if (requestedAmount > maxPermitted) {
      isAmountOverLimit = true;
      violations.push(
        `Requested amount ₹${requestedAmount.toLocaleString('en-IN')} exceeds maximum authorized limit of ₹${maxPermitted.toLocaleString('en-IN')} by ₹${amountOverLimit.toLocaleString('en-IN')}.`
      );
    }

    // 2. Intent drift check (Cart modification compared to original amount)
    const deviationPercentage = originalAuthorizedAmount > 0
      ? ((requestedAmount - originalAuthorizedAmount) / originalAuthorizedAmount) * 100
      : 0;

    if (deviationPercentage > policy.maxCartModificationPct) {
      intentDriftDetected = true;
      violations.push(
        `Intent drift detected: Agent increased checkout amount by +${deviationPercentage.toFixed(1)}% (authorized variance limit is ${policy.maxCartModificationPct}%).`
      );
    }

    // 3. Category match check
    if (!agent.allowedCategories.includes(category)) {
      isCategoryMismatch = true;
      violations.push(
        `Category '${category}' is outside agent's permitted categories: [${agent.allowedCategories.join(', ')}].`
      );
    }

    // 4. Daily spend limit check
    if (agent.dailySpentSoFar + requestedAmount > agent.dailySpendLimit) {
      violations.push(
        `Transaction would exceed agent's 24-hour spend ceiling of ₹${agent.dailySpendLimit.toLocaleString('en-IN')}.`
      );
    }

    const isCompliant = !isAmountOverLimit && !isCategoryMismatch && !intentDriftDetected && violations.length === 0;

    let recommendedDecision: 'APPROVE' | 'REQUIRE_HUMAN_APPROVAL' | 'BLOCK_TRANSACTION' = 'APPROVE';
    let summary = 'Transaction is within verified agent authorization scope and intent parameters.';

    if (isCategoryMismatch || agent.status === 'revoked') {
      recommendedDecision = 'BLOCK_TRANSACTION';
      summary = 'Blocked by policy: Category mismatch or revoked agent authorization.';
    } else if (isAmountOverLimit || intentDriftDetected || violations.length > 0) {
      recommendedDecision = 'REQUIRE_HUMAN_APPROVAL';
      summary = 'Human approval required: Requested amount or cart modification exceeds authorized scope.';
    }

    return {
      isCompliant,
      intentDriftDetected,
      isAmountOverLimit,
      isCategoryMismatch,
      originalAmount: originalAuthorizedAmount,
      requestedAmount,
      amountOverLimit,
      deviationPercentage,
      category,
      violations,
      recommendedDecision,
      summary,
    };
  }
}
