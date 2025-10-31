'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { MessageForm } from '@/components/MessageForm';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminKeySetup } from '@/components/AdminKeySetup';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CONTRACT_ADDRESS, ADMIN_ADDRESS } from '@/lib/constants';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  
  const isAdmin = address?.toLowerCase() === ADMIN_ADDRESS?.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🔐 Secret Feedback Wall
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              End-to-End Encrypted with RSA-2048
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ConnectButton />
          </div>
        </header>

        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
            <div className="glass-effect rounded-3xl p-12 text-center max-w-2xl">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
                Welcome to the Secret Feedback Wall
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Share your thoughts anonymously with end-to-end encryption. 
                Your messages are encrypted using RSA-2048 asymmetric encryption 
                and stored securely on the blockchain. Only the admin can decrypt them.
              </p>
              <div className="bg-purple-100 dark:bg-purple-900 rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">How it works:</h3>
                <ol className="text-left text-gray-700 dark:text-gray-300 space-y-2">
                  <li>1. Admin generates RSA-2048 encryption keypair</li>
                  <li>2. Connect your wallet</li>
                  <li>3. Write your anonymous message (max 256 characters)</li>
                  <li>4. Message is encrypted client-side with admin's public key</li>
                  <li>5. Submit to the blockchain (stays encrypted)</li>
                  <li>6. Only the admin can decrypt with their private key</li>
                </ol>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connect your wallet to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-slide-up">
            {isAdmin && <AdminKeySetup />}
            
            {isAdmin && (
              <div className="mb-6 flex gap-4 justify-center">
                <button
                  onClick={() => setActiveTab('user')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'user'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Submit Message
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Admin Dashboard
                </button>
              </div>
            )}

            {activeTab === 'user' ? (
              <MessageForm />
            ) : (
              <AdminDashboard />
            )}
          </div>
        )}

        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Contract: {CONTRACT_ADDRESS ? `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}` : 'Not deployed'}</p>
          <p className="mt-2">Built with ❤️ using RSA-2048 encryption, Next.js, and Hardhat</p>
        </footer>
      </div>
    </div>
  );
}
