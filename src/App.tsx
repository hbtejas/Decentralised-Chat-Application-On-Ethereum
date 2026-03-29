import { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Wallet, 
  Send, 
  Hash, 
  Lock, 
  Globe, 
  Layers, 
  RefreshCw,
  Zap,
  Check,
  Clock,
  Menu,
  X,
  User,
  Settings,
  Eye,
  EyeOff,
  UserPlus,
  Copy,
  LogOut,
  ShieldCheck,
  Fingerprint,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  isMetaMaskInstalled, 
  requestAccount, 
  getWalletInfo, 
  onAccountChange, 
  onNetworkChange,
  getConnectedAccounts
} from './utils/web3';

interface Message {
  id: string;
  sender: string;
  address: string;
  avatar: string;
  content: string;
  timestamp: string;
  txHash?: string;
  status: 'pending' | 'confirmed';
}

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: any;
  unread: boolean;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isPublic: boolean;
  walletAddress?: string;
}

const channels: Channel[] = [
  { id: '1', name: 'general-lobby', description: 'Main chat for all decentralized users', icon: Hash, unread: false },
  { id: '2', name: 'alpha-leaks', description: 'Web3 alpha, signals, and insights', icon: Lock, unread: true },
  { id: '3', name: 'defi-degens', description: 'Yield farming, staking, and swaps', icon: Hash, unread: false },
  { id: '4', name: 'nft-gallery', description: 'Showcase your digital art and collectibles', icon: Hash, unread: false },
  { id: '5', name: 'eth-devs', description: 'Smart contract discussion and tools', icon: Hash, unread: false },
];

const mockUsers = [
  { name: 'Satoshi.eth', address: '0x1a2b...3c4d', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop' },
  { name: 'Vitalik.eth', address: '0xd8da...6045', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
  { name: 'DeFi_Whale', address: '0x7a8b...1234', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { name: 'SolidityNinja', address: '0x4e9a...bcde', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop' },
];

const initialMessages: Message[] = [
  { id: '1', sender: 'Vitalik.eth', address: '0xd8da...6045', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', content: 'Welcome to EtherChat! The first truly decentralized messaging layer on Ethereum.', timestamp: '10:00 AM', txHash: '0x7f4...8e21', status: 'confirmed' },
  { id: '2', sender: 'Satoshi.eth', address: '0x1a2b...3c4d', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop', content: 'Privacy and censorship resistance are the core values here. No central servers.', timestamp: '10:05 AM', txHash: '0x3a1...9b6c', status: 'confirmed' },
  { id: '3', sender: 'SolidityNinja', address: '0x4e9a...bcde', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop', content: 'Does anyone have the link to the latest EIP specs?', timestamp: '10:12 AM', txHash: '0x2e9...4f7a', status: 'confirmed' },
];

const botResponses = [
  "LFG! 🚀",
  "The gas fees are crazy high right now 😭",
  "Is the merge already priced in? 🐼",
  "Just deployed my first ERC-20 token. To the moon!",
  "Make sure to bridge your ETH to L2 before transacting.",
  "Check out the new dApp dashboard, UI is looking crisp!",
  "Decentralized identity (DID) is the future of communication.",
  "What's the floor price of Punks today?"
];

const avatarOptions = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
];

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [accountType, setAccountType] = useState<'wallet' | 'local' | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [blockNumber, setBlockNumber] = useState(19283746);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Profile & Account Creation States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'choice' | 'create' | 'connect'>('choice');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [connectionError, setConnectionError] = useState<string>('');
  
  // Create Account Form State
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [isPublicAccount, setIsPublicAccount] = useState(true);
  const [createError, setCreateError] = useState('');
  
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    username: '',
    displayName: '',
    avatar: avatarOptions[0],
    isPublic: true,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<{ account?: () => void; network?: () => void }>({});

  // Check for previously connected account on mount
  useEffect(() => {
    const checkPreviousConnection = async () => {
      try {
        const accounts = await getConnectedAccounts();
        if (accounts.length > 0) {
          const account = accounts[0];
          const walletInfo = await getWalletInfo(account);
          
          setIsConnected(true);
          setAccountType('wallet');
          setWalletAddress(account);
          setBalance(walletInfo.balance);
          setProfile({
            id: account,
            username: account.substring(0, 6),
            displayName: `${account.substring(0, 6)}...${account.substring(-4)}`,
            avatar: avatarOptions[0],
            isPublic: true,
            walletAddress: account
          });
        }
      } catch (error) {
        console.log('No previous wallet connection found');
      }
    };

    checkPreviousConnection();
  }, []);

  // Setup MetaMask listeners when wallet is connected
  useEffect(() => {
    if (!isConnected || accountType !== 'wallet') {
      return;
    }

    try {
      // Setup account change listener
      const unsubscribeAccount = onAccountChange((accounts) => {
        if (accounts.length === 0) {
          disconnectAccount();
        } else if (accounts[0] !== walletAddress) {
          // Account changed - reconnect with new account
          handleAccountChange(accounts[0]);
        }
      });

      const unsubscribeNetwork = onNetworkChange((chainId) => {
        // Network changed - refresh balance
        handleNetworkChange();
      });

      unsubscribeRef.current = {
        account: unsubscribeAccount,
        network: unsubscribeNetwork
      };
    } catch (error) {
      console.error('Error setting up listeners:', error);
    }

    // Cleanup function
    return () => {
      if (unsubscribeRef.current.account) {
        unsubscribeRef.current.account();
      }
      if (unsubscribeRef.current.network) {
        unsubscribeRef.current.network();
      }
    };
  }, [isConnected, accountType, walletAddress]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-increment block number
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber(prev => prev + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleAccountChange = async (newAccount: string) => {
    try {
      setWalletAddress(newAccount);
      const walletInfo = await getWalletInfo(newAccount);
      setBalance(walletInfo.balance);
      setProfile(prev => ({
        ...prev,
        id: newAccount,
        username: newAccount.substring(0, 6),
        displayName: `${newAccount.substring(0, 6)}...${newAccount.substring(-4)}`,
        walletAddress: newAccount
      }));
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleNetworkChange = async () => {
    try {
      if (walletAddress) {
        const walletInfo = await getWalletInfo(walletAddress);
        setBalance(walletInfo.balance);
      }
    } catch (error) {
      console.error('Error updating balance after network change:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setConnectionError('');

    try {
      // Check if MetaMask is installed
      if (!isMetaMaskInstalled()) {
        throw new Error(
          'MetaMask is not installed. Please install it from https://metamask.io'
        );
      }

      // Request account access
      const account = await requestAccount();
      
      // Get wallet info (with graceful error handling)
      try {
        const walletInfo = await getWalletInfo(account);
        
        setIsConnected(true);
        setAccountType('wallet');
        setWalletAddress(account);
        setBalance(walletInfo.balance);
        setProfile({
          id: account,
          username: account.substring(0, 6),
          displayName: `${account.substring(0, 6)}...${account.substring(-4)}`,
          avatar: avatarOptions[0],
          isPublic: true,
          walletAddress: account
        });
      } catch (balanceError: any) {
        // Still connect even if balance fetch fails
        console.warn('Balance fetch failed:', balanceError.message);
        setIsConnected(true);
        setAccountType('wallet');
        setWalletAddress(account);
        setBalance('0.00'); // Default to 0 balance
        setProfile({
          id: account,
          username: account.substring(0, 6),
          displayName: `${account.substring(0, 6)}...${account.substring(-4)}`,
          avatar: avatarOptions[0],
          isPublic: true,
          walletAddress: account
        });
        setConnectionError('Balance could not be fetched. You may be on a network with RPC issues. Please try switching networks in MetaMask.');
      }
      
      setShowAuthModal(false);
    } catch (error: any) {
      console.error('Connection error:', error);
      setConnectionError(error.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const createAccount = () => {
    setCreateError('');
    
    if (!newUsername.trim()) {
      setCreateError('Username is required');
      return;
    }
    if (!newDisplayName.trim()) {
      setCreateError('Display name is required');
      return;
    }
    if (newUsername.length < 3) {
      setCreateError('Username must be at least 3 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setCreateError('Username can only contain letters, numbers, and underscores');
      return;
    }

    const newProfile: UserProfile = {
      id: `local_${Date.now()}`,
      username: newUsername,
      displayName: newDisplayName,
      avatar: selectedAvatar,
      isPublic: isPublicAccount,
    };

    setProfile(newProfile);
    setIsConnected(true);
    setAccountType('local');
    setShowAuthModal(false);
    setAuthMode('choice');
    
    // Reset form
    setNewUsername('');
    setNewDisplayName('');
    setSelectedAvatar(avatarOptions[0]);
    setIsPublicAccount(true);
  };

  const toggleAccountPrivacy = () => {
    setProfile(prev => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    // Optional: Show toast notification here
  };

  const disconnectAccount = () => {
    setIsConnected(false);
    setAccountType(null);
    setWalletAddress('');
    setBalance('0.00');
    setProfile({
      id: '',
      username: '',
      displayName: '',
      avatar: avatarOptions[0],
      isPublic: true,
    });
    setShowProfileModal(false);
  };

  const getDisplayAddress = () => {
    if (accountType === 'wallet') {
      return walletAddress;
    } else if (accountType === 'local') {
      return `@${profile.username}`;
    }
    return '';
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!isConnected) {
      alert("Please connect your wallet or create an account to send decentralized messages.");
      return;
    }

    const msgId = Math.random().toString(36).substr(2, 9);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: msgId,
      sender: profile.displayName || 'You',
      address: accountType === 'wallet' ? walletAddress : `@${profile.username}`,
      avatar: profile.avatar,
      content: newMessage,
      timestamp: time,
      txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
      status: 'pending'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'confirmed' } : m));
      
      setTimeout(() => {
        const randomBot = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomReply = botResponses[Math.floor(Math.random() * botResponses.length)];
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setMessages(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          sender: randomBot.name,
          address: randomBot.address,
          avatar: randomBot.avatar,
          content: randomReply,
          timestamp: replyTime,
          txHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
          status: 'confirmed'
        }]);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-[#0B0E17] text-gray-100 font-sans overflow-hidden">
      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => { setShowAuthModal(false); setAuthMode('choice'); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0F1322] border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {authMode === 'choice' && (
                <>
                  <div className="text-center mb-6">
                    <div className="bg-indigo-600 p-3 rounded-xl inline-flex mb-4">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to EtherChat</h2>
                    <p className="text-gray-400 text-sm">Connect your Web3 identity or create a local account</p>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setConnectionError('');
                        setAuthMode('connect');
                      }}
                      className="w-full flex items-center space-x-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-indigo-500/50 hover:bg-gray-800 transition-all group"
                    >
                      <div className="bg-indigo-600 p-3 rounded-xl group-hover:bg-indigo-500 transition-colors">
                        <Wallet className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-white font-semibold">Connect Web3 Wallet</h3>
                        <p className="text-gray-400 text-sm">Use your MetaMask or wallet to connect</p>
                      </div>
                      <ShieldCheck className="h-5 w-5 text-indigo-400" />
                    </button>
                    
                    <button
                      onClick={() => setAuthMode('create')}
                      className="w-full flex items-center space-x-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-emerald-500/50 hover:bg-gray-800 transition-all group"
                    >
                      <div className="bg-emerald-600 p-3 rounded-xl group-hover:bg-emerald-500 transition-colors">
                        <UserPlus className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="text-white font-semibold">Create Local Account</h3>
                        <p className="text-gray-400 text-sm">Sign up with a username - no wallet needed</p>
                      </div>
                      <Fingerprint className="h-5 w-5 text-emerald-400" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      setConnectionError('');
                    }}
                    className="mt-4 w-full text-gray-500 hover:text-gray-300 text-sm transition-colors"
                  >
                    Maybe later
                  </button>
                </>
              )}

              {authMode === 'connect' && (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('choice');
                      setConnectionError('');
                    }}
                    className="text-gray-400 hover:text-white text-sm mb-4 flex items-center"
                  >
                    ← Back
                  </button>
                  
                  <div className="text-center mb-6">
                    <div className="bg-indigo-600 p-3 rounded-xl inline-flex mb-4">
                      <Wallet className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Connect Wallet</h2>
                    <p className="text-gray-400 text-sm">Authorize with your cryptographic identity</p>
                  </div>

                  {!isMetaMaskInstalled() && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-red-400 text-sm font-medium">MetaMask Not Installed</p>
                        <p className="text-red-300 text-xs mt-1">
                          <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                            Install MetaMask
                          </a>
                          {' '}to use wallet connection
                        </p>
                      </div>
                    </div>
                  )}

                  {connectionError && (
                    <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 mb-4 flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-amber-400 text-sm font-medium">Connection Issue</p>
                        <p className="text-amber-200 text-xs mt-1">{connectionError}</p>
                        <p className="text-amber-300 text-xs mt-2">
                          💡 Try switching to a different network in MetaMask or wait a moment and try again.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700">
                    <div className="flex items-center space-x-3 mb-3">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-10 w-10" />
                      <div>
                        <h3 className="text-white font-medium">MetaMask</h3>
                        <p className="text-gray-400 text-xs">Most popular Web3 wallet</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting || !isMetaMaskInstalled()}
                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 text-white font-medium py-3 rounded-xl transition-all"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="h-5 w-5" />
                        <span>Connect MetaMask</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {authMode === 'create' && (
                <>
                  <button
                    onClick={() => setAuthMode('choice')}
                    className="text-gray-400 hover:text-white text-sm mb-4 flex items-center"
                  >
                    ← Back
                  </button>
                  
                  <div className="text-center mb-6">
                    <div className="bg-emerald-600 p-3 rounded-xl inline-flex mb-4">
                      <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400 text-sm">Set up your decentralized identity</p>
                  </div>
                  
                  {createError && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-red-400 text-sm">
                      {createError}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block">Username</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                          placeholder="your_username"
                          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-8 pr-4 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors"
                          maxLength={20}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block">Display Name</label>
                      <input
                        type="text"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        placeholder="Your Display Name"
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-colors"
                        maxLength={30}
                      />
                    </div>
                    
                    <div>
                      <label className="text-gray-300 text-sm font-medium mb-2 block">Choose Avatar</label>
                      <div className="flex space-x-3">
                        {avatarOptions.map((avatar, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedAvatar(avatar)}
                            className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                              selectedAvatar === avatar ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-transparent hover:border-gray-600'
                            }`}
                          >
                            <img src={avatar} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {isPublicAccount ? (
                            <Globe className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <Lock className="h-5 w-5 text-amber-400" />
                          )}
                          <div>
                            <h4 className="text-white font-medium">
                              {isPublicAccount ? 'Public Account' : 'Private Account'}
                            </h4>
                            <p className="text-gray-400 text-xs">
                              {isPublicAccount 
                                ? 'Your profile is visible to everyone' 
                                : 'Only approved users can see your profile'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={toggleAccountPrivacy}
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            isPublicAccount ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                              isPublicAccount ? 'left-8' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={createAccount}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-all mt-6"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Create Account</span>
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0F1322] border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img src={profile.avatar} alt={profile.displayName} className="h-20 w-20 rounded-full object-cover" />
                  {accountType === 'wallet' && (
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 p-1.5 rounded-full">
                      <ShieldCheck className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {accountType === 'local' && (
                    <div className="absolute -bottom-1 -right-1 bg-emerald-600 p-1.5 rounded-full">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{profile.displayName || 'User'}</h3>
                  <p className="text-gray-400 text-sm">@{profile.username}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      accountType === 'wallet' 
                        ? 'bg-indigo-500/20 text-indigo-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {accountType === 'wallet' ? 'Web3 Wallet' : 'Local Account'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <label className="text-gray-300 text-sm font-medium mb-3 flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Account Privacy</span>
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {profile.isPublic ? (
                        <>
                          <Globe className="h-5 w-5 text-emerald-400" />
                          <div>
                            <h4 className="text-white font-medium">Public</h4>
                            <p className="text-gray-400 text-xs">Everyone can see your profile</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 text-amber-400" />
                          <div>
                            <h4 className="text-white font-medium">Private</h4>
                            <p className="text-gray-400 text-xs">Only you can see your profile</p>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={toggleAccountPrivacy}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        profile.isPublic ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          profile.isPublic ? 'left-8' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {accountType === 'wallet' && (
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <label className="text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                      <Wallet className="h-4 w-4" />
                      <span>Wallet Address</span>
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-mono text-sm">{walletAddress}</span>
                      <button 
                        onClick={() => handleCopyAddress(walletAddress)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {accountType === 'wallet' && (
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <label className="text-gray-300 text-sm font-medium mb-2 flex items-center space-x-2">
                      <Layers className="h-4 w-4" />
                      <span>ETH Balance</span>
                    </label>
                    <span className="text-white font-mono text-lg">{balance} ETH</span>
                  </div>
                )}

                <button
                  onClick={disconnectAccount}
                  className="w-full flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 rounded-xl transition-all border border-red-500/30"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Disconnect Account</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 z-40 md:relative md:flex flex-col w-72 border-r border-gray-800 bg-[#0F1322] transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">EtherChat</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <div className="flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 tracking-wider uppercase">
              <span>Channels</span>
              <Globe className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => {
                    setActiveChannel(channel);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeChannel.id === channel.id
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  }`}
                >
                  <channel.icon className="h-4 w-4" />
                  <span className="flex-1 text-left truncate">{channel.name}</span>
                  {channel.unread && <div className="h-2 w-2 rounded-full bg-indigo-500" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 tracking-wider uppercase">
              <span>Active Wallets</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <div className="space-y-1">
              {mockUsers.map((user, i) => (
                <div key={i} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800/50 cursor-pointer">
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-crop" />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-gray-900"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 truncate text-xs font-medium">{user.name}</p>
                    <p className="text-gray-500 text-[10px] truncate">{user.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isConnected && (
          <div className="p-4 border-t border-gray-800 bg-[#0F1322]/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Connected Profile</span>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  accountType === 'wallet' 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {accountType === 'wallet' ? 'Web3' : 'Local'}
                </span>
                <span className={`flex items-center text-xs ${
                  profile.isPublic ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {profile.isPublic ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full flex items-center space-x-3 hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
            >
              <div className="relative">
                <img src={profile.avatar} alt="User" className="h-10 w-10 rounded-full" />
                {accountType === 'wallet' && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 p-0.5 rounded-full">
                    <ShieldCheck className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-200 truncate">{profile.displayName || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">@{profile.username}</p>
              </div>
              <Settings className="h-4 w-4 text-gray-500" />
            </button>
            <div className="mt-3 bg-gray-800/50 p-2 rounded-lg flex items-center justify-between text-xs">
              <span className="text-gray-400">
                {accountType === 'wallet' ? 'Balance' : 'Status'}
              </span>
              <span className="text-gray-200 font-medium font-mono">
                {accountType === 'wallet' ? `${balance} ETH` : 'Online'}
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navbar */}
        <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0F1322]/90 sticky top-0 z-30 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-gray-400 hover:text-white">
              <Menu size={24} />
            </button>
            <div className="bg-indigo-500/10 p-2 rounded-lg md:hidden">
              <Shield className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-tight">#{activeChannel.name}</h2>
              </div>
              <p className="hidden sm:block text-xs text-gray-500">{activeChannel.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1 bg-gray-800/60 px-3 py-1.5 rounded-full text-xs text-gray-400 border border-gray-700">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-mono">Block: {blockNumber}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 ml-1 animate-pulse"></span>
            </div>

            {!isConnected ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            ) : (
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-3 bg-gray-800/80 px-4 py-2 rounded-xl border border-indigo-500/30 hover:bg-gray-800 transition-colors"
              >
                <img src={profile.avatar} alt="User" className="h-6 w-6 rounded-full" />
                <span className="text-xs font-mono font-medium text-indigo-400 hidden sm:inline">{getDisplayAddress()}</span>
                <div className="h-4 w-px bg-gray-700"></div>
                <div className={`h-2.5 w-2.5 rounded-full ${
                  accountType === 'wallet' ? 'bg-indigo-500' : 'bg-emerald-500'
                }`}></div>
              </button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-linear-to-b from-[#0B0E17] to-[#0D111D]">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-3 group"
              >
                <img src={msg.avatar} alt={msg.sender} className="h-10 w-10 rounded-full mt-1 object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{msg.sender}</span>
                    <span className="text-xs text-gray-500 font-mono">{msg.address}</span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <div className="mt-1.5 text-sm text-gray-300 bg-gray-800/40 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-gray-800 group-hover:bg-gray-800/60 transition-colors">
                    <p>{msg.content}</p>
                  </div>
                  {msg.txHash && (
                    <div className="flex items-center mt-1 space-x-2 text-[10px] text-gray-500 font-mono tracking-tight">
                      <Zap className="h-3 w-3 text-amber-500" />
                      <span>Tx: {msg.txHash}</span>
                      {msg.status === 'confirmed' ? (
                        <span className="flex items-center text-green-500 ml-1">
                          <Check className="h-3 w-3 mr-0.5" /> Confirmed
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-500 ml-1">
                          <Clock className="h-3 w-3 mr-0.5 animate-spin" /> Mining...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-800 bg-[#0F1322]/90 backdrop-blur-sm">
          {!isConnected ? (
            <div className="flex items-center justify-between p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-indigo-400" />
                <div>
                  <h4 className="text-sm font-medium text-white">Chat is locked in Web3 mode</h4>
                  <p className="text-xs text-gray-400">Connect your wallet or create an account to authorize your identity and send messages.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAuthModal(true)} 
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <div className="flex-1 flex items-center bg-gray-800/50 border border-gray-700 rounded-xl px-3 focus-within:border-indigo-500 transition-colors">
                <input
                  type="text"
                  placeholder={`Send a decentralized message to #${activeChannel.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full h-12 bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
