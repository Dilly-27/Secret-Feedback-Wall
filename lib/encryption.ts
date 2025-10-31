import { 
  encryptMessageWithPublicKey, 
  decryptMessageWithPrivateKey,
  encryptedStringToBytes32Array,
  bytes32ArrayToEncryptedString,
  getAdminPublicKey,
  getAdminPrivateKey
} from './crypto';

export async function encryptMessage(message: string): Promise<`0x${string}`[]> {
  const publicKey = getAdminPublicKey();
  
  if (!publicKey) {
    throw new Error('Admin public key not found. Admin must generate encryption keys first.');
  }

  const encryptedBase64 = await encryptMessageWithPublicKey(message, publicKey);
  const bytes32Array = encryptedStringToBytes32Array(encryptedBase64);
  
  return bytes32Array;
}

export async function decryptMessage(
  encryptedData: string[],
  userAddress: string
): Promise<string> {
  const privateKey = getAdminPrivateKey();
  
  if (!privateKey) {
    throw new Error('Admin private key not found. Cannot decrypt messages.');
  }

  try {
    const encryptedBase64 = bytes32ArrayToEncryptedString(encryptedData);
    const decrypted = await decryptMessageWithPrivateKey(encryptedBase64, privateKey);
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message. The encryption keys may be invalid.');
  }
}
