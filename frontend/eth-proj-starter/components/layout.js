import styles from './layout.module.css';

import '@rainbow-me/rainbowkit/styles.css';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from 'wagmi/providers/public';
import NavBar from './nav';
import { WagmiProvider } from 'wagmi'


export const shapeMainnet = {
  id: 360,
  name: 'Shape',
  network: 'Shape',
  iconUrl: '/icons/shapecircleblack.png',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://mainnet.shape.network'] },
    default: { http: ['USE ALCHEMY ENDGPOINT HERE'] },
  },
  blockExplorers: {
    etherscan: { name: 'ShapeScan', url: 'https://shapescan.xyz' },
    default: { name: 'ShapeScan', url: 'https://shapescan.xyz' },
  },
} 
export const shapeSepolia = {
  id: 11011,
  name: 'Sepolia',
  network: 'Sepolia',
  iconUrl: '/icons/shapecircleblack.png',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia.shape.network'] },
    default: { http: [USE ALCHEMY ENDPOINT HERE] },
  },
  blockExplorers: {
    etherscan: { name: 'ShapeSepoliaScan', url: 'https://explorer-sepolia.shape.network' },
    default: { name: 'ShapeSepoliaScan', url: 'https://explorer-sepolia.shape.network' },
  },
} 

const { chains, publicClient  } = configureChains(
  [shapeSepolia],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === shapeSepolia.id) {
          return { http: ["USE ALCHEMY ENDPOINT HERE"] };
        }
        if (chain.id === shapeMainnet.id) {
          return { http: ["USE ALCHEMY ENDPOINT HERE"] };  // Add custom RPC for your custom chain
        }
      },
      priority: 1,
    }),
    publicProvider({ priority: 0 }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'ZeroSumPac',
  projectId: '69f7cc51c5923f81d3f0d53cdd6f3e71',//TBD
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export default function Layout({ children }) {
  console.log('Alchemy API Key:', process.env.ALCHEMY_API_KEY);
  return (
  
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div>
          {/* <ConnectButton></ConnectButton> */}
          <NavBar children={children}>

          </NavBar>
         
        </div>
        
      </RainbowKitProvider>
    </WagmiConfig>

  );
  }
  