'use client';

import { useState, useEffect } from 'react';
import { generateAdminKeyPair, saveAdminKeys, getAdminPublicKey } from '@/lib/crypto';

export function AdminKeySetup() {
  const [hasKeys, setHasKeys] = useState(false);
  const [publicKey, setPublicKey] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const pubKey = getAdminPublicKey();
    if (pubKey) {
      setHasKeys(true);
      setPublicKey(pubKey);
    }
  }, []);

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    try {
      const { publicKey, privateKey } = await generateAdminKeyPair();
      saveAdminKeys(publicKey, privateKey);
      setPublicKey(publicKey);
      setHasKeys(true);
    } catch (error) {
      console.error('Failed to generate keys:', error);
      alert('Failed to generate encryption keys. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey);
    alert('Public key copied to clipboard! Add this to your .env.local file as:\nNEXT_PUBLIC_ADMIN_PUBLIC_KEY=' + publicKey);
  };

  if (hasKeys) {
    return (
      <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-800 dark:text-green-200 px-4 py-3 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔐</span>
            <div>
              <p className="font-semibold">Encryption Keys Active</p>
              <p className="text-sm">Messages will be encrypted with RSA-2048</p>
            </div>
          </div>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all"
          >
            📋 Copy Public Key
          </button>
        </div>
        {!process.env.NEXT_PUBLIC_ADMIN_PUBLIC_KEY && (
          <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-sm">
            <p className="font-semibold mb-1">⚠️ Important: Share Public Key</p>
            <p className="text-xs">
              Copy your public key and add it to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.local</code> as <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">NEXT_PUBLIC_ADMIN_PUBLIC_KEY</code> so users can encrypt messages.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 px-6 py-4 rounded-xl mb-6">
      <div className="flex items-start gap-4">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <h3 className="font-bold mb-2">Admin Encryption Keys Required</h3>
          <p className="text-sm mb-4">
            As the admin, you need to generate encryption keys. Messages will be encrypted with your public key
            and only you can decrypt them with your private key (stored securely in your browser).
          </p>
          <button
            onClick={handleGenerateKeys}
            disabled={isGenerating}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            {isGenerating ? '🔄 Generating Keys...' : '🔑 Generate Encryption Keys'}
          </button>
          <p className="text-xs mt-3 opacity-75">
            Keys will be stored in your browser's localStorage. Back them up if needed.
          </p>
        </div>
      </div>
    </div>
  );
}
