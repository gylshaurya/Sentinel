# 🛡️ Sentinel — AI Guardian Swarm for DeFi

> *"The problem isn't intelligence — it's guaranteed execution under adversarial conditions."*

Sentinel is a **multi-agent DeFi position guardian swarm** that continuously monitors cross-protocol lending and liquidity positions, reasons about risk using verifiable AI inference, and executes protective transactions through **KeeperHub** with guaranteed delivery. Every decision is cryptographically provable. Every execution is auditable on-chain by any third party — without trusting the Sentinel team.

---

## 🏆 Track Submissions

| Track | Focus |
|---|---|
| **0G Autonomous Agents** | Multi-agent swarm · iNFT evolution · all 5 0G primitives |
| **KeeperHub Focus Area 2** | MCP integration · x402 payments · Turnkey wallet · marketplace publishing |

---

## 🎯 The Problem We Solve

On **March 12, 2020 ("Black Thursday")**, $8M in MakerDAO vaults were liquidated at $0 because keeper bots failed to submit transactions fast enough during a gas crisis. The problem wasn't intelligence — it was **guaranteed execution under adversarial conditions**: gas too low, nonce collisions, MEV extraction, silent failures.

Sentinel addresses this at both layers:

- **Intelligence layer**: A three-agent swarm that reasons about your entire cross-protocol DeFi exposure using TEE-verified AI inference on 0G Compute. Every decision has a cryptographic proof.
- **Execution layer**: KeeperHub delivers the transaction with exponential backoff retry, multi-RPC failover, gas optimization, and MEV-protected routing. This is exactly the infrastructure that was absent on Black Thursday.

---

## 🤖 The Three-Agent Swarm

### Agent 1 — Risk Agent
Continuously polls Spark and Aave health factors using `verifiedEvaluate()` on 0G Compute. Every response is TEE-signed — the output is cryptographically tied to a specific model run inside a secure enclave. When health factor drops below the registered threshold, the Risk Agent emits a signed proposal with an `executionId`.

It injects the last 5 risk cycles from **0G Storage** into its prompt, so it knows whether the health factor has been trending down vs. spiked suddenly, and calibrates urgency accordingly.

### Agent 2 — Yield Agent
Monitors Uniswap V3 LP positions by reading the current tick from each pool's `slot0()` function. If the current tick is outside the registered `[tickLower, tickUpper]` range, the position earns zero fees and a rebalance proposal is emitted. Cross-references **0G DA** blobs from past rebalances to avoid position thrashing (anti-thrashing cooldown + net-benefit check).

### Agent 3 — Swarm Coordinator (iNFT)
The orchestrator. Receives proposals from both agents, applies a priority queue (RISK before YIELD), and routes the approved action to **KeeperHub via MCP**. The Coordinator is minted as an **ERC-7857-inspired iNFT** on 0G Galileo. Its intelligence (memory, risk thresholds, strategy fingerprint) is AES-256-encrypted and embedded in 0G Storage. Its `experienceCycles` counter increments on-chain after every successful execution. It can be sold — whoever buys it inherits a battle-tested guardian with full execution history.

### How Agents Communicate

```
Risk Agent ──────────┐
                     ▼
                 ProposalQueue (priority: RISK=1, YIELD=2, HOLD=3)
                     │
Yield Agent ─────────┘
                     ▼
             Swarm Coordinator
                     │
            ┌────────┼────────┐
            ▼        ▼        ▼
        0G Compute  0G DA  0G Storage
        (TEE proof) (blob)  (DAG memory)
                     │
                     ▼
             InferenceGuard.submitProof()
             InferenceGuard.isProofValid()   ← gates execution
                     │
                     ▼
             KeeperHub MCP
             keeperhub.create_workflow()
             keeperhub.trigger_execution()
                     │
                     ▼
             consumeProof() + incrementExperience()
```

No action reaches the chain without a valid 0G DA proof. This is enforced at the **contract level**, not just by convention.

---

## 🟣 0G Protocol — Every Primitive Used

| 0G Layer | How Sentinel Uses It |
|---|---|
| **0G Compute** | `verifiedEvaluate()` for all Risk Agent inferences. Every response is TEE-signed — cryptographically proving an audited model ran it, not a fabricated result. |
| **0G Storage** | Agent memory as a DAG — each cycle loads the last N cycles as context. Stores position snapshots, reasoning traces, and iNFT intelligence blob. |
| **0G DA** | Every execution result is written as a blob to 0G DA. The returned `rootHash` is submitted to InferenceGuard. Audit trail is verifiable by any third party without trusting Sentinel. |
| **ERC-7857 iNFT** | Swarm Coordinator is minted as an iNFT on 0G Galileo. Intelligence is AES-256-GCM encrypted and embedded. Evolves with every cycle. Transferable with full history intact. |
| **0G Chain** | All three core contracts deployed on 0G Galileo (chainId 16602). InferenceGuard gates transaction approval based on 0G DA proof hashes. |

### iNFT Details

- **Token #0** minted at: [`0x1A686bb2b8453A543ECA148bDbdE4155EB56a7B1`](https://chainscan-galileo.0g.ai/address/0x1A686bb2b8453A543ECA148bDbdE4155EB56a7B1)
- `storagePointer` references the encrypted intelligence blob on 0G Storage
- `experienceCycles` increments on-chain after every confirmed execution — live verifiable evidence of agent activity
- `strategyFingerprint` encodes risk tolerance, max actions per cycle, and decision quality — evolves as the agent learns

---

## 🟢 KeeperHub — Every Feature Used

| KeeperHub Feature | How Sentinel Uses It |
|---|---|
| **MCP server** | Swarm Coordinator calls KeeperHub natively as an MCP tool — `keeperhub.create_workflow()` and `keeperhub.trigger_execution()`. Zero custom middleware. |
| **x402 + MPP payments** | The agent pays KeeperHub per execution in USDC via x402. Fully autonomous — no human approves payments. Uses KeeperHub's newest feature and directly targets Focus Area 2. |
| **Turnkey wallet (TEE keys)** | KeeperHub's non-custodial wallet signs every transaction inside a Turnkey enclave. Keys never leave the enclave + remote attestation. Combined with 0G Compute TEE — both the decision and the signing are hardware-verified. |
| **Publish workflow + earn per call** | Sentinel publishes its guard workflows ("Spark Liquidation Shield", "LP Range Rebalancer") to the KeeperHub marketplace as callable units. Other protocols pay per execution via x402. Sentinel becomes a passive income stream. |
| **Exponential backoff + multi-RPC failover** | KeeperHub retries failed transactions with exponential backoff across multiple RPC endpoints. This is exactly what failed on Black Thursday. |

### Published Workflows

```json
sentinel-spark-liquidation-shield   →  LIQUIDATION_PROTECTION
sentinel-lp-range-rebalancer        →  LP_REBALANCE
```

Both are listed on the KeeperHub marketplace with `payment.method: "x402"`. Any other protocol or agent can call Sentinel's logic and pay per execution — turning the guardian into a protocol primitive.

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AGENT LAYER                              │
│   ┌──────────────┐   ┌─────────────────────┐   ┌────────────┐  │
│   │  Risk Agent  │   │  Swarm Coordinator  │   │Yield Agent │  │
│   │  (0G Compute)│──▶│  iNFT ERC-7857      │◀──│  (rule)    │  │
│   └──────────────┘   └─────────────────────┘   └────────────┘  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                         0G LAYER                                │
│   ┌────────────┐   ┌──────────────┐   ┌──────────────────────┐  │
│   │ 0G Compute │   │  0G Storage  │   │       0G DA          │  │
│   │ TEE proofs │   │  DAG memory  │   │  rootHash blobs      │  │
│   └────────────┘   └──────────────┘   └──────────────────────┘  │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   InferenceGuard.sol   │                         │
│              │  submitProof/isValid   │                         │
│              └────────────────────────┘                         │
└─────────────────────────────┬───────────────────────────────────┘
                              │  (proof valid → proceed)
┌─────────────────────────────▼───────────────────────────────────┐
│                      KEEPERHUB LAYER                            │
│   ┌───────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│   │  MCP Server   │  │ x402 Payment │  │  Turnkey TEE wallet │ │
│   │create_workflow│  │ USDC approve │  │  enclave key sign   │ │
│   └───────────────┘  └──────────────┘  └─────────────────────┘ │
│                ▼                                                 │
│   ┌─────────────────────────────────────────┐                   │
│   │         KeeperHub Marketplace           │                   │
│   │  Spark Shield · LP Rebalancer · per-call│                   │
│   └─────────────────────────────────────────┘                   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      ON-CHAIN (0G Galileo)                      │
│   ┌────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│   │ SentinelINFT   │  │ PositionRegistry │  │InferenceGuard │  │
│   │experienceCycles│  │ Spark·Aave·UniV3 │  │  rootHash gating│ │
│   └────────────────┘  └──────────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Deployed Contracts — 0G Galileo Testnet (chainId 16602)

| Contract | Address |
|---|---|
| **SentinelINFT** | [`0x1A686bb2b8453A543ECA148bDbdE4155EB56a7B1`](https://chainscan-galileo.0g.ai/address/0x1A686bb2b8453A543ECA148bDbdE4155EB56a7B1) |
| **PositionRegistry** | [`0x22D6e5c83b1fE929F6572b84C4dBA63e6607aE2A`](https://chainscan-galileo.0g.ai/address/0x22D6e5c83b1fE929F6572b84C4dBA63e6607aE2A) |
| **InferenceGuard** | [`0xFc3edaB7F7932c2Ce052F9B516051C60015c5Ba5`](https://chainscan-galileo.0g.ai/address/0xFc3edaB7F7932c2Ce052F9B516051C60015c5Ba5) |
| **MockUniswapV3Pool** | [`0x6111c3eb73CB49216556A0080e5C59086a5f7794`](https://chainscan-galileo.0g.ai/address/0x6111c3eb73CB49216556A0080e5C59086a5f7794) |
| **MockUSDC** | [`0x7c0B4F303f03dA90fE9790cf328B03414b71DF69`](https://chainscan-galileo.0g.ai/address/0x7c0B4F303f03dA90fE9790cf328B03414b71DF69) |

Explorer: [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)

---

## 🚀 Quick Start

### Requirements
- Node.js 18+
- Wallet with 0G Galileo testnet tokens ([faucet.0g.ai](https://faucet.0g.ai))

### Install

```bash
# Root dependencies (contracts + agents)
npm install --save-dev hardhat@2.22.17 @nomicfoundation/hardhat-ethers@3.0.8 ethers@6.13.4 --legacy-peer-deps
npm install @openzeppelin/contracts@5.0.2 dotenv --legacy-peer-deps

# Frontend
cd frontend && npm install
```

### Environment

Create `.env` in project root:

```env
PRIVATE_KEY=your_metamask_private_key
RPC_URL=https://evmrpc-testnet.0g.ai
RPC_URLS=https://evmrpc-testnet.0g.ai

# Optional KeeperHub integration
KEEPERHUB_API_KEY=your_key
KEEPERHUB_BASE_URL=https://api.keeperhub.io
KEEPERHUB_MCP_ENABLED=false
X402_ENABLED=false
USDC_CONTRACT=0x7c0B4F303f03dA90fE9790cf328B03414b71DF69

# Agent settings
YIELD_POLL_MS=15000
RISK_POLL_MS=20000
COORDINATOR_POLL_MS=5000
INFT_TOKEN_ID=0
```

### Deploy Contracts

```bash
# Compile
npx hardhat compile

# Deploy core contracts + mint iNFT #0
npx hardhat run scripts/deploy.js --network galileo

# Deploy demo Uniswap pool + register LP position
npx hardhat run scripts/deployMockPool.js --network galileo

# Deploy mock USDC for x402 payments
npx hardhat run scripts/deployUSDC.js --network galileo
```

### Run the Swarm

```bash
# Start everything (Coordinator + Risk Agent + Yield Agent)
node runSystem.js

# Or run individually:
node agents/coordinator/index.js    # Swarm Coordinator (iNFT)
node agents/riskAgent/index.js      # Risk Agent
node yieldAgent.js                  # Yield Agent
```

### Publish Workflows to KeeperHub Marketplace

```bash
node workflows/workflowPublisher.js
```

### Live Demo — Trigger Out-of-Range Event

```bash
# Move LP tick OUT of range (triggers Yield Agent)
npx hardhat run scripts/demoTrigger.js --network galileo

# Reset back to in-range
npx hardhat run scripts/demoReset.js --network galileo
```

### Run Frontend

```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

---

## 🧪 Testing

```bash
# Contract unit tests
npx hardhat test

# Agent unit tests
npx hardhat test test/unit/yieldAgent.test.js
npx hardhat test test/unit/coordinator.test.js
npx hardhat test test/unit/priorityEngine.test.js
npx hardhat test test/unit/proposalQueue.test.js

# KeeperHub integration tests
npx hardhat test test/integration/keeperhub.test.js
npx hardhat test test/integration/clientRouting.test.js

# E2E simulation (full guardian cycle)
npx hardhat test test/integration/e2e-simulation.test.js

# Frontend tests
cd frontend && npm test

# 0G integration tests
cd og-integration && npm test
```

---

## 🗂️ Project Structure

```
sentinel/
├── contracts/
│   ├── SentinelINFT.sol          # ERC-7857-inspired iNFT — experience tracking
│   ├── PositionRegistry.sol      # Registry of monitored DeFi positions
│   ├── InferenceGuard.sol        # Proof gatekeeper — no 0G DA proof = no execution
│   ├── MockUniswapV3Pool.sol     # Demo pool with controllable tick
│   └── MockUSDC.sol              # Mock USDC for x402 payment testing
├── agents/
│   ├── coordinator/
│   │   ├── index.js              # Swarm Coordinator — full proof lifecycle
│   │   ├── priorityEngine.js     # RISK > YIELD > HOLD priority classification
│   │   └── proposalQueue.js      # Priority queue with timestamp tiebreaking
│   └── riskAgent/
│       └── index.js              # Risk Agent — Aave/Spark health factor polling
├── keeperhub/
│   ├── client.js                 # KeeperHub unified client (MCP + REST)
│   ├── mcpClient.js              # MCP server integration
│   ├── restClient.js             # REST API fallback
│   ├── nonceManager.js           # Serialized tx nonce management
│   ├── retryHandler.js           # Exponential backoff retry
│   ├── rpcFailover.js            # Multi-RPC endpoint failover
│   └── x402Payment.js            # x402 USDC payment approval
├── og-integration/
│   └── src/
│       ├── agents/               # TypeScript agent implementations
│       ├── services/             # 0G Compute / Storage / DA clients
│       ├── inft/                 # iNFT metadata evolution
│       └── pipeline/             # Full execution pipeline
├── workflows/
│   ├── sparkLiquidationShield.json   # KeeperHub workflow definition
│   ├── lpRangeRebalancer.json        # KeeperHub workflow definition
│   └── workflowPublisher.js          # Publishes to KeeperHub marketplace
├── frontend/
│   └── src/
│       ├── App.tsx               # Guardian Console UI
│       ├── hooks/useSentinel.ts  # React hook — on-chain data + events
│       └── contracts/            # ABIs and deployed addresses
├── scripts/
│   ├── deploy.js                 # Deploy all contracts + mint iNFT
│   ├── deployMockPool.js         # Deploy demo pool + register position
│   ├── deployUSDC.js             # Deploy mock USDC
│   ├── demoTrigger.js            # Move tick out of range for demo
│   └── demoReset.js              # Reset tick to in-range
├── test/
│   ├── contracts/sentinel.test.js    # InferenceGuard, SentinelINFT, PositionRegistry
│   ├── unit/                         # Agent unit tests
│   └── integration/                  # KeeperHub, e2e simulation
├── yieldAgent.js                 # Yield Agent — Uniswap V3 LP monitoring
├── runSystem.js                  # Start the full swarm
└── deployed-addresses.json       # Auto-generated contract addresses
```

---

## 🔑 Key Design Decisions

**Why proof gating at the contract level?**
The `InferenceGuard` contract enforces that no protective transaction can fire unless a valid 0G DA blob rootHash has been submitted first. This isn't just logging — it's enforcement. An agent that fabricates a reasoning trace cannot execute.

**Why NonceManager?**
The coordinator submits multiple transactions per cycle (`submitProof` → `consumeProof` → `incrementExperience`). A nonce manager serializes these through a single pending-nonce counter, eliminating the nonce collisions that caused silent failures in earlier versions.

**Why publish to the KeeperHub marketplace?**
Most DeFi protocols don't have the infrastructure to run keeper bots. By publishing Sentinel's guard logic as callable units on the marketplace, any protocol can integrate liquidation protection or LP rebalancing with a single MCP/REST call and pay per execution in USDC via x402. Sentinel earns revenue passively.

**Why iNFT?**
The Swarm Coordinator's learned behavior (risk thresholds, decision quality, strategy fingerprint) is encrypted and embedded in the token. When the token is sold or transferred, the new holder inherits a battle-tested guardian — not a blank slate. The `experienceCycles` counter on-chain provides a trust signal that's independently verifiable.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/justwasif">
        <img src="https://github.com/justwasif.png" width="100px;" alt=""/>
        <br /><sub><b>justwasif</b></sub>
      </a>
      <br />Database, Backend, Frontend Developer
    </td>
    <td align="center">
      <a href="https://github.com/gylshaurya">
        <img src="https://github.com/gylshaurya.png" width="100px;" alt=""/>
        <br /><sub><b>shaurya</b></sub>
      </a>
      <br />Web3, Smart Contract Developer,frontend 
    </td>
    <td align="center">
      <a href="https://github.com/gkrish088-blip">
        <img src="https://github.com/gkrish088-blip.png" width="100px;" alt=""/>
        <br /><sub><b>Ibrahim2750mi</b></sub>
      </a>
      <br />Configuration, UI/UX & AI Integration
    </td>
    <td align="center">
      <a href="https://github.com/uttkarshshrivastav">
        <img src="https://github.com/uttkarshshrivastav.png" width="100px;" alt=""/>
        <br /><sub><b>uttkarshshrivastav</b></sub>
      </a>
      <br />Agentic AI, Frontend Developer
    </td>
  </tr>
</table>

---

## 🙏 Built With

| Technology | Role |
|---|---|
| **0G Galileo** | L1 execution, iNFT minting, proof verification |
| **0G Compute** | TEE-verified AI inference for risk analysis |
| **0G Storage** | DAG-based persistent agent memory |
| **0G DA** | Cryptographic audit trail for every execution |
| **KeeperHub** | Guaranteed execution layer — MCP, x402, Turnkey, marketplace |
| **Hardhat** | Contract development and testing |
| **ethers.js v6** | On-chain interaction |
| **vanilla** | Guardian Console frontend |
| **OpenZeppelin** | ERC-721 base for SentinelINFT |

---

## 📜 License

ISC
