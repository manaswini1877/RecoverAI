RecoverAI
Recover revenue. Protect trust. Enable autonomous checkout.

RecoverAI is an independent hackathon prototype for Razorpay Internship Application — Track 1: AI Growth & Agentic Commerce.

It is a trust-aware agentic checkout orchestration layer that helps merchants safely accept AI-agent-initiated payments, recover interrupted transactions, and prevent unauthorized or duplicate charges.

Important: RecoverAI is not an official Razorpay product. It uses synthetic payment, agent, customer, and merchant data for demonstration purposes only.



Table of Contents
•	Overview
•	Problem
•	Solution
•	Key Features
•	Primary Demo
•	Demo Outcomes
•	Application Routes
•	Architecture
•	Decision Engine
•	Data Model
•	Technology Stack
•	Getting Started
•	Available Commands
•	Testing Checklist
•	Security and Responsible AI
•	Production Roadmap
•	Hackathon Pitch
•	Limitations
•	Disclaimer



Overview
Traditional payment systems often respond to a failed payment with a generic retry. This can cause repeated failures, customer frustration, and duplicate-charge risk.

RecoverAI takes a context-aware approach. For every payment event, it evaluates:

•	Who or what initiated the checkout
•	Whether the agent is authorized
•	Whether the purchase matches the original intent
•	Whether the amount is within the spending limit
•	Whether a successful debit or delayed webhook may already exist
•	Whether recovery is likely to succeed
•	Whether human approval is required

RecoverAI then chooses the safest next-best action:

•	Prepare an alternate payment link
•	Wait before attempting recovery
•	Ask the customer to update a payment method
•	Pause while payment status is reconciled
•	Block an unauthorized agent action
•	Request human approval
•	Escalate to support
•	Stop contacting the customer

The central product principle is:

Do not blindly retry failed payments. Decide whether, when, how, and through which channel recovery should happen.



Problem
Agent-initiated commerce introduces new payment questions for merchants:

•	Is the AI agent verified?
•	Is it acting within the customer’s original intent?
•	Is the requested amount within its authorization scope?
•	Can it retry a failed payment?
•	Has the customer already been debited?
•	What happens if the agent changes the cart?
•	When should a human operator intervene?

A normal checkout flow may not understand these questions. RecoverAI adds a merchant-controlled trust and recovery layer between the agent’s intent and payment execution.



Solution
RecoverAI combines two capabilities:

1. Safe agentic checkout
RecoverAI verifies simulated agent identity, checks authorization scope, validates category and amount limits, detects intent drift, and routes risky decisions to a human operator.

2. Trust-aware payment recovery
When a payment fails, RecoverAI classifies the failure, checks duplicate-charge risk, estimates customer intent and recoverability, and chooses a safe recovery action instead of immediately retrying.

This enables both:

•	Growth: more safe agent-initiated purchases reach completion.
•	Trust: unauthorized spending, duplicate charges, and unsafe retries are prevented.



Key Features
Agent identity and trust scoring
Each simulated commerce agent has a trust profile containing:

•	Trust score
•	Simulated identity-verification status
•	Successful transaction history
•	Policy violations
•	Velocity risk
•	Allowed merchant categories
•	Maximum transaction amount
•	Daily spending limit
•	Human-approval threshold
•	Retry permissions
•	Authorization expiry

Authorization scope enforcement
RecoverAI checks whether an agent’s action matches its authorization:

•	Transaction amount
•	Product or merchant category
•	Payment method
•	Daily spending limit
•	Authorization expiry
•	Cart modification percentage
•	Retry permissions

Intent-drift detection
RecoverAI compares the original authorized intent with a new request. For example, an agent authorized to book a hotel for ₹9,800 may not silently increase the purchase to ₹18,000.

Duplicate-charge prevention
Before recovery, RecoverAI runs a safety checklist:

•	Successful debit signal
•	Pending bank confirmation
•	Delayed webhook status
•	Recent retry velocity
•	Idempotency lock
•	Refund or reversal flags

If the risk is too high, recovery is blocked and reconciliation is required.

Next-best-action recovery
The deterministic decision engine selects actions such as:

•	Alternate UPI payment link
•	Payment method update
•	Respectful reminder
•	Delayed retry
•	Reconciliation hold
•	Human support escalation
•	No action

Recovery Constitution
Merchants can configure no-code rules for:

•	Maximum automatic recovery amount
•	Retry limits
•	Minimum delay between attempts
•	Duplicate-risk threshold
•	Confidence threshold
•	Agent transaction limits
•	Daily agent spend limits
•	Human-approval thresholds
•	Allowed categories and payment methods
•	Customer communication limits
•	Autonomy level

Explainable decisions
Every important action includes:

•	Decision confidence
•	Customer intent score
•	Agent trust score
•	Recoverability score
•	Duplicate-charge risk
•	Authorization compliance
•	Plain-English reasoning
•	Safety checklist
•	Audit timeline

Agent Action Receipt
Completed or blocked actions generate an auditable receipt containing:

•	Receipt ID
•	Case ID
•	Agent and customer alias
•	Original amount
•	Requested amount
•	Recovered revenue
•	Failure diagnosis
•	Recovery action
•	Trust safeguards
•	Human-approval requirement
•	Final outcome
•	Policy version
•	Timestamp

The receipt can be exported as JSON in the browser.



Primary Demo
The recommended demonstration uses a fictional travel agent called TravelMate-204.

Scenario
•	Agent: TravelMate-204
•	Customer: Customer T-204
•	Intent: Book a hotel for a weekend trip
•	Allowed category: Hotels & Travel
•	Original checkout amount: ₹9,800
•	Maximum authorized amount: ₹12,000
•	Payment method: UPI
•	Failure: Temporary UPI timeout
•	Agent trust score: 88/100
•	Customer intent score: 91%
•	Duplicate-charge risk: 4%

Five-step presentation story
1	Agent initiates checkout

2	TravelMate-204 starts a ₹9,800 hotel checkout.
3	RecoverAI verifies identity and scope

4	The agent is shown as simulated-verified. The category and amount are within scope.
5	Payment fails safely

6	The UPI payment times out. RecoverAI checks for duplicate debit and delayed webhook risk instead of blindly retrying.
7	Safe recovery is prepared

8	RecoverAI recommends a short cooldown followed by an alternate UPI payment link.
9	Intent drift is blocked

10	The agent tries to increase the purchase to ₹18,000. RecoverAI blocks the request because the maximum authorized amount is ₹12,000 and asks for human approval.

Seven-stage internal pipeline
The interface may display the following internal pipeline:

Event Received
      ↓
Diagnose
      ↓
Understand Intent
      ↓
Protect Against Duplicate Charges
      ↓
Verify Agent Scope
      ↓
Choose Next-Best Action
      ↓
Recover, Escalate, or Block
      ↓
Measure Outcome



Demo Outcomes
RecoverAI must keep successful recovery and safety blocking as separate outcomes.

Successful safe recovery
Original amount: ₹9,800
Recovered revenue: ₹9,800
Outcome: RECOVERED
Payment status: CAPTURE_SIMULATED
Recovery action: Alternate UPI link
Duplicate-charge risk: 4%
Retries avoided: 1

This outcome should occur when the simulated customer completes payment through the alternate link.

Blocked over-limit request
Original amount: ₹9,800
Requested amount: ₹18,000
Maximum authorized amount: ₹12,000
Recovered revenue: ₹0
Outcome: BLOCKED_BY_SCOPE
Human approval required: Yes
Reason: Requested amount exceeds authorization scope

A blocked request must never be presented as successfully recovered.



Application Routes
Route	Purpose
/	Marketing landing page
/demo	Guided hackathon demo
/login	Optional mock demo sign-in
/app/overview	Recovery and agentic-commerce command center
/app/agent-checkout	Agent checkout monitor
/app/agents	AI agent registry and controls
/app/cases	Failed-payment case queue
/app/cases/:id	Explainable case details
/app/live-agent	Simulated agent activity stream
/app/analytics	Recovery and agentic-commerce analytics
/app/policies	Recovery Constitution and autonomy rules
/app/customers	Privacy-conscious customer recovery history
/app/integrations	Mock payment events and webhook setup
/app/settings	Workspace and demo settings


Architecture
User or AI Agent Intent
          |
          v
Agent Identity and Trust Service
          |
          v
Authorization Scope Service
          |
          v
Payment Event Simulator
          |
          v
Failure Diagnosis Engine
          |
          v
Duplicate-Charge Safety Service
          |
          v
Recovery Constitution / Policy Service
          |
          v
Next-Best-Action Decision Engine
          |
      +---+---+
      |       |
      v       v
 Recover   Escalate or Block
      |
      v
Action Receipt and Analytics

Core services
•	RecoveryDecisionEngine — Diagnoses payment failures and selects recovery actions.
•	DuplicateChargeSafetyService — Prevents unsafe retries and duplicate charges.
•	RecoveryPolicyService — Applies merchant-configured autonomy and risk policies.
•	AgentTrustService — Calculates simulated agent trust scores.
•	AuthorizationScopeService — Checks amount, category, expiry, and spending limits.
•	AgentCheckoutService — Coordinates agent-initiated checkout state transitions.
•	RecoveryContext — Stores demo state and persists it in LocalStorage.



Decision Engine
The application uses a deterministic local simulation so the demo does not depend on an external API.

Temporary UPI timeout
•	Check for successful debit signals.
•	Check pending or delayed webhooks.
•	Avoid immediate blind retry.
•	Recommend a cooldown.
•	Offer an alternate UPI payment link if safe.

Expired card
•	Do not retry the same card.
•	Ask the customer to update the payment method.
•	Offer a secure payment link.

Insufficient balance
•	Avoid repeated retries.
•	Send one respectful reminder.
•	Offer a later retry or alternate payment method.

Bank outage
•	Pause recovery.
•	Inform the customer.
•	Suggest another payment method.
•	Retry only when the rail is available.

Delayed webhook
•	Block recovery temporarily.
•	Reconcile payment status first.
•	Prevent duplicate debit.

Duplicate debit detected
•	Block retry.
•	Mark the case for reconciliation.
•	Escalate when required.

Abandoned checkout
•	Estimate customer intent.
•	Send no more than one contextual reminder.
•	Stop contact after opt-out or repeated inactivity.

High-value payment
•	Require human approval.
•	Do not automatically retry above the configured threshold.

Agent intent drift
•	Compare the original and new amounts.
•	Compare categories and authorization scope.
•	Block over-limit amounts.
•	Require approval for excessive cart changes.



Data Model
A representative TypeScript model is shown below:

type InitiatedBy =
  | "human"
  | "shopping_agent"
  | "merchant_agent"
  | "subscription_agent";
 
type PaymentStatus =
  | "FAILED"
  | "RECOVERY_PENDING"
  | "RECOVERY_LINK_SENT"
  | "RECOVERED"
  | "RECONCILIATION_REQUIRED"
  | "BLOCKED_BY_SCOPE"
  | "BLOCKED_BY_SAFETY"
  | "ESCALATED";
 
type RecoveryOutcome =
  | "RECOVERED"
  | "BLOCKED_BY_SCOPE"
  | "BLOCKED_BY_SAFETY"
  | "ESCALATED"
  | "EXPIRED"
  | "PENDING";
 
type AgentTrustProfile = {
  agentId: string;
  agentName: string;
  trustScore: number;
  verifiedIdentity: boolean;
  successfulTransactions: number;
  policyViolations: number;
  velocityRisk: number;
  allowedCategories: string[];
  maxTransactionAmount: number;
  dailySpendLimit: number;
  humanApprovalThreshold: number;
  canRetryPayment: boolean;
  expiresAt: string;
};
 
type ActionReceipt = {
  receiptId: string;
  caseId: string;
  originalAmount: number;
  requestedAmount?: number;
  recoveredRevenue: number;
  outcome: RecoveryOutcome;
  paymentStatus: PaymentStatus;
  recoveryAction: string;
  failureDiagnosis: string;
  duplicateChargeRisk: number;
  retriesAvoided: number;
  customerMessagesSent: number;
  humanApprovalRequired: boolean;
  reason: string;
  createdAt: string;
};

The implementation should ensure that recoveredRevenue is only greater than zero when the outcome is RECOVERED.



Technology Stack
The prototype is designed for a lightweight frontend-first implementation:

•	Frontend: React and TypeScript
•	Build tool: Vite
•	Styling: Tailwind CSS
•	Icons: Lucide Icons
•	Charts: Lightweight SVG or CSS charts
•	State: React Context or equivalent centralized store
•	Persistence: LocalStorage
•	Payment data: Synthetic local simulation
•	Authentication: Optional mock sign-in only
•	External integrations: Not required for the demo



Getting Started
Prerequisites
Install:

•	Node.js 18 or later
•	npm

Installation
From the project directory:

npm install

Start the development server
npm run dev

Open the URL shown in the terminal. The default Vite URL is usually:

http://localhost:5173

Production preview
Build the application:

npm run build

Preview the production build:

npm run preview

The default preview URL is usually:

http://localhost:4173



Available Commands
The exact commands depend on the generated project, but commonly include:

npm run dev       # Start development server
npm run build     # Create production build
npm run preview   # Preview production build
npm run lint      # Run lint checks, if configured
npm run typecheck # Run TypeScript checks, if configured



Testing Checklist
Main demo
•	☐Start from a clean demo reset.
•	☐TravelMate-204 initiates a ₹9,800 UPI checkout.
•	☐Agent identity verification is displayed as simulated.
•	☐Authorization limit of ₹12,000 is visible.
•	☐Temporary UPI timeout is diagnosed.
•	☐Duplicate-charge safety check is displayed.
•	☐Blind immediate retry is avoided.
•	☐Alternate payment link is prepared.
•	☐“Simulate Customer Paid” completes safe recovery.
•	☐Recovered revenue becomes ₹9,800.
•	☐Outcome becomes RECOVERED.
•	☐Action Receipt displays the updated state.
•	☐Receipt JSON downloads successfully.

Blocked agent action
•	☐Agent requests an increase from ₹9,800 to ₹18,000.
•	☐Intent drift is detected.
•	☐The amount overrun of ₹6,000 is shown.
•	☐The transaction is blocked or gated for human approval.
•	☐Recovered revenue remains ₹0 for the blocked request.
•	☐Outcome becomes BLOCKED_BY_SCOPE.
•	☐Audit timeline is updated.
•	☐Blocked Action Receipt is generated.

Policy controls
•	☐Changing maximum recovery amount affects decisions.
•	☐Changing confidence threshold affects decisions.
•	☐Changing duplicate-risk threshold affects decisions.
•	☐Disabling retries prevents retry actions.
•	☐Observe-only mode prevents automatic execution.
•	☐Policy changes persist after refresh.
•	☐Reset restores seeded policy values.

Agent controls
•	☐Pausing an agent blocks new checkout actions.
•	☐Lowering an agent’s spending limit changes authorization results.
•	☐Revoking authorization blocks future checkout.
•	☐Agent controls persist after refresh.

Browser and responsive QA
•	☐All routes render without blank screens.
•	☐Hard refresh works on all routes.
•	☐No uncaught browser console errors.
•	☐Desktop layout works at 1440×900.
•	☐Tablet layout works at 768×1024.
•	☐Mobile layout works at 390×844.
•	☐Command palette opens with Ctrl/Cmd + K.
•	☐D opens the demo.
•	☐Focus states and keyboard navigation work.



Security and Responsible AI
RecoverAI follows these prototype safeguards:

•	Never blindly retry a failed payment.
•	Check delayed webhooks before recovery.
•	Prevent duplicate charges.
•	Verify simulated agent identity and authorization scope.
•	Respect customer opt-out preferences.
•	Limit communication frequency.
•	Require human approval for high-value or low-confidence actions.
•	Block amount overruns and category mismatches.
•	Keep an audit trail of agent actions.
•	Allow merchants to pause or revoke agents.
•	Show confidence scores and plain-English reasons.
•	Avoid manipulative customer messaging.
•	Never expose secrets or payment credentials.
•	Use only synthetic customer and payment data.



Production Roadmap
A production implementation would require additional work beyond this hackathon prototype:

11	Real payment-provider event ingestion and webhook verification.
12	Cryptographic agent identity and authorization verification.
13	Idempotency and payment-state reconciliation against provider APIs.
14	Secure secrets management.
15	Role-based access control and real authentication.
16	Audit-log immutability and compliance controls.
17	Customer-consent and communication-preference management.
18	Production-grade fraud and anomaly detection.
19	Observability, alerting, retries, and background workers.
20	Security review, privacy review, and payment compliance validation.
21	Real merchant, agent, and messaging integrations.
22	Model evaluation and monitoring if an LLM is introduced.



Hackathon Pitch
Today, e-commerce platforms are designed for humans to search, decide, and pay. Agentic commerce changes that: AI agents will increasingly search, negotiate, and initiate purchases on behalf of people.

RecoverAI provides the missing trust layer. It verifies the initiating agent, enforces spending and category authorization, detects intent drift, prevents duplicate charges, and recovers safe payment failures without blindly retrying.

In our demo, TravelMate-204 is authorized to spend ₹12,000. It initiates a ₹9,800 hotel payment, which times out. RecoverAI checks duplicate-charge risk and prepares a safe alternate payment link. When the agent tries to increase the order to ₹18,000, RecoverAI blocks it and requests human approval.

RecoverAI helps safe autonomous purchases complete while stopping unsafe autonomous actions.



Limitations
RecoverAI is a frontend-first hackathon prototype. It currently uses:

•	Synthetic payment events
•	Simulated agent identity verification
•	Deterministic local decision logic
•	LocalStorage persistence
•	Simulated payment capture
•	Mock integrations
•	Optional mock sign-in

It does not execute real payments, connect to production Razorpay systems, verify real cryptographic signatures, receive real webhooks, or send real customer messages.



Disclaimer
RecoverAI is an independent hackathon prototype using synthetic payment and agent events. It is not an official Razorpay product.

All names, customer aliases, payment records, metrics, webhook URLs, and transaction values shown in the application are illustrative demonstration data.
