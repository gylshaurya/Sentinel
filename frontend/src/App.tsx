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
  Lock,
  History,
  Link as LinkIcon,
  Coins,
  CreditCard,
  Layers
} from 'lucide-react';
import { useSentinel } from './hooks/useSentinel';
import { AgentCard } from './components/AgentCard';

function App() {
  const { 
    inftData, 
    positions, 
    poolData, 
    usdcBalance,
    loading, 
    address, 
    auditLogs, 
    connectWallet, 
    triggerOutOfRange, 
    resetRange,
    claimFaucet
  } = useSentinel();
  
  const [activeTab, setActiveTab] = useState('dashboard');

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
          <>
            <div className="grid">
              {/* iNFT Status Card */}
              <div className="card" style={{ gridColumn: 'span 2', display: 'flex', gap: '2.5rem', overflow: 'hidden', position: 'relative' }}>
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
                    <a 
                      href={`https://chainscan-galileo.0g.ai/address/0x1A686bb2b8453A543ECA148bDbdE4155EB56a7B1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      <ExternalLink size={20} color="var(--text-muted)" />
                    </a>
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

              {/* KeeperHub Status Card */}
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
                    <a 
                      href="https://app.keeperhub.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ textDecoration: 'none' }}
                    >
                      <button className="secondary" style={{ width: '100%' }}>
                        <ExternalLink size={16} /> KeeperHub Dashboard
                      </button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Demo Control Card */}
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
                  <div style={{ marginTop: '1rem', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '25%', width: '50%', height: '100%', background: 'var(--primary)', opacity: 0.2 }} />
                    <div style={{ 
                      position: 'absolute', 
                      left: `${((poolData?.tick || 0) + 1000) / 20}%`, 
                      width: '4px', 
                      height: '14px', 
                      top: '-5px', 
                      background: isOutOfRange ? 'var(--accent)' : 'var(--primary)', 
                      boxShadow: `0 0 10px ${isOutOfRange ? 'var(--accent)' : 'var(--primary)'}`,
                      transition: 'all 0.5s ease'
                    }} />
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

            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 800, marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Swarm Intelligence <div style={{ height: '1px', flex: 1, background: 'var(--card-border)' }} />
            </h3>
            <div className="grid">
              <AgentCard 
                name="Risk Sentinel" 
                status="monitoring" 
                lastAction="HF Analysis: Safe" 
                type="risk" 
              />
              <AgentCard 
                name="Yield Guardian" 
                status={isOutOfRange ? 'executing' : 'monitoring'} 
                lastAction={isOutOfRange ? "Rebalance Proposal Emitted" : `Price in range: ${poolData?.tick ?? 0}`} 
                type="yield" 
              />
              <AgentCard 
                name="Swarm Coordinator" 
                status="monitoring" 
                lastAction={auditLogs.length > 0 ? auditLogs[0].msg : "Awaiting agent proposals..."} 
                type="coordinator" 
              />
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1.2fr', marginTop: '2.5rem' }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.75rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Monitored Positions</h3>
                  <button className="secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Add Position</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      <th style={{ padding: '1rem 1.5rem' }}>PROTOCOL</th>
                      <th style={{ padding: '1rem 1.5rem' }}>ASSET / ADDRESS</th>
                      <th style={{ padding: '1rem 1.5rem' }}>THRESHOLD / RANGE</th>
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
                            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>HF &lt; {pos.healthThreshold}</span>
                          )}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <span className={`badge ${pos.active ? 'badge-success' : 'badge-warning'}`}>
                            <span className={`status-indicator ${pos.active ? 'status-online' : ''}`} style={{ margin: 0, marginRight: '0.5rem' }} /> 
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

              <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Terminal size={18} color="var(--primary)" /> Audit Trail
                  </h3>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ON-CHAIN FEED</div>
                </div>
                <div className="activity-feed" style={{ flex: 1 }}>
                  {auditLogs.map((log, i) => (
                    <div key={i} className="activity-item">
                      <div className="activity-time">{log.time}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div>
                          <span style={{ color: log.color, fontWeight: 800, marginRight: '0.5rem' }}>{log.tag}:</span>
                          <span style={{ color: 'var(--text-main)', opacity: 0.9 }}>{log.msg}</span>
                        </div>
                        {log.txHash && (
                          <a 
                            href={`https://chainscan-galileo.0g.ai/tx/${log.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <ExternalLink size={10} /> {log.txHash.slice(0, 20)}...
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      Awaiting on-chain events...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
