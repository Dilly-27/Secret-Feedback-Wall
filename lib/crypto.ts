const ADMIN_PUBLIC_KEY_STORAGE_KEY = 'admin_public_key';
const ADMIN_PRIVATE_KEY_STORAGE_KEY = 'admin_private_key';

export async function generateAdminKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKeyExport = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKeyExport = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyExport)));
  const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKeyExport)));

  return {
    publicKey: publicKeyBase64,
    privateKey: privateKeyBase64,
  };
}

export function saveAdminKeys(publicKey: string, privateKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_PUBLIC_KEY_STORAGE_KEY, publicKey);
    localStorage.setItem(ADMIN_PRIVATE_KEY_STORAGE_KEY, privateKey);
  }
}

export function getAdminPublicKey(): string | null {
  if (process.env.NEXT_PUBLIC_ADMIN_PUBLIC_KEY) {
    return process.env.NEXT_PUBLIC_ADMIN_PUBLIC_KEY;
  }
  
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ADMIN_PUBLIC_KEY_STORAGE_KEY);
  }
  return null;
}

export function getAdminPrivateKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ADMIN_PRIVATE_KEY_STORAGE_KEY);
  }
  return null;
}

export async function encryptMessageWithPublicKey(message: string, publicKeyBase64: string): Promise<string> {
  const publicKeyDer = Uint8Array.from(atob(publicKeyBase64), c => c.charCodeAt(0));
  
  const publicKey = await crypto.subtle.importKey(
    'spki',
    publicKeyDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  );

  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(message);

  const chunkSize = 190;
  const chunks: Uint8Array[] = [];

  for (let i = 0; i < messageBytes.length; i += chunkSize) {
    const chunk = messageBytes.slice(i, i + chunkSize);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      chunk
    );
    chunks.push(new Uint8Array(encrypted));
  }

  const encryptedData = {
    chunks: chunks.map(chunk => btoa(String.fromCharCode(...chunk))),
    originalLength: messageBytes.length,
  };

  return btoa(JSON.stringify(encryptedData));
}

export async function decryptMessageWithPrivateKey(encryptedBase64: string, privateKeyBase64: string): Promise<string> {
  const privateKeyDer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
  
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['decrypt']
  );

  const encryptedData = JSON.parse(atob(encryptedBase64));
  const decryptedChunks: Uint8Array[] = [];

  for (const chunkBase64 of encryptedData.chunks) {
    const chunkBytes = Uint8Array.from(atob(chunkBase64), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      chunkBytes
    );
    decryptedChunks.push(new Uint8Array(decrypted));
  }

  const totalLength = decryptedChunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of decryptedChunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  const decoder = new TextDecoder();
  return decoder.decode(combined);
}

export function encryptedStringToBytes32Array(encryptedBase64: string): `0x${string}`[] {
  const bytes = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const bytes32Array: `0x${string}`[] = [];
  
  for (let i = 0; i < bytes.length; i += 32) {
    const chunk = new Uint8Array(32);
    const slice = bytes.slice(i, i + 32);
    chunk.set(slice);
    
    const hex = '0x' + Array.from(chunk)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    bytes32Array.push(hex as `0x${string}`);
  }
  
  return bytes32Array;
}

export function bytes32ArrayToEncryptedString(bytes32Array: string[]): string {
  const allBytes: number[] = [];
  
  for (const hex of bytes32Array) {
    const hexStr = hex.startsWith('0x') ? hex.slice(2) : hex;
    for (let i = 0; i < hexStr.length; i += 2) {
      allBytes.push(parseInt(hexStr.slice(i, i + 2), 16));
    }
  }
  
  let endIndex = allBytes.length;
  for (let i = allBytes.length - 1; i >= 0; i--) {
    if (allBytes[i] !== 0) {
      endIndex = i + 1;
      break;
    }
  }
  
  const trimmedBytes = allBytes.slice(0, endIndex);
  return btoa(String.fromCharCode(...trimmedBytes));
}
