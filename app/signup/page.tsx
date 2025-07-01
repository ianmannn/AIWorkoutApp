'use client';
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // For demo purposes, we'll just sign in with the new credentials
      // In a real app, you'd create the user account first
      const result = await signIn('credentials', {
        username,
        password,
        email,
        redirect: false,
      });

      if (result?.error) {
        setError('Account creation failed');
      } else {
        router.push('/');
      }
    } catch {
      setError('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="flex flex-col p-16 gap-4 bg-gray-600 rounded-lg shadow-md">
        <h1 className="flex flex-col text-4xl font-bold text-white items-center">
          Sign Up
        </h1>
        {error && (
          <div className="p-3 bg-red-500 text-white rounded-md text-center">
            {error}
          </div>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <input
            type="text"
            className="p-2 rounded-md bg-gray-400 text-black"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            className="p-2 rounded-md bg-gray-400 text-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="p-2 rounded-md bg-gray-400 text-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="p-2 rounded-md bg-gray-400 text-black"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 rounded-md bg-blue-400 text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-blue-300">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
