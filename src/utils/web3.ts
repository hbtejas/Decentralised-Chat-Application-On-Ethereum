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
      throw new Error('No accounts found');
    }

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the connection request');
    }
    throw new Error(error.message || 'Failed to connect wallet');
  }
};

/**
 * Get wallet information including balance
 */
export const getWalletInfo = async (address: string): Promise<WalletInfo> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    const network = await provider.getNetwork();

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
    throw new Error(error.message || 'Failed to get wallet information');
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

  window.ethereum.on('accountsChanged', listener);

  // Return cleanup function
  return () => {
    window.ethereum.removeListener('accountsChanged', listener);
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

  window.ethereum.on('chainChanged', listener);

  // Return cleanup function
  return () => {
    window.ethereum.removeListener('chainChanged', listener);
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
    const provider = new ethers.BrowserProvider(window.ethereum);
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
  } catch {
    return [];
  }
};
