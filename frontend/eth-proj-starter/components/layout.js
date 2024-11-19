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
import { publicProvider } from 'wagmi/providers/public';


const { chains, publicClient  } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY , priority:0 }),
    publicProvider({ priority: 1 }),

  ]
);

const { connectors } = getDefaultWallets({
  appName: 'ZeroSumPac',
  projectId: '123',//TBD
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export default function Layout({ children }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div>
          <ConnectButton></ConnectButton>
          {children}
        </div>
        
      </RainbowKitProvider>
    </WagmiConfig>
  );
  }
  