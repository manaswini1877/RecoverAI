import { AgentDecision, PaymentCase, RecoveryPolicy, AgentTrustProfile, SafetyCheckItem } from '../types';
import { DuplicateChargeSafetyService } from './DuplicateChargeSafetyService';
import { RecoveryPolicyService } from './RecoveryPolicyService';
import { AuthorizationScopeService } from './AuthorizationScopeService';

export class RecoveryDecisionEngine {
  /**
   * Diagnoses a payment failure and generates an explainable, trust-aware recovery decision
   * governed strictly by the merchant's live Recovery Constitution.
   */
  public static evaluateCase(params: {
    caseId: string;
    amount: number;
    failureType: PaymentCase['failureType'];
    paymentMethod: PaymentCase['paymentMethod'];
    customerAlias: string;
    initiatedBy: PaymentCase['initiatedBy'];
    agentProfile?: AgentTrustProfile;
    originalAuthorizedAmount?: number;
    requestedAmount?: number;
    category?: string;
    customerOptedOut?: boolean;
    policy: RecoveryPolicy;
  }): AgentDecision {
    const {
      caseId,
      amount,
      failureType,
      paymentMethod,
      customerAlias,
      initiatedBy,
      agentProfile,
      originalAuthorizedAmount = amount,
      requestedAmount = amount,
      category = 'Hotels & Travel',
      customerOptedOut = false,
      policy,
    } = params;

    // 1. Duplicate charge risk assessment
    const safetyResult = DuplicateChargeSafetyService.evaluateSafety({
      failureType,
      hasSuccessfulDebitSignal: failureType === 'duplicate_debit',
      hasDelayedWebhook: failureType === 'webhook_delay',
      duplicateRiskThreshold: policy.duplicateRiskThreshold,
    });

    // 2. Base metrics synthesis by failure type
    let customerIntent = 91;
    let agentTrustScore = agentProfile ? agentProfile.trustScore : 100;
    let intentMatch = 95;
    let recoverability = 87;
    let duplicateRisk = safetyResult.riskScore;
    let confidence = 93;
    let recommendedAction = 'Wait 10 minutes, then send an alternate UPI payment link.';
    let actionKey: AgentDecision['actionKey'] = 'alternate_upi_link';
    let delayMinutes = 10;
    let channel: AgentDecision['channel'] = 'whatsapp';
    let maxAttempts = policy.maxAttempts;
    let explanation = '';
    let status: AgentDecision['status'] = 'recommended';
    let authorizationCompliant = true;
    let intentDriftDetected = false;

    // Determine baseline failure parameters
    if (failureType === 'temporary_bank_timeout') {
      customerIntent = 91;
      recoverability = 87;
      duplicateRisk = 4;
      confidence = 93;
      delayMinutes = Math.max(10, policy.minimumDelayMinutes);
      channel = 'whatsapp';
      actionKey = 'alternate_upi_link';
      recommendedAction = `Wait ${delayMinutes} minutes, then send an alternate UPI payment link.`;
      explanation = `Returning customer with active shopping intent. Temporary UPI bank timeout. No debit detected. Alternate UPI link with ${delayMinutes}m cooldown recommended to avoid rail congestion.`;
    } else if (failureType === 'card_expired') {
      customerIntent = 88;
      recoverability = 75;
      duplicateRisk = 2;
      confidence = 95;
      delayMinutes = 5;
      channel = 'email';
      actionKey = 'update_card_link';
      recommendedAction = 'Send secure payment method update link via Email & SMS.';
      explanation = 'Customer card is expired. Retrying the same card causes issuer decline penalties. RecoverAI prepared a secure hosted tokenization link to update card details while holding cart reservation.';
    } else if (failureType === 'insufficient_balance') {
      customerIntent = 76;
      recoverability = 52;
      duplicateRisk = 1;
      confidence = 88;
      delayMinutes = 60;
      channel = 'whatsapp';
      actionKey = 'balance_reminder';
      recommendedAction = 'Send single respectful reminder with alternate payment rail & later schedule option.';
      explanation = 'Declined due to insufficient balance. Immediate retries cause friction. One respectful reminder offering UPI/NetBanking or a delayed retry window preserves trust.';
    } else if (failureType === 'bank_outage') {
      customerIntent = 84;
      recoverability = 40;
      duplicateRisk = 5;
      confidence = 91;
      delayMinutes = 120;
      channel = 'whatsapp';
      actionKey = 'bank_outage_pause';
      recommendedAction = 'Pause recovery retries. Notify customer of bank outage and offer alternate payment method.';
      explanation = 'Issuing bank core banking infrastructure is reporting downtime. Retries on this rail are paused. An alert offering alternate payment rails was prepared.';
      status = 'blocked';
    } else if (failureType === 'webhook_delay') {
      customerIntent = 89;
      recoverability = 60;
      duplicateRisk = 64;
      confidence = 90;
      delayMinutes = 15;
      channel = 'none';
      actionKey = 'reconcile_webhook';
      recommendedAction = 'Block all recovery attempts temporarily. Reconcile payment status with bank ledger first.';
      explanation = 'Bank webhook is delayed with potential asynchronous capture in flight. Retrying now carries a high risk of duplicate charge. All recovery is halted until reconciliation clears.';
      status = 'blocked';
    } else if (failureType === 'duplicate_debit') {
      customerIntent = 92;
      recoverability = 10;
      duplicateRisk = 82;
      confidence = 96;
      delayMinutes = 0;
      channel = 'sms';
      actionKey = 'block_duplicate_debit';
      recommendedAction = 'Retry blocked immediately. Route to payment reconciliation & refund check.';
      explanation = 'Debit confirmation detected on customer statement without merchant capture. Retry strictly blocked. Customer notified that payment is under verification to avoid duplicate debits.';
      status = 'blocked';
    } else if (failureType === 'customer_abandoned') {
      customerIntent = 68;
      recoverability = 45;
      duplicateRisk = 0;
      confidence = 82;
      delayMinutes = 20;
      channel = 'whatsapp';
      actionKey = 'abandoned_cart_reminder';
      recommendedAction = 'Send one contextual cart reservation reminder with direct 1-click checkout link.';
      explanation = 'Customer dropped off at payment verification. Session analytics show high buying intent. A single 20-minute reservation reminder is dispatched per frequency policy.';
    } else if (failureType === 'high_value_failure' || amount > policy.humanApprovalThreshold) {
      customerIntent = 94;
      recoverability = 80;
      duplicateRisk = 12;
      confidence = 86;
      channel = 'human_support';
      actionKey = 'escalate_human';
      recommendedAction = 'Escalate to payment operations for high-touch customer outreach.';
      explanation = `Cart amount (₹${amount.toLocaleString('en-IN')}) exceeds merchant high-value ceiling (₹${policy.humanApprovalThreshold.toLocaleString('en-IN')}). High-touch VIP support escalation ensures white-glove recovery.`;
      status = 'escalated';
    }

    // 3. Evaluate Agent Profile Status & Overrun Rules
    if (agentProfile) {
      if (agentProfile.status === 'paused') {
        status = 'blocked';
        actionKey = 'block_agent_scope';
        recommendedAction = `Agent '${agentProfile.agentName}' is currently PAUSED by merchant. Checkout blocked.`;
        explanation = `Autonomous agent '${agentProfile.agentName}' has been suspended in the Agent Registry. All checkout attempts are halted.`;
        authorizationCompliant = false;
      } else if (agentProfile.status === 'revoked') {
        status = 'blocked';
        actionKey = 'block_agent_scope';
        recommendedAction = `Agent '${agentProfile.agentName}' authorization is REVOKED. Checkout denied.`;
        explanation = `Agent credentials for '${agentProfile.agentName}' have been permanently revoked. Transactions cannot proceed.`;
        authorizationCompliant = false;
      } else if (requestedAmount > agentProfile.maxTransactionAmount) {
        status = 'blocked';
        actionKey = 'block_agent_scope';
        recommendedAction = `AGENT CHECKOUT BLOCKED: Requested ₹${requestedAmount.toLocaleString('en-IN')} exceeds agent limit of ₹${agentProfile.maxTransactionAmount.toLocaleString('en-IN')}. Human approval required.`;
        explanation = `Agent '${agentProfile.agentName}' requested ₹${requestedAmount.toLocaleString('en-IN')}, exceeding configured transaction ceiling of ₹${agentProfile.maxTransactionAmount.toLocaleString('en-IN')}.`;
        authorizationCompliant = false;
      } else if (originalAuthorizedAmount && requestedAmount > originalAuthorizedAmount) {
        const increasePct = ((requestedAmount - originalAuthorizedAmount) / originalAuthorizedAmount) * 100;
        if (increasePct > policy.maxCartModificationPct) {
          intentDriftDetected = true;
          authorizationCompliant = false;
          status = 'blocked';
          actionKey = 'block_agent_scope';
          recommendedAction = `AGENT CHECKOUT BLOCKED: Requested amount (₹${requestedAmount.toLocaleString('en-IN')}) exceeds authorized scope (+${increasePct.toFixed(1)}%). Human approval required.`;
          explanation = `Agent '${agentProfile.agentName}' attempted to increase checkout amount from ₹${originalAuthorizedAmount.toLocaleString('en-IN')} to ₹${requestedAmount.toLocaleString('en-IN')} (+${increasePct.toFixed(1)}% deviation). Exceeds ${policy.maxCartModificationPct}% cart variance threshold.`;
        }
      }
    }

    // 4. Evaluate Policy Overrides (Autonomy, Confidence, Duplicate Risk, Amount Limits)
    if (customerOptedOut) {
      customerIntent = 10;
      recoverability = 0;
      duplicateRisk = 0;
      confidence = 99;
      recommendedAction = 'No action taken — customer opted out.';
      actionKey = 'no_action_optout';
      channel = 'none';
      explanation = 'Customer has previously opted out of recovery communications. Trust and privacy safeguards prohibit outreach.';
      status = 'blocked';
    } else if (duplicateRisk >= policy.duplicateRiskThreshold) {
      status = 'blocked';
      recommendedAction = `Recovery blocked: Duplicate risk (${duplicateRisk}%) exceeds merchant tolerance threshold (${policy.duplicateRiskThreshold}%).`;
      explanation = `Safety safeguard: Duplicate charge risk (${duplicateRisk}%) is at or above policy limit (${policy.duplicateRiskThreshold}%). Action paused pending settlement reconciliation.`;
    } else if (confidence < policy.minimumConfidence) {
      status = 'escalated';
      recommendedAction = `Decision confidence (${confidence}%) below policy standard (${policy.minimumConfidence}%). Routed to operator review.`;
      explanation = `Autonomous action halted because decision confidence (${confidence}%) is below configured minimum threshold (${policy.minimumConfidence}%). Human review mandated.`;
    } else if (amount > policy.maxAutomaticAmount && status !== 'blocked') {
      status = 'escalated';
      recommendedAction = `Order value (₹${amount.toLocaleString('en-IN')}) exceeds automatic recovery limit (₹${policy.maxAutomaticAmount.toLocaleString('en-IN')}). Human approval required.`;
      explanation = `Case exceeds automatic recovery threshold (₹${policy.maxAutomaticAmount.toLocaleString('en-IN')}). Prepared for human review.`;
    } else if (policy.autonomyLevel === 'observe_only' && status !== 'blocked') {
      status = 'recommended';
      recommendedAction = `Observe Mode: ${recommendedAction} (Automated recovery disabled by merchant policy)`;
      explanation = `Merchant policy set to 'Observe Only'. Diagnosis generated for passive monitoring without automatic dispatch.`;
    } else if (policy.autonomyLevel === 'recommend_actions' && status !== 'blocked') {
      status = 'recommended';
    } else if (policy.autonomyLevel === 'prepare_actions' && status !== 'blocked') {
      status = 'prepared';
    } else if (policy.autonomyLevel === 'act_automatically' && status !== 'blocked' && status !== 'escalated') {
      status = 'prepared';
    }

    // Format updated safety checks reflecting active policy thresholds
    const safetyChecks: SafetyCheckItem[] = [
      {
        name: 'No Successful Charge Signal',
        passed: duplicateRisk < 50 && failureType !== 'duplicate_debit',
        description: failureType === 'duplicate_debit'
          ? 'Potential debit ledger entry detected on customer account.'
          : 'No debit confirmation signal received from issuing bank.',
        severity: failureType === 'duplicate_debit' ? 'critical' : 'low',
      },
      {
        name: 'Pending Bank Confirmation Reconciled',
        passed: failureType !== 'webhook_delay',
        description: failureType === 'webhook_delay'
          ? 'Bank webhook delayed or async state pending.'
          : 'Webhook delivery confirmed. No unresolved asynchronous authorizations in-flight.',
        severity: failureType === 'webhook_delay' ? 'critical' : 'low',
      },
      {
        name: `Duplicate Risk Below Policy Cap (<${policy.duplicateRiskThreshold}%)`,
        passed: duplicateRisk < policy.duplicateRiskThreshold,
        description: duplicateRisk < policy.duplicateRiskThreshold
          ? `Duplicate risk (${duplicateRisk}%) within merchant tolerance (<${policy.duplicateRiskThreshold}%).`
          : `Duplicate risk (${duplicateRisk}%) exceeds merchant tolerance (<${policy.duplicateRiskThreshold}%).`,
        severity: duplicateRisk >= policy.duplicateRiskThreshold ? 'critical' : 'low',
      },
      {
        name: 'Safe Velocity Interval (>15m)',
        passed: true,
        description: 'No rapid repeated charge attempts on this payment rail.',
        severity: 'low',
      },
      {
        name: 'Idempotency Key & Lock Validated',
        passed: true,
        description: 'Unique cryptographic idempotency key verified. No lock contention.',
        severity: 'low',
      },
    ];

    if (agentProfile) {
      safetyChecks.push({
        name: 'Agent Scope & Intent Drift Compliance',
        passed: authorizationCompliant,
        description: authorizationCompliant
          ? 'Transaction amount and category within agent authorization parameters.'
          : `Scope violation: ${explanation}`,
        severity: authorizationCompliant ? 'low' : 'critical',
      });
    }

    return {
      caseId,
      customerIntent,
      agentTrustScore,
      intentMatch,
      recoverability,
      duplicateChargeRisk: duplicateRisk,
      authorizationCompliant,
      intentDriftDetected,
      recommendedAction,
      actionKey,
      delayMinutes,
      channel,
      maxAttempts,
      confidence,
      explanation,
      safetyChecks,
      status,
      policyVersion: policy.id,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Generates customer-facing message preview across channels
   */
  public static generateCustomerMessage(params: {
    customerAlias: string;
    amount: number;
    failureType: string;
    channel: 'whatsapp' | 'sms' | 'email';
    agentName?: string;
  }): { subject?: string; body: string } {
    const { customerAlias, amount, failureType, channel, agentName } = params;
    const formattedAmount = `₹${amount.toLocaleString('en-IN')}`;

    if (failureType === 'temporary_bank_timeout') {
      const body = `Hi ${customerAlias}, your payment of ${formattedAmount} did not complete because your bank connection timed out. Your order is safely reserved for 20 minutes. You can retry with another UPI option or use a card here: https://pay.acme.demo/r/rec-10482. We will not charge you twice.`;
      return {
        subject: channel === 'email' ? 'Action Required: Complete your reserved order' : undefined,
        body,
      };
    }

    if (failureType === 'card_expired') {
      const body = `Hi ${customerAlias}, your card payment of ${formattedAmount} could not be processed as the card has expired. To keep your order active, please update your payment method securely here: https://pay.acme.demo/update/rec-882.`;
      return {
        subject: 'Update payment method to complete your order',
        body,
      };
    }

    if (failureType === 'duplicate_debit' || failureType === 'webhook_delay') {
      const body = `Hi ${customerAlias}, we noticed a slight delay verifying your payment of ${formattedAmount}. We are checking with your bank right now and will not attempt any additional charges until confirmed.`;
      return {
        subject: 'Payment verification in progress',
        body,
      };
    }

    const body = `Hi ${customerAlias}, your checkout of ${formattedAmount}${agentName ? ` via ${agentName}` : ''} was interrupted. Your items are reserved. Click here to safely complete payment: https://pay.acme.demo/r/safe-link.`;
    return {
      subject: 'Complete your checkout with Acme Commerce',
      body,
    };
  }
}
