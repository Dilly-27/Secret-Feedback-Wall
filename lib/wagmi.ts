import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'viem/chains';
import { http } from 'viem';

export const config = getDefaultConfig({
  appName: 'Secret Feedback Wall',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com', {
      retryCount: 3,
      retryDelay: 1000,
      timeout: 30000,
    }),
  },
  ssr: true,
});
