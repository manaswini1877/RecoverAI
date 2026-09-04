import { SafetyCheckItem } from '../types';

export interface DuplicateSafetyEvaluation {
  riskScore: number; // 0 - 100%
  checks: SafetyCheckItem[];
  isSafeToRecover: boolean;
  blockingReason?: string;
  recommendedSafeguard: string;
}

export class DuplicateChargeSafetyService {
  /**
   * Run the 5-point Payment Safety & Duplicate Charge evaluation
   */
  public static evaluateSafety(params: {
    failureType: string;
    hasSuccessfulDebitSignal?: boolean;
    hasPendingBankConfirmation?: boolean;
    hasDelayedWebhook?: boolean;
    lastRetryMinutesAgo?: number;
    idempotencyKeyPresent?: boolean;
    refundFlagsActive?: boolean;
    duplicateRiskThreshold?: number;
  }): DuplicateSafetyEvaluation {
    const {
      failureType,
      hasSuccessfulDebitSignal = false,
      hasPendingBankConfirmation = false,
      hasDelayedWebhook = false,
      lastRetryMinutesAgo = 25,
      idempotencyKeyPresent = true,
      refundFlagsActive = false,
      duplicateRiskThreshold = 20,
    } = params;

    const checks: SafetyCheckItem[] = [];
    let riskScore = 0;

    // Check 1: Successful Debit Signal
    const debitSignalDetected = hasSuccessfulDebitSignal || failureType === 'duplicate_debit';
    if (debitSignalDetected) {
      riskScore += 75;
      checks.push({
        name: 'No Successful Charge Signal',
        passed: false,
        description: 'Possible debit confirmation or acquirer ledger entry detected on customer account.',
        severity: 'critical',
      });
    } else {
      checks.push({
        name: 'No Successful Charge Signal',
        passed: true,
        description: 'No successful debit signal received from issuing bank or settlement rail.',
        severity: 'low',
      });
    }

    // Check 2: Pending Bank Confirmation / Webhook Reconciliation
    const pendingWebhook = hasDelayedWebhook || failureType === 'webhook_delay';
    if (pendingWebhook || hasPendingBankConfirmation) {
      riskScore += 55;
      checks.push({
        name: 'Pending Bank Confirmation Reconciled',
        passed: false,
        description: 'Bank webhook delayed or async state pending. Acquirer reconciliation required.',
        severity: 'high',
      });
    } else {
      checks.push({
        name: 'Pending Bank Confirmation Reconciled',
        passed: true,
        description: 'Webhook delivery confirmed. No unresolved asynchronous authorizations in-flight.',
        severity: 'low',
      });
    }

    // Check 3: Retry Velocity Window (must be > 15 mins)
    const tooFrequent = lastRetryMinutesAgo < 15;
    if (tooFrequent) {
      riskScore += 25;
      checks.push({
        name: 'Safe Velocity Interval (>15m)',
        passed: false,
        description: `Last attempt was ${lastRetryMinutesAgo}m ago. Rapid retries risk customer fatigue and double authorization.`,
        severity: 'medium',
      });
    } else {
      checks.push({
        name: 'Safe Velocity Interval (>15m)',
        passed: true,
        description: `Last attempt was ${lastRetryMinutesAgo}m ago (exceeds 15-minute cooldown window).`,
        severity: 'low',
      });
    }

    // Check 4: Idempotency Key & Refund Locks
    if (!idempotencyKeyPresent || refundFlagsActive) {
      riskScore += 30;
      checks.push({
        name: 'Idempotency Key & Lock Validated',
        passed: false,
        description: 'Missing cryptographic idempotency key or active dispute/refund lock.',
        severity: 'high',
      });
    } else {
      checks.push({
        name: 'Idempotency Key & Lock Validated',
        passed: true,
        description: 'Unique cryptographic idempotency key verified. No lock contention.',
        severity: 'low',
      });
    }

    // Check 5: Alternate Payment Rail Clearance
    const alternateMethodSafe = failureType !== 'duplicate_debit' && failureType !== 'webhook_delay';
    if (alternateMethodSafe) {
      checks.push({
        name: 'Alternate Rail Safe to Dispatch',
        passed: true,
        description: 'Safe to offer alternative payment link or updated method without charging original rail.',
        severity: 'low',
      });
    } else {
      checks.push({
        name: 'Alternate Rail Safe to Dispatch',
        passed: false,
        description: 'Alternate rail dispatch blocked until current authorization state is definitively settled.',
        severity: 'critical',
      });
    }

    // Normalize risk score to 0 - 100
    if (failureType === 'temporary_bank_timeout') {
      riskScore = Math.min(riskScore, 4);
    } else if (failureType === 'card_expired' || failureType === 'insufficient_balance') {
      riskScore = Math.min(riskScore, 2);
    } else if (failureType === 'bank_outage') {
      riskScore = Math.min(riskScore, 5);
    } else if (failureType === 'customer_abandoned') {
      riskScore = 0;
    } else if (failureType === 'webhook_delay') {
      riskScore = Math.max(riskScore, 64);
    } else if (failureType === 'duplicate_debit') {
      riskScore = Math.max(riskScore, 82);
    }

    const isSafe = riskScore < duplicateRiskThreshold && !debitSignalDetected && !pendingWebhook;

    let blockingReason: string | undefined;
    let recommendedSafeguard = 'Safe to proceed with automated recovery link.';

    if (debitSignalDetected) {
      blockingReason = 'Recovery paused because a successful debit signal may exist. Reconciliation is required before any customer contact or retry.';
      recommendedSafeguard = 'Do not retry. Reconcile bank ledger with customer account.';
    } else if (pendingWebhook) {
      blockingReason = 'Webhook response pending from acquiring bank. Status must be verified to prevent duplicate debits.';
      recommendedSafeguard = 'Hold retry attempts for 15 minutes. Query acquirer status API.';
    } else if (riskScore >= duplicateRiskThreshold) {
      blockingReason = `Duplicate charge risk (${riskScore}%) exceeds merchant policy threshold (${duplicateRiskThreshold}%).`;
      recommendedSafeguard = 'Escalate to payment operations team for manual verification.';
    }

    return {
      riskScore,
      checks,
      isSafeToRecover: isSafe,
      blockingReason,
      recommendedSafeguard,
    };
  }
}
