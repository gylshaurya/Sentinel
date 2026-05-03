import React from 'react';
import { Shield, Activity, Zap } from 'lucide-react';

interface AgentCardProps {
  name: string;
  status: 'idle' | 'monitoring' | 'executing' | 'error';
  lastAction: string;
  type: 'risk' | 'yield' | 'coordinator';
}

export const AgentCard: React.FC<AgentCardProps> = ({ name, status, lastAction, type }) => {
  const Icon = type === 'risk' ? Shield : type === 'yield' ? Zap : Activity;
  
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ 
            background: type === 'risk' ? 'var(--accent)' : type === 'yield' ? 'var(--primary)' : 'var(--secondary)',
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex'
          }}>
            <Icon size={20} color="#000" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{name}</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agent ID: {name.toLowerCase().replace(' ', '-')}</div>
          </div>
        </div>
        <div className={`badge ${status === 'monitoring' ? 'badge-success' : 'badge-warning'}`}>
          <span className={`status-indicator ${status === 'monitoring' ? 'status-online' : ''}`} />
          {status}
        </div>
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px' }}>
        <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>LAST_ACTION:</span> {lastAction}
      </div>
    </div>
  );
};
