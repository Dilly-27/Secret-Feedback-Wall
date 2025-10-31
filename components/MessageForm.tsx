'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';
import { encryptMessage } from '@/lib/encryption';

export function MessageForm() {
  const [message, setMessage] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const { address } = useAccount();
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !CONTRACT_ADDRESS || !address) return;
    
    try {
      setIsEncrypting(true);
      
      const encryptedData = await encryptMessage(message);
      
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'submitFeedback',
        args: [encryptedData],
      });
      
    } catch (error) {
      console.error('Encryption error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to encrypt message. Please try again.';
      alert(errorMessage);
    } finally {
      setIsEncrypting(false);
    }
  };

  if (isSuccess) {
    setTimeout(() => setMessage(''), 2000);
  }

  const charCount = message.length;
  const maxChars = 256;
  const isValid = charCount > 0 && charCount <= maxChars;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Submit Anonymous Feedback
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts anonymously... Your message will be encrypted before submission."
              className="w-full h-40 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all resize-none"
              maxLength={maxChars}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${charCount > maxChars ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {charCount} / {maxChars} characters
              </span>
              <span className="text-xs text-gray-400">
                🔒 End-to-end encrypted
              </span>
            </div>
          </div>

          {isSuccess && (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl animate-fade-in">
              ✅ Message submitted successfully and encrypted on the blockchain!
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || isPending || isConfirming || isEncrypting || !CONTRACT_ADDRESS}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {isEncrypting
              ? '🔐 Encrypting...'
              : isPending
              ? '📝 Signing...'
              : isConfirming
              ? '⏳ Confirming...'
              : '🚀 Submit Encrypted Message'}
          </button>

          {!CONTRACT_ADDRESS && (
            <p className="text-red-500 text-sm text-center">
              Contract not deployed. Please check your configuration.
            </p>
          )}
        </form>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
          <h3 className="font-semibold text-sm mb-2 text-gray-800 dark:text-white">
            Privacy Notice:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Your message is encrypted client-side using RSA-2048</li>
            <li>• Nobody can read your message except the admin</li>
            <li>• Your wallet address is not linked to the message content</li>
            <li>• Messages are stored encrypted on the blockchain forever</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
