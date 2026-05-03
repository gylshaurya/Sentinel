import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import App from './App';
import * as useSentinelHook from './hooks/useSentinel';

vi.mock('./hooks/useSentinel', () => ({
  useSentinel: vi.fn()
}));

const mockUseSentinel = useSentinelHook.useSentinel as any;

describe('Frontend Stress Test', () => {
  const generatePositions = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      address: `0x${'a'.repeat(40)}`,
      protocol: i % 2 === 0 ? 'UNISWAP_V3' : 'SPARK',
      healthThreshold: '1.5',
      tickLower: -100,
      tickUpper: 100,
      active: true,
      registeredAt: Date.now()
    }));
  };

  const generateAuditLogs = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      time: '12:00:00',
      tag: 'STRESS_LOG',
      msg: `Stress test log message ${i} with a very long text to see how it handles overflow and wrapping in the audit trail container.`.repeat(2),
      color: 'var(--primary)',
      txHash: `0x${'b'.repeat(64)}`
    }));
  };

  it('renders correctly with 5000 positions', () => {
    mockUseSentinel.mockReturnValue({
      inftData: { id: 0, experience: 100, storagePointer: '0x123', strategy: '0x456' },
      positions: generatePositions(5000),
      poolData: { tick: 0, sqrtPriceX96: '1000' },
      usdcBalance: '1000000',
      loading: false,
      address: '0x1234567890123456789012345678901234567890',
      auditLogs: [],
      connectWallet: vi.fn(),
      triggerOutOfRange: vi.fn(),
      resetRange: vi.fn(),
      claimFaucet: vi.fn()
    });

    const { container } = render(<App />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(5000);
  });

  it('renders correctly with 5000 audit logs', () => {
    mockUseSentinel.mockReturnValue({
      inftData: { id: 0, experience: 100, storagePointer: '0x123', strategy: '0x456' },
      positions: [],
      poolData: { tick: 0, sqrtPriceX96: '1000' },
      usdcBalance: '1000000',
      loading: false,
      address: '0x1234567890123456789012345678901234567890',
      auditLogs: generateAuditLogs(5000),
      connectWallet: vi.fn(),
      triggerOutOfRange: vi.fn(),
      resetRange: vi.fn(),
      claimFaucet: vi.fn()
    });

    render(<App />);
    const logs = screen.getAllByText(/STRESS_LOG/);
    expect(logs.length).toBe(5000);
  });

  it('handles rapid state updates', async () => {
    const { rerender } = render(<App />);
    
    for (let i = 0; i < 200; i++) {
      mockUseSentinel.mockReturnValue({
        inftData: { id: 0, experience: i, storagePointer: '0x123', strategy: '0x456' },
        positions: [],
        poolData: { tick: i, sqrtPriceX96: '1000' },
        usdcBalance: (1000000 + i).toString(),
        loading: false,
        address: '0x1234567890123456789012345678901234567890',
        auditLogs: [{ time: '12:00:00', tag: 'UPDATE', msg: `Update ${i}`, color: 'var(--primary)' }],
        connectWallet: vi.fn(),
        triggerOutOfRange: vi.fn(),
        resetRange: vi.fn(),
        claimFaucet: vi.fn()
      });
      
      await act(async () => {
        rerender(<App />);
      });
    }

    const updates = screen.getAllByText(/Update 199/);
    expect(updates.length).toBeGreaterThan(0);
  });

  it('handles extremely long strings and edge case data', () => {
    const longString = '0x' + 'f'.repeat(1000);
    mockUseSentinel.mockReturnValue({
      inftData: { 
        id: 999999999, 
        experience: 999999999, 
        storagePointer: longString, 
        strategy: longString 
      },
      positions: [{
        id: 1,
        address: longString,
        protocol: 'EXTREMELY_LONG_PROTOCOL_NAME_THAT_MIGHT_BREAK_THE_UI_LAYOUT',
        healthThreshold: '999999999.999999999',
        tickLower: -887272,
        tickUpper: 887272,
        active: true,
        registeredAt: Date.now()
      }],
      poolData: { tick: 888888, sqrtPriceX96: '99999999999999999999999999999999999999' },
      usdcBalance: '999999999999999999999999999999',
      loading: false,
      address: longString,
      auditLogs: [{ 
        time: '23:59:59', 
        tag: 'CRITICAL_EDGE_CASE', 
        msg: longString, 
        color: 'var(--accent)',
        txHash: longString
      }],
      connectWallet: vi.fn(),
      triggerOutOfRange: vi.fn(),
      resetRange: vi.fn(),
      claimFaucet: vi.fn()
    });

    render(<App />);
    expect(screen.getByText(/CRITICAL_EDGE_CASE/)).toBeInTheDocument();
  });

  it('handles empty and null states gracefully', () => {
    mockUseSentinel.mockReturnValue({
      inftData: null,
      positions: [],
      poolData: null,
      usdcBalance: '0',
      loading: false,
      address: '',
      auditLogs: [],
      connectWallet: vi.fn(),
      triggerOutOfRange: vi.fn(),
      resetRange: vi.fn(),
      claimFaucet: vi.fn()
    });

    render(<App />);
    expect(screen.getByText(/Awaiting on-chain events/)).toBeInTheDocument();
    expect(screen.getByText(/Connect Wallet/)).toBeInTheDocument();
  });
});
