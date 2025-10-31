import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, hardhat } from 'viem/chains';

export const config = getDefaultConfig({
  appName: 'Secret Feedback Wall',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia, hardhat],
  ssr: true,
});
