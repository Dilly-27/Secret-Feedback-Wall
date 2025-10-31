export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;
export const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS as `0x${string}` | undefined;

export const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_admin", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "InvalidMessageLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "OnlyAdmin",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }
    ],
    "name": "NewMessage",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADMIN",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "isAdmin",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "getMessage",
    "outputs": [{ "internalType": "bytes32[]", "name": "", "type": "bytes32[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMessageCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMessages",
    "outputs": [{ "internalType": "bytes32[][]", "name": "", "type": "bytes32[][]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "messageCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "messages",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32[]", "name": "encryptedMessage", "type": "bytes32[]" }],
    "name": "submitFeedback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
