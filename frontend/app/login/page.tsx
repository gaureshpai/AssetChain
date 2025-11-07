'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loginMode, setLoginMode] = useState<'email' | 'wallet'>('email');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, loginWithWallet, isLoading } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleWalletLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!privateKey) {
      setError('Private key is required');
      return;
    }

    try {
      await loginWithWallet(privateKey);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Wallet login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-center">Login</h1>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => setLoginMode('email')}
              className={`px-4 py-2 rounded ${loginMode === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Email/Password
            </button>
            <button
              onClick={() => setLoginMode('wallet')}
              className={`px-4 py-2 rounded ${loginMode === 'wallet' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Private Key/Wallet
            </button>
          </div>
        </div>

        {loginMode === 'email' ? (
          <form onSubmit={handleEmailLogin} className="mt-8 space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Logging in...' : 'Login with Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleWalletLogin} className="mt-8 space-y-6">
            <div>
              <input
                type="password"
                placeholder="Enter your private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Use this option if you've previously exported your private key after email login.
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Logging in...' : 'Login with Wallet'}
            </button>
          </form>
        )}

        {error && (
          <p className="text-red-600 text-center mt-4">{error}</p>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
