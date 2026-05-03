export const SENTINEL_INFT_ABI = [
  "function totalMinted() view returns (uint256)",
  "function agentData(uint256) view returns (uint256 experienceCycles, uint256 mintedAt, uint256 lastActiveAt, string storagePointer, string strategyFingerprint, bool active)",
  "function tokenURI(uint256) view returns (string)",
  "function ownerOf(uint256) view returns (address)",
  "function getExperienceCycles(uint256) view returns (uint256)",
  "function getFullMetadata(uint256) view returns (tuple(uint256 experienceCycles, uint256 mintedAt, uint256 lastActiveAt, string storagePointer, string strategyFingerprint, bool active))",
  "event ExperienceIncremented(uint256 indexed tokenId, uint256 newCycles)",
  "event IntelligenceUpdated(uint256 indexed tokenId, string storagePointer)"
];

export const POSITION_REGISTRY_ABI = [
  "function getUserPositions(address) view returns (tuple(bytes32 id, address positionAddress, uint8 protocol, uint256 healthThreshold, int24 tickLower, int24 tickUpper, bool active, uint256 registeredAt)[])",
  "function getActivePositions(address) view returns (tuple(bytes32 id, address positionAddress, uint8 protocol, uint256 healthThreshold, int24 tickLower, int24 tickUpper, bool active, uint256 registeredAt)[])",
  "event PositionRegistered(address indexed user, bytes32 indexed positionId, string protocol)",
  "event PositionRemoved(address indexed user, bytes32 indexed positionId)"
];

export const INFERENCE_GUARD_ABI = [
  "function isProofValid(bytes32) view returns (bool)",
  "event ProofSubmitted(bytes32 indexed executionId, bytes32 rootHash)",
  "event ProofConsumed(bytes32 indexed executionId)"
];

export const MOCK_UNISWAP_POOL_ABI = [
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
  "function setTick(int24) external",
  "function moveOutOfRange(int24) external",
  "function moveInRange(int24) external",
  "function getCurrentTick() view returns (int24)",
  "event Burn(address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)"
];

export const MOCK_USDC_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function faucet() external",
  "function faucetCooldownRemaining(address) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];
