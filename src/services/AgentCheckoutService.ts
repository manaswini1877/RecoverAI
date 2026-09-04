import {
  AgentTrustProfile,
  PaymentCase,
  AgentDecision,
  AgentActionReceipt,
  RecoveryPolicy,
  TimelineEvent,
} from '../types';
import { AgentTrustService } from './AgentTrustService';
import { AuthorizationScopeService } from './AuthorizationScopeService';
import { RecoveryDecisionEngine } from './RecoveryDecisionEngine';
import { DuplicateChargeSafetyService } from './DuplicateChargeSafetyService';

export class AgentCheckoutService {
  /**
   * Generates a completed Agent Action Receipt
   */
  public static generateReceipt(params: {
    caseItem: PaymentCase;
    recoveredAmount: number;
    finalOutcome: AgentActionReceipt['finalOutcome'];
    authViolationBlocked?: boolean;
    humanApprovalRequired?: boolean;
    retriesAvoided?: number;
    duplicateRiskPrevented?: boolean;
  }): AgentActionReceipt {
    const {
      caseItem,
      recoveredAmount,
      finalOutcome,
      authViolationBlocked = false,
      humanApprovalRequired = false,
      retriesAvoided = 1,
      duplicateRiskPrevented = true,
    } = params;

    const safeguards: string[] = [
      'Duplicate charge prevention check executed',
      'Agent identity cryptographic validation',
      'Idempotency key lock verified',
    ];

    if (authViolationBlocked) {
      safeguards.push('Authorization scope limit strictly enforced (Amount overrun blocked)');
    }
    if (humanApprovalRequired) {
      safeguards.push('Human operator in-the-loop review applied');
    }
    if (caseItem.decision.delayMinutes > 0) {
      safeguards.push(`Safe delay window (${caseItem.decision.delayMinutes}m) respected to avoid bank rail hammering`);
    }

    return {
      receiptId: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      caseId: caseItem.id,
      orderId: caseItem.orderId,
      agentName: caseItem.agentName || 'Direct Checkout',
      customerAlias: caseItem.customerAlias,
      originalPaymentAmount: caseItem.originalAuthorizedAmount || caseItem.amount,
      recoveredAmount,
      failureDiagnosis: caseItem.failureType.replace(/_/g, ' ').toUpperCase(),
      customerIntentScore: caseItem.decision.customerIntent,
      duplicateChargeRisk: caseItem.decision.duplicateChargeRisk,
      actionSelected: caseItem.decision.recommendedAction,
      attemptsCount: 1,
      customerCommunicationCount: 1,
      finalOutcome,
      trustSafeguardsApplied: safeguards,
      retriesAvoided,
      duplicateRiskPrevented,
      authViolationBlocked,
      humanApprovalRequired,
      decisionConfidence: caseItem.decision.confidence,
      policyVersion: caseItem.decision.policyVersion,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates initial TravelMate-204 Demo Scenario Case
   */
  public static createTravelMateDemoCase(policy: RecoveryPolicy): {
    caseItem: PaymentCase;
    agent: AgentTrustProfile;
  } {
    const agent: AgentTrustProfile = {
      agentId: 'agt_travel_204',
      agentName: 'TravelMate-204',
      agentType: 'Travel & Hospitality Shopping Agent',
      trustScore: 88,
      verifiedIdentity: true,
      successfulTransactions: 142,
      policyViolations: 1,
      velocityRisk: 8,
      allowedCategories: ['Hotels & Travel'],
      maxTransactionAmount: 12000,
      dailySpendLimit: 30000,
      dailySpentSoFar: 9800,
      humanApprovalThreshold: 12000,
      canRetryPayment: false,
      status: 'active',
      expiresAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      lastActivity: 'Just now',
    };

    const caseId = 'REC-10482';
    const initialDecision = RecoveryDecisionEngine.evaluateCase({
      caseId,
      amount: 9800,
      failureType: 'temporary_bank_timeout',
      paymentMethod: 'UPI',
      customerAlias: 'Customer T-204',
      initiatedBy: 'travel_agent',
      agentProfile: agent,
      originalAuthorizedAmount: 9800,
      requestedAmount: 9800,
      category: 'Hotels & Travel',
      policy,
    });

    const now = new Date();
    const timeline: TimelineEvent[] = [
      {
        id: 'tl-1',
        time: new Date(now.getTime() - 4 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stage: 'Agent Checkout Initiated',
        description: 'TravelMate-204 initiated hotel booking checkout of ₹9,800 via UPI rail for Customer T-204.',
        status: 'completed',
        actor: 'TravelMate-204',
      },
      {
        id: 'tl-2',
        time: new Date(now.getTime() - 3 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stage: 'Agent Verified',
        description: 'Identity verified (88/100 trust score). Authorized category (Hotels & Travel), within ₹12,000 cap.',
        status: 'completed',
        actor: 'RecoverAI Trust Layer',
      },
      {
        id: 'tl-3',
        time: new Date(now.getTime() - 2 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stage: 'Payment Failed',
        description: 'Issuing bank returned UPITimeout (Code: U30). Debit verification in-flight.',
        status: 'warning',
        actor: 'Bank Rail',
      },
      {
        id: 'tl-4',
        time: new Date(now.getTime() - 1 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stage: 'Trust-Aware Diagnosis',
        description: 'RecoverAI checked duplicate risk (4%), verified intent (91%), and prepared safe alternate link after 10m delay.',
        status: 'active',
        actor: 'RecoverAI Agent',
      },
    ];

    const caseItem: PaymentCase = {
      id: caseId,
      workspaceId: 'ws_acme_commerce',
      customerAlias: 'Customer T-204',
      customerId: 'cust_t204',
      orderId: 'ORD-77192',
      amount: 9800,
      currency: 'INR',
      paymentMethod: 'UPI',
      failureType: 'temporary_bank_timeout',
      status: 'action_ready',
      initiatedBy: 'travel_agent',
      agentId: agent.agentId,
      agentName: agent.agentName,
      agentIntent: 'Book weekend boutique hotel room in Udaipur',
      authorizationScope: ['Hotels & Travel', 'Max ₹12,000', 'No auto-retry without link'],
      originalAuthorizedAmount: 9800,
      requestedAmount: 9800,
      category: 'Hotels & Travel',
      decision: initialDecision,
      timeline,
      messagePayload: {
        channel: 'whatsapp',
        body: 'Hi Customer T-204, your hotel booking payment of ₹9,800 via TravelMate-204 timed out at your bank. Your room is reserved for 20 minutes. Pay safely via alternate UPI or Card: https://pay.acme.demo/r/rec-10482. We will not charge you twice.',
        status: 'ready',
      },
      auditLog: [
        {
          id: 'aud-1',
          timestamp: new Date().toISOString(),
          actor: 'RecoverAI Autonomous Engine',
          action: 'DECISION_PREPARED',
          details: 'Prepared alternate UPI recovery link with 10m cooldown safeguard.',
        },
      ],
      createdAt: new Date(now.getTime() - 4 * 60000).toISOString(),
      updatedAt: now.toISOString(),
    };

    return { caseItem, agent };
  }
}
