import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ADDRESSES, RPC_URL } from '../contracts/addresses';
import { SENTINEL_INFT_ABI, POSITION_REGISTRY_ABI, INFERENCE_GUARD_ABI, MOCK_UNISWAP_POOL_ABI, MOCK_USDC_ABI } from '../contracts/abis';

export interface AuditLog {
  time: string;
  tag: string;
  msg: string;
  color: string;
  txHash?: string;
}

export function useSentinel() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [inftData, setInftData] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [poolData, setPoolData] = useState<any>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const addLog = useCallback((tag: string, msg: string, color: string, txHash?: string) => {
    const newLog: AuditLog = {
      time: new Date().toLocaleTimeString().split(' ')[0],
      tag,
      msg,
      color,
      txHash
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 19)]);
  }, []);

  const fetchUSDCBalance = async (userAddress: string, currentProvider: ethers.Provider) => {
    try {
      const usdc = new ethers.Contract(ADDRESSES.MockUSDC, MOCK_USDC_ABI, currentProvider);
      const bal = await usdc.balanceOf(userAddress);
      setUsdcBalance(ethers.formatUnits(bal, 6));
    } catch (err) {
      console.error("Error fetching USDC balance:", err);
    }
  };

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const _provider = new ethers.BrowserProvider((window as any).ethereum);
        const _signer = await _provider.getSigner();
        const _address = await _signer.getAddress();
        setProvider(_provider);
        setSigner(_signer);
        setAddress(_address);
        addLog('WALLET', `Connected: ${_address.slice(0, 6)}...${_address.slice(-4)}`, 'var(--primary)');
        await fetchUSDCBalance(_address, _provider);
        return { provider: _provider, signer: _signer, address: _address };
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchOnChainData = async (currentProvider: ethers.Provider) => {
    try {
      // Fetch iNFT Data
      const inft = new ethers.Contract(ADDRESSES.SentinelINFT, SENTINEL_INFT_ABI, currentProvider);
      const total = await inft.totalMinted();
      if (total > 0n) {
        const meta = await inft.getFullMetadata(0);
        setInftData({
          experience: Number(meta.experienceCycles),
          mintedAt: Number(meta.mintedAt),
          lastActive: Number(meta.lastActiveAt),
          storagePointer: meta.storagePointer,
          strategy: meta.strategyFingerprint,
          active: meta.active,
          id: 0
        });
      }

      // Fetch Positions
      const registry = new ethers.Contract(ADDRESSES.PositionRegistry, POSITION_REGISTRY_ABI, currentProvider);
      const viewAddress = address || "0x5aD3EcA65Fba69eFaC716d792AbE1904162f1B10";
      const userPositions = await registry.getUserPositions(viewAddress);
      setPositions(userPositions.map((p: any) => ({
        id: p.id,
        address: p.positionAddress,
        protocol: ["SPARK", "AAVE", "UNISWAP_V3", "OTHER"][p.protocol],
        healthThreshold: ethers.formatEther(p.healthThreshold),
        tickLower: Number(p.tickLower),
        tickUpper: Number(p.tickUpper),
        active: p.active,
        registeredAt: Number(p.registeredAt)
      })));

      // Fetch Pool Data
      const pool = new ethers.Contract(ADDRESSES.MockUniswapPool, MOCK_UNISWAP_POOL_ABI, currentProvider);
      const slot0 = await pool.slot0();
      setPoolData({
        tick: Number(slot0.tick),
        sqrtPriceX96: slot0.sqrtPriceX96.toString()
      });

      if (address) {
        await fetchUSDCBalance(address, currentProvider);
      }

    } catch (error) {
      console.error("Error fetching sentinel data:", error);
    }
  };

  const triggerOutOfRange = async () => {
    let activeSigner = signer;
    if (!activeSigner) {
      const auth = await connectWallet();
      if (!auth) return;
      activeSigner = auth.signer;
    }
    try {
      const pool = new ethers.Contract(ADDRESSES.MockUniswapPool, MOCK_UNISWAP_POOL_ABI, activeSigner);
      addLog('ACTION', 'Simulating price crash...', 'var(--accent)');
      const tx = await pool.moveOutOfRange(800);
      addLog('TX', `Sent: ${tx.hash.slice(0, 10)}...`, 'var(--text-muted)', tx.hash);
      await tx.wait();
      addLog('SUCCESS', 'Tick moved to 800 (OUT OF RANGE)', '#00ff80');
      fetchOnChainData(provider!);
    } catch (err: any) {
      addLog('ERROR', err.message.slice(0, 40) + '...', 'var(--accent)');
    }
  };

  const resetRange = async () => {
    let activeSigner = signer;
    if (!activeSigner) {
      const auth = await connectWallet();
      if (!auth) return;
      activeSigner = auth.signer;
    }
    try {
      const pool = new ethers.Contract(ADDRESSES.MockUniswapPool, MOCK_UNISWAP_POOL_ABI, activeSigner);
      addLog('ACTION', 'Resetting pool to equilibrium...', 'var(--primary)');
      const tx = await pool.moveInRange(0);
      addLog('TX', `Sent: ${tx.hash.slice(0, 10)}...`, 'var(--text-muted)', tx.hash);
      await tx.wait();
      addLog('SUCCESS', 'Tick moved to 0 (IN RANGE)', '#00ff80');
      fetchOnChainData(provider!);
    } catch (err: any) {
      addLog('ERROR', err.message.slice(0, 40) + '...', 'var(--accent)');
    }
  };

  const claimFaucet = async () => {
    let activeSigner = signer;
    if (!activeSigner) {
      const auth = await connectWallet();
      if (!auth) return;
      activeSigner = auth.signer;
    }
    try {
      const usdc = new ethers.Contract(ADDRESSES.MockUSDC, MOCK_USDC_ABI, activeSigner);
      addLog('ACTION', 'Requesting faucet tokens...', 'var(--primary)');
      const tx = await usdc.faucet();
      addLog('TX', `Sent: ${tx.hash.slice(0, 10)}...`, 'var(--text-muted)', tx.hash);
      await tx.wait();
      addLog('SUCCESS', 'Received 10,000 Mock USDC', '#00ff80');
      fetchOnChainData(provider!);
    } catch (err: any) {
      addLog('ERROR', 'Faucet cooldown or failure', 'var(--accent)');
    }
  };

  useEffect(() => {
    const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
    setProvider(rpcProvider);
    
    const initialFetch = async () => {
      await fetchOnChainData(rpcProvider);
      setLoading(false);
    };
    initialFetch();

    // Event Listeners for Audit Trail
    const guard = new ethers.Contract(ADDRESSES.InferenceGuard, INFERENCE_GUARD_ABI, rpcProvider);
    const inft = new ethers.Contract(ADDRESSES.SentinelINFT, SENTINEL_INFT_ABI, rpcProvider);

    guard.on("ProofSubmitted", (executionId, rootHash, event) => {
      addLog('0G_DA', `New Proof: ${rootHash.slice(0, 14)}...`, 'var(--primary)', event.log.transactionHash);
    });

    guard.on("ProofConsumed", (executionId, event) => {
      addLog('GUARD', `Proof Consumed for ${executionId.slice(0, 10)}...`, 'var(--secondary)', event.log.transactionHash);
    });

    inft.on("ExperienceIncremented", (tokenId, newCycles, event) => {
      if (tokenId === 0n) {
        addLog('iNFT', `Experience Gained! Total: ${newCycles}`, '#00ff80', event.log.transactionHash);
        fetchOnChainData(rpcProvider);
      }
    });

    const interval = setInterval(() => fetchOnChainData(rpcProvider), 15000);
    
    return () => {
      clearInterval(interval);
      guard.removeAllListeners();
      inft.removeAllListeners();
    };
  }, [address]);

  return { 
    inftData, 
    positions, 
    poolData, 
    usdcBalance,
    loading, 
    provider, 
    address, 
    auditLogs,
    connectWallet,
    triggerOutOfRange,
    resetRange,
    claimFaucet
  };
}
