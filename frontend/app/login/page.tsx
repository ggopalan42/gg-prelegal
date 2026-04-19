'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (localStorage.getItem('prelegal_user')) {
      router.replace('/');
    }
  }, [router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    localStorage.setItem('prelegal_user', JSON.stringify({ name: name.trim(), email: email.trim() }));
    router.replace('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="bg-white rounded-lg border border-gray-200 p-10 w-full max-w-md shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold" style={{ color: '#032147' }}>PreLegal</h1>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>Sign in to draft your legal agreements</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#032147' }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#032147' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#753991' }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
