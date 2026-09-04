RecoverAI
Recover revenue. Protect trust. Enable autonomous checkout.
A trust-aware agentic checkout and payment-recovery layer for merchants.

RecoverAI is an independent hackathon prototype created for the Razorpay Internship Application — Track 1: AI Growth & Agentic Commerce.

It helps merchants safely handle payments initiated by AI agents by verifying simulated agent identity, enforcing authorization limits, detecting intent drift, preventing duplicate charges, and recovering safe payment failures.

Disclaimer: RecoverAI is not an official Razorpay product. It uses synthetic payment, customer, merchant, and agent data for demonstration purposes only.



Why RecoverAI?
AI agents will increasingly search, choose, and pay on behalf of people. This creates a new trust problem for merchants:

•	Is the agent authorized to make this purchase?
•	Does the amount match the customer’s original intent?
•	Is the requested category allowed?
•	Can the agent retry a failed payment?
•	Has the customer already been debited?
•	When should a human operator intervene?

Traditional checkout systems often treat every payment attempt the same and may retry failures blindly. RecoverAI adds an explainable control layer between agent intent and payment execution.

RecoverAI helps safe autonomous purchases complete while stopping unsafe autonomous actions.



Core Capabilities
Agentic checkout control
•	Simulated agent identity verification
•	Agent trust scoring
•	Authorization-scope validation
•	Transaction and daily spending limits
•	Allowed category and payment-method restrictions
•	Authorization expiry checks
•	Human approval for high-value or low-confidence actions
•	Pause and revoke controls for merchant operators

Intent-drift detection
RecoverAI compares the original authorized intent with a new request. If an agent attempts to increase the amount or change the category beyond its scope, the transaction is blocked or routed for approval.

Trust-aware payment recovery
Instead of blindly retrying a failed payment, RecoverAI diagnoses the failure and chooses a safer next-best action:

•	Alternate payment link
•	Delayed retry
•	Payment-method update
•	Customer reminder
•	Reconciliation hold
•	Human-support escalation
•	No action

Duplicate-charge protection
Before recovery, the system checks for:

•	Successful debit signals
•	Pending bank confirmation
•	Delayed webhook status
•	Recent retry activity
•	Idempotency protection
•	Refund or reversal flags

Explainable AI decisions
Each decision includes:

•	Customer intent score
•	Agent trust score
•	Recoverability score
•	Duplicate-charge risk
•	Authorization compliance
•	Decision confidence
•	Plain-English reasoning
•	Safety checklist
•	Full audit timeline

Agent Action Receipt
Every completed, blocked, or escalated case can generate an auditable receipt containing the final state, action taken, safeguards applied, outcome, policy version, and timestamp. Receipts can be exported as JSON.



Primary Demo: TravelMate-204
The recommended hackathon demo uses a fictional travel agent.

Field	Value
Agent	TravelMate-204
Customer	Customer T-204
Intent	Book a hotel for a weekend trip
Category	Hotels & Travel
Original amount	₹9,800
Maximum authorized amount	₹12,000
Payment method	UPI
Failure	Temporary UPI timeout
Agent trust score	88/100
Duplicate-charge risk	4%
Demo story
1	TravelMate-204 initiates a ₹9,800 hotel checkout.
2	RecoverAI verifies the simulated agent identity and authorization scope.
3	The UPI payment times out.
4	RecoverAI checks duplicate-charge risk instead of performing a blind retry.
5	A safe alternate UPI payment link is prepared after a cooldown.
6	The agent attempts to increase the purchase to ₹18,000.
7	RecoverAI detects intent drift and blocks the request because the authorization limit is ₹12,000.
8	A human operator can approve, reject, pause, or revoke the action.
9	RecoverAI generates an Agent Action Receipt and updates the dashboard metrics.

Successful recovery outcome
Original amount: ₹9,800
Recovered revenue: ₹9,800
Outcome: RECOVERED
Recovery action: Alternate UPI payment link
Retries avoided: 1
Duplicate-charge risk: 4%

Blocked agent outcome
Original amount: ₹9,800
Requested amount: ₹18,000
Maximum authorized amount: ₹12,000
Recovered revenue: ₹0
Outcome: BLOCKED_BY_SCOPE
Human approval required: Yes
Reason: Requested amount exceeds authorization scope



Product Flow
Agent or Customer Intent
          ↓
Verify Agent Identity
          ↓
Check Authorization Scope
          ↓
Diagnose Payment Event
          ↓
Run Duplicate-Charge Safety Check
          ↓
Apply Merchant Policy
          ↓
Choose Next-Best Action
          ↓
Recover, Approve, Escalate, or Block
          ↓
Generate Action Receipt



Key Screens
Screen	Purpose
Landing page	Explain the product and its trust layer
Guided demo	Present the TravelMate-204 scenario
Overview	Monitor recovery, agent checkouts, and blocked actions
Agent checkout	View active agent sessions and authorization checks
Agents	Manage trust scores, limits, pause, and revoke controls
Payment cases	Search and filter failed-payment cases
Case detail	Inspect reasoning, safeguards, communication, and receipt
Live agent	Watch the simulated decision pipeline
Analytics	View recovery and agentic-commerce insights
Recovery Constitution	Configure autonomy and safety policies
Integrations	Inspect simulated payment events and webhook payloads
Settings	Manage demo workspace and reset synthetic data


Technology Stack
•	Frontend: React + TypeScript
•	Build tool: Vite
•	Styling: Tailwind CSS
•	Icons: Lucide Icons
•	Charts: Lightweight SVG/CSS charts
•	State management: React Context or equivalent centralized store
•	Persistence: LocalStorage
•	Decision engine: Deterministic local simulation
•	Payment data: Synthetic local events
•	Authentication: Optional mock demo sign-in

The default demo requires no external API keys, real payment credentials, or production integrations.



Project Structure
src/
├── components/                         # Reusable UI components
├── context/
│   └── RecoveryContext.tsx             # Centralized demo state
├── pages/                              # Application views and routes
├── services/
│   ├── AgentCheckoutService.ts         # Agent checkout orchestration
│   ├── AgentTrustService.ts            # Simulated agent trust scoring
│   ├── AuthorizationScopeService.ts    # Limits and scope validation
│   ├── DuplicateChargeSafetyService.ts# Duplicate-charge protection
│   ├── RecoveryDecisionEngine.ts       # Failure diagnosis and recovery
│   └── RecoveryPolicyService.ts        # Merchant policy enforcement
├── types.ts                            # Shared TypeScript models
└── App.tsx                             # Application routing



Getting Started
Prerequisites
•	Node.js 18 or later
•	npm

Install dependencies
npm install

Start the development server
npm run dev

Open the local URL shown in the terminal. It is usually:

http://localhost:5173

Build for production
npm run build

Preview the production build
npm run preview

The preview URL is usually:

http://localhost:4173

Optional checks
npm run typecheck
npm run lint

These commands are available if configured in package.json.



Suggested Presentation Flow
Open /demo and follow this sequence:

10	Start the TravelMate-204 scenario.
11	Show the ₹9,800 authorized checkout.
12	Demonstrate agent identity and scope verification.
13	Trigger the temporary UPI timeout.
14	Show duplicate-charge protection and safe recovery recommendation.
15	Trigger the agent’s ₹18,000 amount increase.
16	Show the authorization overrun being blocked.
17	Approve or reject the action as a human operator.
18	Generate the final Action Receipt.
19	Show updated recovery and trust metrics.

For a successful recovery test, select the simulated customer-paid action after the alternate payment link is prepared. The receipt should show RECOVERED and ₹9,800 recovered revenue.

For the safety test, trigger the ₹18,000 amount increase. The receipt should show BLOCKED_BY_SCOPE and ₹0 recovered revenue.



Safety and Responsible AI
RecoverAI is designed around controlled autonomy:

•	It never blindly retries a failed payment.
•	It checks payment status before recovery.
•	It prevents duplicate-charge risk.
•	It respects customer opt-out preferences.
•	It limits customer communication frequency.
•	It blocks amount overruns and category mismatches.
•	It requires human approval for high-value or low-confidence actions.
•	It allows merchants to pause or revoke agents.
•	It keeps an audit trail for every decision.
•	It shows the reason behind every major action.

The application uses the term simulated agent identity verification because the prototype does not implement production cryptographic identity verification or mutual TLS.



Production Roadmap
A production implementation would require:

20	Real payment-provider APIs and verified webhooks.
21	Cryptographic agent identity and authorization.
22	Idempotency and payment-state reconciliation.
23	Secure secrets management.
24	Real authentication and role-based access control.
25	Immutable audit logs.
26	Production fraud and anomaly detection.
27	Customer consent and communication management.
28	Background workers and observability.
29	Security, privacy, and payment-compliance review.
30	Real merchant, agent, and messaging integrations.
31	Model evaluation and monitoring if an LLM is introduced.



Limitations
This is a frontend-first hackathon prototype. It currently uses:

•	Synthetic payment events
•	Simulated agent verification
•	Deterministic local decision logic
•	LocalStorage persistence
•	Simulated payment capture
•	Mock integrations
•	Optional mock sign-in

It does not execute real payments, connect to production Razorpay systems, receive real webhooks, verify real cryptographic signatures, or send real customer messages.



Hackathon Pitch
AI agents will soon search, choose, and pay on behalf of people. But merchants need a way to trust and control those autonomous actions.

RecoverAI is that trust layer. It verifies the initiating agent, enforces spending and category authorization, detects intent drift, prevents duplicate charges, and recovers safe payment failures without blindly retrying.

In our demo, TravelMate-204 is authorized to spend ₹12,000. It initiates a ₹9,800 hotel payment, which times out. RecoverAI checks duplicate-charge risk and prepares a safe alternate payment link. When the agent tries to increase the order to ₹18,000, RecoverAI blocks it and requests human approval.

RecoverAI helps safe autonomous purchases complete while stopping unsafe autonomous actions.



Disclaimer
RecoverAI is an independent hackathon prototype using synthetic payment and agent events. It is not an official Razorpay product.

All names, aliases, transaction values, metrics, payment events, and integrations shown in this project are illustrative demonstration data.
