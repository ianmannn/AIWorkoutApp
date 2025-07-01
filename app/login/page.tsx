'use client';
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  React.useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="flex flex-col p-16 gap-4 bg-gray-600 rounded-lg shadow-md">
        <h1 className="flex flex-col text-4xl font-bold text-white items-center">
          Login
        </h1>
        {error && (
          <div className="p-3 bg-red-500 text-white rounded-md text-center">
            {error}
          </div>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="text"
            className="p-2 rounded-md bg-gray-400 text-black"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="p-2 rounded-md bg-gray-400 text-black"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 rounded-md bg-blue-400 text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Submit'}
          </button>

          <p>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-300">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
