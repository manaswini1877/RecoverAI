import { AgentTrustProfile } from '../types';

export const INITIAL_AGENTS: AgentTrustProfile[] = [
  {
    agentId: 'agt_travel_204',
    agentName: 'TravelMate-204',
    agentType: 'Travel & Hospitality Agent',
    trustScore: 88,
    verifiedIdentity: true,
    successfulTransactions: 142,
    policyViolations: 1,
    velocityRisk: 8,
    allowedCategories: ['Hotels & Travel'],
    maxTransactionAmount: 12000, // ₹12,000
    dailySpendLimit: 30000,
    dailySpentSoFar: 9800,
    humanApprovalThreshold: 12000,
    canRetryPayment: false,
    status: 'active',
    expiresAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(), // 18 hours
    lastActivity: '2 minutes ago',
    apiKeyHash: 'sec_agt_tm204_f89a91...',
    creatorOrg: 'VoyageAI Autonomous Systems',
  },
  {
    agentId: 'agt_grocery_118',
    agentName: 'GroceryFlow-118',
    agentType: 'QuickCommerce Smart Replenishment',
    trustScore: 94,
    verifiedIdentity: true,
    successfulTransactions: 388,
    policyViolations: 0,
    velocityRisk: 4,
    allowedCategories: ['Groceries & Essentials'],
    maxTransactionAmount: 4500,
    dailySpendLimit: 15000,
    dailySpentSoFar: 3200,
    humanApprovalThreshold: 5000,
    canRetryPayment: false,
    status: 'active',
    expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    lastActivity: '14 minutes ago',
    apiKeyHash: 'sec_agt_gf118_b29c11...',
    creatorOrg: 'FreshBasket Technologies',
  },
  {
    agentId: 'agt_office_551',
    agentName: 'OfficeProcure-551',
    agentType: 'B2B Enterprise Procurement Agent',
    trustScore: 79,
    verifiedIdentity: true,
    successfulTransactions: 64,
    policyViolations: 2,
    velocityRisk: 19,
    allowedCategories: ['Office Supplies', 'Subscriptions & SaaS'],
    maxTransactionAmount: 25000,
    dailySpendLimit: 75000,
    dailySpentSoFar: 42000,
    humanApprovalThreshold: 25000,
    canRetryPayment: false,
    status: 'active',
    expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    lastActivity: '1 hour ago',
    apiKeyHash: 'sec_agt_op551_7a4e92...',
    creatorOrg: 'WorkSpace Ops AI',
  },
  {
    agentId: 'agt_reorder_032',
    agentName: 'ReorderBot-032',
    agentType: 'Consumer Repeat Purchase Agent',
    trustScore: 62,
    verifiedIdentity: false, // Unverified self-hosted agent
    successfulTransactions: 19,
    policyViolations: 4,
    velocityRisk: 38,
    allowedCategories: ['Subscriptions & SaaS', 'Fashion & Retail'],
    maxTransactionAmount: 3000,
    dailySpendLimit: 6000,
    dailySpentSoFar: 1999,
    humanApprovalThreshold: 2000,
    canRetryPayment: false,
    status: 'under_review',
    expiresAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    lastActivity: '3 hours ago',
    apiKeyHash: 'sec_agt_rb032_unv812...',
    creatorOrg: 'OpenAgent Community',
  },
];

export class AgentTrustService {
  /**
   * Recalculate dynamic trust score for an agent
   */
  public static calculateTrustScore(agent: AgentTrustProfile): number {
    let score = 70; // baseline

    if (agent.verifiedIdentity) score += 15;
    score += Math.min(15, Math.floor(agent.successfulTransactions / 25));
    score -= agent.policyViolations * 10;
    score -= Math.floor(agent.velocityRisk / 5);

    return Math.max(10, Math.min(100, score));
  }

  /**
   * Evaluate whether an agent checkout is within valid identity & cryptographic trust parameters
   */
  public static verifyAgentIdentity(agent: AgentTrustProfile): {
    verified: boolean;
    trustScore: number;
    notes: string[];
    isSafeToProceed: boolean;
  } {
    const notes: string[] = [];

    if (agent.verifiedIdentity) {
      notes.push('Cryptographic identity signature validated (simulated mTLS identity verification; production requires verified Agent Registry).');
    } else {
      notes.push('Self-hosted or unverified agent identity signature. Elevated risk scrutiny applied (simulated).');
    }

    const isExpired = new Date(agent.expiresAt) < new Date();
    if (isExpired) {
      notes.push('Agent authorization session token has EXPIRED. Re-authentication required.');
    } else {
      const remainingHours = Math.max(1, Math.round((new Date(agent.expiresAt).getTime() - Date.now()) / (3600 * 1000)));
      notes.push(`Agent authorization valid for next ${remainingHours} hours.`);
    }

    if (agent.status === 'paused') {
      notes.push('Agent is currently PAUSED by merchant operator.');
    } else if (agent.status === 'revoked') {
      notes.push('Agent authorization has been PERMANENTLY REVOKED.');
    }

    const isSafe = agent.status === 'active' && !isExpired && agent.trustScore >= 50;

    return {
      verified: agent.verifiedIdentity,
      trustScore: agent.trustScore,
      notes,
      isSafeToProceed: isSafe,
    };
  }
}
