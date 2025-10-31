# 🔐 Secret Feedback Wall - Encrypted DApp

An anonymous encrypted feedback wall built with **RSA-2048 asymmetric encryption**. Users can submit completely anonymous messages that are encrypted client-side and stored on the blockchain. Only the admin can decrypt and read the messages.

## 🌟 Features

- **Client-Side Encryption**: Messages are encrypted using RSA-2048 before reaching the blockchain
- **Complete Anonymity**: Messages are fully encrypted on-chain, unlinkable to sender wallets
- **Admin-Only Decryption**: Only the designated admin with the private key can decrypt and view messages
- **Beautiful UI**: Responsive design with dark/light mode, built with Tailwind CSS
- **Wallet Integration**: Seamless wallet connection using RainbowKit
- **Real-time Updates**: Auto-refresh to see new encrypted messages
- **Secure Key Management**: Admin generates RSA-2048 keypair, private key stored locally

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with dark/light mode
- **Web3**: RainbowKit, Wagmi v2, Viem v2
- **Encryption**: RSA-2048 asymmetric encryption via Web Crypto API
- **Smart Contracts**: Solidity 0.8.24, Hardhat
- **Network**: Sepolia Testnet (with local Hardhat support)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (from [Sepolia Faucet](https://sepoliafaucet.com))

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
Create a `.env.local` file:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=<your_deployed_contract_address>
NEXT_PUBLIC_ADMIN_ADDRESS=<your_admin_wallet_address>
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<your_walletconnect_id>
NEXT_PUBLIC_ADMIN_PUBLIC_KEY=<generated_from_admin_setup>
```

For Hardhat deployment, create a `.env` file:
```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
ADMIN_ADDRESS=your_admin_wallet_address
```

3. **Compile smart contracts**:
```bash
npm run compile
```

4. **Deploy to local Hardhat network**:
```bash
# Terminal 1 - Start local blockchain
npm run chain

# Terminal 2 - Deploy contract
npm run deploy
```

5. **Deploy to Sepolia testnet**:
```bash
npm run deploy:sepolia
```

6. **Start the development server**:
```bash
npm run dev
```

Visit [http://localhost:5000](http://localhost:5000) to see the app!

## 📝 How It Works

### For Users
1. Connect your wallet (MetaMask, WalletConnect, etc.)
2. Write your anonymous message (max 256 characters)
3. Click "Submit Encrypted Message"
4. Message is encrypted client-side using admin's RSA public key
5. Transaction is submitted to the blockchain
6. Message stays encrypted forever on-chain (only admin can decrypt)

### For Admins
1. Connect with the admin wallet address
2. Generate RSA-2048 keypair in the AdminKeySetup component
3. Copy the public key and add it to `.env.local` as `NEXT_PUBLIC_ADMIN_PUBLIC_KEY`
4. Restart the application so users can encrypt with your public key
5. Switch to "Admin Dashboard" tab
6. Click "Decrypt" on any message or "Decrypt All"
7. Messages are decrypted client-side using your private key (stored in browser localStorage)
8. Read the anonymous feedback

## 🔒 Privacy & Security

- **End-to-End Encryption**: Messages are encrypted on the client using RSA-2048 before transmission
- **On-Chain Privacy**: Messages remain encrypted on the blockchain (stored as encrypted bytes32 arrays)
- **Anonymous Submission**: Wallet addresses are not linked to message content
- **Admin-Only Access**: Only the admin with the private key can decrypt messages
- **RSA-2048 Encryption**: Industry-standard asymmetric encryption via Web Crypto API
- **Private Key Security**: Admin's private key stored in browser localStorage (for demo purposes)
- **Public Key Distribution**: Public key shared via environment variable for user encryption

## 📂 Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page component
│   ├── providers.tsx      # Wagmi, RainbowKit, Theme providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── MessageForm.tsx    # User message submission form
│   ├── AdminDashboard.tsx # Admin decryption dashboard
│   └── ThemeToggle.tsx    # Dark/light mode toggle
├── lib/                   # Utility libraries
│   ├── wagmi.ts          # Wagmi configuration
│   ├── constants.ts      # Contract ABI and addresses
│   ├── crypto.ts         # RSA-2048 key generation and crypto functions
│   └── encryption.ts     # High-level encryption/decryption using RSA
├── contracts/            # Solidity smart contracts
│   └── SecretFeedbackWall.sol
├── scripts/              # Deployment scripts
│   └── deploy.ts
└── hardhat.config.ts     # Hardhat configuration
```

## 🎯 Contract Functions

### `submitFeedback(bytes32[] calldata encryptedMessage)`
Submit an encrypted message to the feedback wall.
- **Parameters**: Array of encrypted bytes32 values (max 256)
- **Access**: Public (anyone can submit)
- **Emits**: `NewMessage(id, sender)`

### `getMessages()`
Get all encrypted messages.
- **Returns**: 2D array of encrypted messages
- **Access**: Public (anyone can read encrypted data)

### `getMessage(uint256 id)`
Get a specific message by ID.
- **Parameters**: Message ID
- **Returns**: Array of encrypted bytes32 values
- **Access**: Public

### `isAdmin(address account)`
Check if an address is the admin.
- **Parameters**: Address to check
- **Returns**: Boolean
- **Access**: Public

## 🧪 Testing

Run Hardhat tests:
```bash
npx hardhat test
```

Test on local network:
```bash
# Terminal 1
npm run chain

# Terminal 2
npm run deploy
npm run dev
```

## 🌐 Deployment

### Sepolia Testnet
1. Get Sepolia ETH from faucet
2. Configure `.env` with your private key and RPC URL
3. Deploy: `npm run deploy:sepolia`
4. Update `.env.local` with deployed contract address
5. Rebuild and deploy frontend

### Verifying Contract
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <ADMIN_ADDRESS>
```

## 📚 Resources

- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [RainbowKit Docs](https://www.rainbowkit.com/)
- [Wagmi Docs](https://wagmi.sh/)
- [Hardhat Docs](https://hardhat.org/)
- [Zama fhEVM Docs](https://docs.zama.ai/protocol/) (for future FHE integration)

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This is a demo application for educational purposes. For production use:
- Implement secure key management (not localStorage)
- Use hardware security modules (HSM) or secure enclaves for private key storage
- Add comprehensive error handling and validation
- Conduct thorough security audits
- Consider migrating to Zama's fhEVM for true fully homomorphic encryption
- Implement proper access controls and authentication

---

Built with ❤️ using RSA-2048 encryption, Next.js, and Hardhat
