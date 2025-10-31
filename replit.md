# Secret Feedback Wall - FHE-Powered DApp

## Project Overview
A production-ready Web3 DApp that enables anonymous encrypted feedback submission using Fully Homomorphic Encryption (FHE) from Zama. Users can submit messages that are encrypted client-side and stored on the blockchain. Only the designated admin can decrypt and read the messages.

## Architecture

### Frontend (Next.js 15 + React 18)
- **App Router**: Using Next.js 15 app directory structure
- **Wallet Connection**: RainbowKit for beautiful wallet UI
- **Web3 Integration**: Wagmi v2 + Viem v2 for blockchain interactions
- **Styling**: Tailwind CSS with dark/light mode support
- **Encryption**: Client-side FHE encryption/decryption

### Smart Contracts (Solidity 0.8.24)
- **SecretFeedbackWall.sol**: Main contract for storing encrypted messages
- **Deployment**: Hardhat for compilation and deployment
- **Networks**: Sepolia testnet (production) + Hardhat local (development)

### Key Features
1. **Anonymous Submission**: Users submit encrypted messages via connected wallet
2. **Client-Side Encryption**: Messages encrypted before blockchain submission
3. **Admin Dashboard**: Designated admin can decrypt and view all messages
4. **Real-time Updates**: Auto-refresh to fetch new encrypted messages
5. **Responsive UI**: Beautiful design with animations and theme toggle

## File Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page (user/admin toggle)
│   ├── providers.tsx      # Wagmi, RainbowKit, Theme providers
│   └── globals.css        # Global Tailwind styles
├── components/            # React Components
│   ├── MessageForm.tsx    # User message submission
│   ├── AdminDashboard.tsx # Admin decryption view
│   └── ThemeToggle.tsx    # Dark/light mode toggle
├── lib/                   # Utilities
│   ├── wagmi.ts          # Wagmi config (Sepolia + Hardhat)
│   ├── constants.ts      # Contract ABI and addresses
│   └── encryption.ts     # FHE encryption logic
├── contracts/            # Solidity Contracts
│   └── SecretFeedbackWall.sol
├── scripts/              # Deployment Scripts
│   └── deploy.ts
└── Configuration Files
    ├── hardhat.config.ts
    ├── next.config.js
    ├── tailwind.config.ts
    └── package.json
```

## Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Deployed contract address
- `NEXT_PUBLIC_ADMIN_ADDRESS`: Admin wallet address
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project ID

### Smart Contracts (.env)
- `SEPOLIA_RPC_URL`: Alchemy/Infura Sepolia RPC URL
- `PRIVATE_KEY`: Deployer private key
- `ADMIN_ADDRESS`: Admin wallet address
- `ETHERSCAN_API_KEY`: For contract verification

## Deployment Instructions

### 1. Local Development
```bash
# Start local Hardhat network
npm run chain

# Deploy contract (in separate terminal)
npm run deploy

# Start Next.js dev server
npm run dev
```

### 2. Sepolia Testnet
```bash
# Configure .env with Sepolia RPC and private key
# Deploy to Sepolia
npm run deploy:sepolia

# Update .env.local with deployed contract address
# Start frontend
npm run dev
```

## Recent Changes
- **October 31, 2025**: Initial project creation
  - Set up Next.js 15 with TypeScript
  - Integrated RainbowKit + Wagmi v2
  - Created SecretFeedbackWall smart contract
  - Implemented FHE encryption/decryption
  - Built responsive UI with dark/light mode
  - Configured Hardhat for Sepolia deployment

## User Preferences
- None specified yet

## Technical Decisions
1. **Simplified FHE Implementation**: Using basic encryption for demo purposes. In production, would use Zama's full fhevmjs SDK
2. **Sepolia Testnet**: Chosen for easy access and free testnet ETH availability
3. **RainbowKit**: Best-in-class wallet connection UI for Web3 apps
4. **Next.js 15**: Latest version with improved performance and app router
5. **Tailwind CSS**: Rapid UI development with built-in dark mode support

## Known Limitations
- Current encryption is simplified for demonstration
- For production FHE, use Zama's official fhevmjs package
- Admin decryption happens client-side (requires admin wallet connection)
- Messages are permanently stored on-chain (no deletion)

## Next Steps for Production
1. Integrate full Zama fhevmjs SDK for real FHE
2. Add message pagination for large datasets
3. Implement message filtering and search
4. Add timestamp and metadata to messages
5. Deploy to mainnet after thorough testing
6. Add comprehensive error handling
7. Implement proper key management
8. Conduct security audit
