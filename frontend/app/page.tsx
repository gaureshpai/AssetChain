'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user.isConnected) {
      router.push(user.role === 'admin' ? '/admin' : '/portfolio');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-black opacity-50"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to AssetChain</h1>
        <p className="text-slate-400 mb-8">Tokenized Asset Management</p>
        <div className="space-x-4">
          <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md">Login</Link>
          <Link href="/signup" className="bg-gray-700 text-white px-6 py-2 rounded-md">Signup</Link>
        </div>
      </div>
    </div>
  );
}

