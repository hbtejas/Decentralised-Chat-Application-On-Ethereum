import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  chainName: string;
}

/**
 * Get a reliable provider with fallback options
 */
const getProvider = (provider?: any): ethers.JsonRpcProvider | ethers.BrowserProvider => {
  try {
    if (provider) {
      return new ethers.BrowserProvider(provider);
    }
    
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }

    // Fallback to public JSON-RPC endpoints
    return new ethers.JsonRpcProvider('https://eth.llamarpc.com');
  } catch (error) {
    // Final fallback
    return new ethers.JsonRpcProvider('https://rpc.ankr.com/eth');
  }
};

/**
 * Get balance with retry logic
 */
const getBalanceWithRetry = async (
  provider: ethers.Provider,
  address: string,
  maxRetries: number = 3
): Promise<bigint> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const balance = await provider.getBalance(address);
      return balance;
    } catch (error: any) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      const waitTime = 500 * attempt; // 500ms, 1s, 1.5s
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw new Error('Failed to fetch balance after retries');
};

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

/**
 * Request MetaMask account access
 */
export const requestAccount = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error(
      'MetaMask is not installed. Please install it from https://metamask.io'
    );
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please create or import a wallet in MetaMask.');
    }

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('You rejected the connection. Please approve the request to continue.');
    }
    if (error.code === -32002) {
      throw new Error('MetaMask is busy. Please wait a moment and try again.');
    }
    throw new Error(error.message || 'Failed to connect wallet. Please try again.');
  }
};

/**
 * Get wallet information including balance with better error handling
 */
export const getWalletInfo = async (address: string): Promise<WalletInfo> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const provider = getProvider(window.ethereum);
    
    // Get balance with retry
    let balance: bigint;
    try {
      balance = await getBalanceWithRetry(provider, address, 3);
    } catch (balanceError: any) {
      console.warn('Balance fetch error, using cached/default balance:', balanceError.message);
      // Return default balance instead of failing
      balance = ethers.parseEther('0');
    }

    // Get network info
    let network;
    try {
      network = await provider.getNetwork();
    } catch (networkError: any) {
      console.warn('Network detection error, assuming Ethereum Mainnet');
      network = { chainId: 1n, name: 'mainnet' };
    }

    // Convert balance to ETH
    const balanceInEth = ethers.formatEther(balance);

    const chainNames: Record<number, string> = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai Testnet',
      56: 'Binance Smart Chain',
      97: 'BSC Testnet',
      43114: 'Avalanche C-Chain',
      42: 'Kovan Testnet',
    };

    return {
      address,
      balance: parseFloat(balanceInEth).toFixed(4),
      chainId: Number(network.chainId),
      chainName: chainNames[Number(network.chainId)] || `Chain ${network.chainId}`,
    };
  } catch (error: any) {
    // Provide helpful error message
    if (error.message?.includes('RPC')) {
      throw new Error('Network connection issue. Please check your internet and try again.');
    }
    throw new Error(error.message || 'Failed to get wallet information. Please try again.');
  }
};

/**
 * Listen for account changes
 */
export const onAccountChange = (callback: (accounts: string[]) => void): (() => void) => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  const listener = (accounts: string[]) => {
    callback(accounts);
  };

  try {
    window.ethereum.on('accountsChanged', listener);
  } catch (error) {
    console.error('Error setting up account listener:', error);
  }

  // Return cleanup function
  return () => {
    try {
      window.ethereum.removeListener('accountsChanged', listener);
    } catch (error) {
      console.error('Error removing account listener:', error);
    }
  };
};

/**
 * Listen for network changes
 */
export const onNetworkChange = (callback: (chainId: string) => void): (() => void) => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  const listener = (chainId: string) => {
    callback(chainId);
  };

  try {
    window.ethereum.on('chainChanged', listener);
  } catch (error) {
    console.error('Error setting up network listener:', error);
  }

  // Return cleanup function
  return () => {
    try {
      window.ethereum.removeListener('chainChanged', listener);
    } catch (error) {
      console.error('Error removing network listener:', error);
    }
  };
};

/**
 * Sign a message with the wallet
 */
export const signMessage = async (address: string, message: string): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const provider = getProvider(window.ethereum);
    const signer = await provider.getSigner(address);
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign message');
  }
};

/**
 * Switch to a specific network
 */
export const switchNetwork = async (chainId: number): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + chainId.toString(16) }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      throw new Error(`Network chain ID ${chainId} not configured in MetaMask`);
    }
    throw new Error(error.message || 'Failed to switch network');
  }
};

/**
 * Get current connected accounts
 */
export const getConnectedAccounts = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) {
    return [];
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts || [];
  } catch (error) {
    console.error('Error getting connected accounts:', error);
    return [];
  }
};
