'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI, ADMIN_ADDRESS } from '@/lib/constants';
import { decryptMessage } from '@/lib/encryption';
import { getAdminPrivateKey } from '@/lib/crypto';
import { AdminKeySetup } from './AdminKeySetup';

interface DecryptedMessage {
  id: number;
  encrypted: string[];
  decrypted: string;
  isDecrypting: boolean;
}

export function AdminDashboard() {
  const { address } = useAccount();
  const [decryptedMessages, setDecryptedMessages] = useState<DecryptedMessage[]>([]);
  const [hasPrivateKey, setHasPrivateKey] = useState(false);
  
  const { data: messages, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMessages',
  });

  const { data: messageCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMessageCount',
  });

  useEffect(() => {
    const checkPrivateKey = () => {
      const privateKey = getAdminPrivateKey();
      setHasPrivateKey(!!privateKey);
    };

    checkPrivateKey();

    const interval = setInterval(checkPrivateKey, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      const formattedMessages = messages.map((msg, index) => ({
        id: index,
        encrypted: msg as string[],
        decrypted: '',
        isDecrypting: false,
      }));
      setDecryptedMessages(formattedMessages);
    }
  }, [messages]);

  const handleDecrypt = async (index: number) => {
    if (!address) return;
    
    setDecryptedMessages(prev => 
      prev.map((msg, i) => 
        i === index ? { ...msg, isDecrypting: true } : msg
      )
    );

    try {
      const encrypted = decryptedMessages[index].encrypted;
      const decrypted = await decryptMessage(encrypted, address);
      
      setDecryptedMessages(prev =>
        prev.map((msg, i) =>
          i === index ? { ...msg, decrypted, isDecrypting: false } : msg
        )
      );
    } catch (error) {
      console.error('Decryption error:', error);
      setDecryptedMessages(prev =>
        prev.map((msg, i) =>
          i === index ? { ...msg, decrypted: 'Failed to decrypt', isDecrypting: false } : msg
        )
      );
    }
  };

  const handleDecryptAll = async () => {
    if (!address) return;
    
    for (let i = 0; i < decryptedMessages.length; i++) {
      if (!decryptedMessages[i].decrypted) {
        await handleDecrypt(i);
      }
    }
  };

  const isAdmin = address?.toLowerCase() === ADMIN_ADDRESS?.toLowerCase();

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-effect rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Admin Access Only
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You must be connected as the admin to view this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AdminKeySetup />
      
      <div className="glass-effect rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Total Messages: {messageCount?.toString() || '0'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleDecryptAll}
              disabled={!hasPrivateKey}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={!hasPrivateKey ? 'Generate encryption keys first' : 'Decrypt all messages'}
            >
              🔓 Decrypt All
            </button>
          </div>
        </div>

        {decryptedMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No messages yet. Be the first to submit feedback!
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {decryptedMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Message #{msg.id}
                  </span>
                  {!msg.decrypted && !msg.isDecrypting && (
                    <button
                      onClick={() => handleDecrypt(msg.id)}
                      disabled={!hasPrivateKey}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={!hasPrivateKey ? 'Generate encryption keys first' : 'Decrypt this message'}
                    >
                      🔓 Decrypt
                    </button>
                  )}
                </div>

                {msg.isDecrypting ? (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                    <span>Decrypting message...</span>
                  </div>
                ) : msg.decrypted ? (
                  <div>
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                      {msg.decrypted}
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500 italic">
                    🔒 Encrypted message (click decrypt to view)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
