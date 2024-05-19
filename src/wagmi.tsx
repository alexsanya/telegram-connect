import { http, createConfig } from 'wagmi';
import { mainnet, zkSync } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = '3fbb6bba6f1de962d911bb5b5c9dba88';

export const config = createConfig({
  chains: [mainnet, zkSync],
  connectors: [injected(), walletConnect({ projectId })],
  transports: {
    [mainnet.id]: http(),
    [zkSync.id]: http()
  },
});
