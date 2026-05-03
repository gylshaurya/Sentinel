import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Terminal, 
  ExternalLink,
  RefreshCcw,
  AlertTriangle,
  Database,
  Cpu,
  Fingerprint,
  Zap,
  Activity,
  ChevronRight,
  History,
  Link as LinkIcon,
  Coins,
  CreditCard,
  Layers,
  X,
  Plus
} from 'lucide-react';
import { useSentinel } from './hooks/useSentinel';
import { AgentCard } from './components/AgentCard';
import { ADDRESSES } from './contracts/addresses';

function App() {
  const { 
    inftData, 
    positions, 
    poolData, 
    usdcBalance,
    loading, 
    address, 
    auditLogs, 
    recentProofs,
    connectWallet, 
    triggerOutOfRange, 
    resetRange,
    claimFaucet,
    registerPosition
  } = useSentinel();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Form State
  const [protocol, setProtocol] = useState(0);
  const [posAddress, setPosAddress] = useState('');
  const [threshold, setThreshold] = useState('1.5');
  const [tickLower, setTickLower] = useState('-1000');
  const [tickUpper, setTickUpper] = useState('1000');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await registerPosition(
      protocol, 
      posAddress, 
      protocol === 2 ? Number(tickLower) : threshold,
      protocol === 2 ? Number(tickUpper) : undefined
    );
    if (success) setShowAddModal(false);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--primary)' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '2rem' }}>
          <div className="inft-glow" style={{ opacity: 0.5 }} />
          <ShieldCheck size={100} className="animate-pulse-slow" />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.2em', textShadow: '0 0 20px var(--primary-glow)' }}>INITIALIZING SENTINEL SWARM...</span>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>Establishing secure connection to 0G Galileo...</p>
      </div>
    );
  }

  const isOutOfRange = poolData ? (poolData.tick > 500 || poolData.tick < -500) : false;

  return (
    <div className="app-container">
      {/* Add Position Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="card modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Protect New Position</h2>
              <X size={24} style={{ cursor: 'pointer' }} onClick={() => setShowAddModal(false)} />
            </div>

            <form onSubmit={handleRegister}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Target Protocol</label>
                <select 
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }}
                  value={protocol} 
                  onChange={e => setProtocol(Number(e.target.value))}
                >
                  <option value={0}>Spark Protocol (Lending)</option>
                  <option value={1}>Aave V3 (Lending)</option>
                  <option value={2}>Uniswap V3 (LP)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>{protocol === 2 ? 'Pool Address' : 'User Address'}</label>
                <input 
                  style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }}
                  type="text" 
                  placeholder="0x..." 
                  value={posAddress}
                  onChange={e => setPosAddress(e.target.value)}
                  required 
                />
              </div>

              {protocol === 2 ? (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Tick Lower</label>
                    <input style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }} type="number" value={tickLower} onChange={e => setTickLower(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Tick Upper</label>
                    <input style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }} type="number" value={tickUpper} onChange={e => setTickUpper(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Health Factor Threshold</label>
                  <input style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }} type="number" step="0.1" value={threshold} onChange={e => setThreshold(e.target.value)} />
                </div>
              )}

              <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                <ShieldCheck size={18} /> Enable Guardian Protection
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Agent Detail View */}
      {selectedAgent && (
        <div className="modal-overlay" onClick={() => setSelectedAgent(null)}>
          <div className="card modal-content" style={{ maxWidth: '900px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Activity size={24} color="var(--primary)" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedAgent} Reasoning Engine</h2>
              </div>
              <X size={24} style={{ cursor: 'pointer' }} onClick={() => setSelectedAgent(null)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>ACTIVE INFERENCES (0G COMPUTE)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentProofs && recentProofs.length > 0 ? recentProofs.map((p, i) => (
                    <div key={i} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.6rem' }}>
                        <span>INFERENCE #{p.id.slice(2, 10)}</span>
                        <span>{new Date(p.timestamp * 1000).toLocaleTimeString()}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                        DA_ROOT: {p.rootHash.slice(0, 32)}...
                      </div>
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>TEE_ATTESTED</span>
                        <span className="badge" style={{ fontSize: '0.6rem', background: 'rgba(112,0,255,0.1)', color: 'var(--secondary)', border: '1px solid rgba(112,0,255,0.2)' }}>0G_DA_ROOT_VERIFIED</span>
                      </div>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <RefreshCcw size={32} className="animate-pulse-slow" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <div>Awaiting next verifiable cycle...</div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>INTERNAL REASONING LOGS</h4>
                <div style={{ background: '#08080a', padding: '1.5rem', borderRadius: '16px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#00ff80', border: '1px solid var(--card-border)', minHeight: '350px', lineHeight: '1.8', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
                  <div style={{ opacity: 0.7 }}>[SYSTEM] Initializing LLM Swarm via 0G Compute...</div>
                  <div style={{ opacity: 0.7 }}>[AUTH] TEE hardware attestation: SUCCESS (Intel SGX)</div>
                  <div style={{ opacity: 0.7 }}>[READ] Fetching market data from Uniswap V3...</div>
                  <div style={{ opacity: 0.7 }}>[ANALYZE] Running drift analysis for pool {ADDRESSES.MockUniswapPool.slice(0, 8)}...</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700 }}>[DECIDE] Current Tick {poolData?.tick} is within optimal safety bounds. No rebalance needed.</div>
                  <div style={{ opacity: 0.7 }}>[STORE] Submitting decision trail to 0G Storage (Pointer: 0x7b2a...d9e1)</div>
                  <div style={{ color: 'var(--secondary)' }}>[PROOF] Proof generated and submitted to InferenceGuard.</div>
                  <div className="animate-pulse-slow" style={{ color: 'var(--primary)' }}>▋</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <ShieldCheck size={36} color="var(--primary)" />
          <span className="logo-text">SENTINEL</span>
        </div>
        
        <nav style={{ flex: 1 }}>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} />
            Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'positions' ? 'active' : ''}`} onClick={() => setActiveTab('positions')}>
            <Database size={20} />
            Positions
          </div>
          <div className={`nav-item ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
            <Activity size={20} />
            Swarm Logic
          </div>
          <div className={`nav-item ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
            <History size={20} />
            Audit Trail
          </div>
        </nav>

        <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>NETWORK STATUS</div>
          <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="status-indicator status-online" />
            0G Galileo Testnet
          </div>
          <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
            Chain ID: 16602
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Activity size={14} /> SYSTEM LIVE
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Guardian Console</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {address ? (
              <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CONNECTED WALLET</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{address.slice(0, 6)}...{address.slice(-4)}</div>
              </div>
            ) : (
              <button onClick={connectWallet}>
                <LinkIcon size={16} /> Connect Wallet
              </button>
            )}
            <button className="secondary" onClick={() => window.location.reload()}>
              <RefreshCcw size={16} /> Sync
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid">
            {/* iNFT Status Card */}
            <div className="card" onClick={() => setSelectedAgent('Swarm Coordinator')} style={{ gridColumn: 'span 2', display: 'flex', gap: '2.5rem', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--primary-glow)', filter: 'blur(100px)', borderRadius: '50%', opacity: 0.1 }} />
              
              <div style={{ width: '220px' }}>
                <div className="inft-visual">
                  <div className="inft-glow" />
                  <Fingerprint size={100} color="var(--primary)" strokeWidth={1} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="badge badge-success" style={{ padding: '0.5rem 1rem', borderRadius: '12px' }}>
                    SENTINEL_iNFT #{inftData?.id ?? 0}
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>Swarm Coordinator</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verifiable reasoning engine powered by 0G Compute</p>
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://chainscan-galileo.0g.ai/address/0x1A686bb2b8453A543ECA148bDbdE4155EB56a7B1', '_blank');
                    }}
                    style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    <ExternalLink size={20} color="var(--text-muted)" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>EXPERIENCE CYCLES</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{inftData?.experience ?? 0}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>0G STORAGE</div>
                    <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inftData?.storagePointer ? `${inftData.storagePointer.slice(0, 10)}...` : '0x7b2a...d9e1'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>TEE_HASH</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {inftData?.strategy ? `${inftData.strategy.slice(0, 10)}...` : '0x88...f2a3'}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, padding: '1rem', background: 'rgba(0,242,255,0.05)', border: '1px solid rgba(0,242,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Zap size={20} color="var(--primary)" />
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 700 }}>AI Inference Validated</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Hardware-attested decision making</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: '1rem', background: 'rgba(112,0,255,0.05)', border: '1px solid rgba(112,0,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={20} color="var(--secondary)" />
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 700 }}>InferenceGuard Active</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Gated by 0G DA RootHash proofs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Execution Layer Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Layers size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Execution Layer</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CreditCard size={18} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.9rem' }}>x402 Autopay</span>
                  </div>
                  <span className="badge badge-success">Enabled</span>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>MOCK USDC BALANCE</span>
                    <Coins size={14} color="var(--primary)" />
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    {Number(usdcBalance).toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>USDC</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={claimFaucet} className="secondary" style={{ borderStyle: 'dashed' }}>
                    <Coins size={16} /> Claim Faucet (10k USDC)
                  </button>
                  <a href="https://app.keeperhub.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <button className="secondary" style={{ width: '100%' }}>
                      <ExternalLink size={16} /> KeeperHub Dashboard
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Simulation Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Cpu size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Simulate Drift</h3>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>UNISWAP V3 TICK</span>
                  <span className={`badge ${isOutOfRange ? 'badge-danger' : 'badge-success'}`}>
                    {isOutOfRange ? 'ALARM' : 'OPTIMAL'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: isOutOfRange ? 'var(--accent)' : 'var(--primary)' }}>
                    {poolData?.tick ?? 0}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>TICK</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={triggerOutOfRange} className="secondary" style={{ color: 'var(--accent)', borderColor: 'rgba(255,0,85,0.2)', background: 'rgba(255,0,85,0.02)' }}>
                  <AlertTriangle size={16} /> Force Out-of-Range (800)
                </button>
                <button onClick={resetRange} className="secondary">
                  <RefreshCcw size={16} /> Reset Pool State (0)
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.75rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Monitored Positions</h3>
              <button className="secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setShowAddModal(true)}>
                <Plus size={14} /> Add Position
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>PROTOCOL</th>
                  <th style={{ padding: '1rem 1.5rem' }}>ASSET / ADDRESS</th>
                  <th style={{ padding: '1rem 1.5rem' }}>HEALTH / RANGE</th>
                  <th style={{ padding: '1rem 1.5rem' }}>STATUS</th>
                  <th style={{ padding: '1rem 1.5rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--card-border)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '24px', height: '24px', background: 'var(--card-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800 }}>
                          {pos.protocol[0]}
                        </div>
                        <span style={{ fontWeight: 700 }}>{pos.protocol}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {pos.address.slice(0, 16)}...
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      {pos.protocol === 'UNISWAP_V3' ? (
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>[{pos.tickLower}, {pos.tickUpper}]</span>
                      ) : (
                        <span style={{ color: Number(pos.currentHF) < 1.1 ? 'var(--accent)' : 'var(--primary)', fontWeight: 800 }}>{pos.currentHF} HF</span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span className={`badge ${pos.active ? 'badge-success' : 'badge-warning'}`}>
                        {pos.active ? 'Protected' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="grid">
            <div onClick={() => setSelectedAgent('Risk Sentinel')} style={{ cursor: 'pointer' }}>
              <AgentCard name="Risk Sentinel" status="monitoring" lastAction="HF Analysis: Safe" type="risk" />
            </div>
            <div onClick={() => setSelectedAgent('Yield Guardian')} style={{ cursor: 'pointer' }}>
              <AgentCard name="Yield Guardian" status={isOutOfRange ? 'executing' : 'monitoring'} lastAction={isOutOfRange ? "Rebalance Proposal Emitted" : "Price in range"} type="yield" />
            </div>
            <div onClick={() => setSelectedAgent('Swarm Coordinator')} style={{ cursor: 'pointer' }}>
              <AgentCard name="Swarm Coordinator" status="monitoring" lastAction="Awaiting agent proposals..." type="coordinator" />
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={18} color="var(--primary)" /> Full Audit Trail
              </h3>
            </div>
            <div className="activity-feed" style={{ padding: '1rem' }}>
              {auditLogs.map((log: any, i: number) => (
                <div key={i} className="activity-item">
                  <div className="activity-time">{log.time}</div>
                  <div>
                    <span style={{ color: log.color, fontWeight: 800, marginRight: '0.5rem' }}>{log.tag}:</span>
                    <span>{log.msg}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
