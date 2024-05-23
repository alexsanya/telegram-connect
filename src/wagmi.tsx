import { http, createConfig } from 'wagmi';
import { mainnet, zkSync, polygon, arbitrum, avalanche, optimism, base } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = '3fbb6bba6f1de962d911bb5b5c9dba88';

export const config = createConfig({
  chains: [mainnet, zkSync, polygon, arbitrum, avalanche, optimism, base],
  connectors: [injected(), walletConnect({ projectId })],
  transports: {
    [mainnet.id]: http(),
    [zkSync.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [optimism.id]: http(),
    [base.id]: http()
  },
});
