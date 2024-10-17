"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (error) {
      setError('An error occurred during signup');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #cce7ff, #99d1ff)",
        position: "relative"
      }}>
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        animation: 'float 8s ease-in-out infinite',
      }}>
        <Image src="/cloud.png" alt="Cloud" width={130} height={110} opacity={0.7} />
      </div>
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        animation: 'float 6s ease-in-out infinite',
      }}>
        <Image src="/cloud.png" alt="Cloud" width={140} height={100} opacity={0.6} />
      </div>
      <div style={{
        position: 'absolute',
        bottom: '0%',
        left: '25%',
        animation: 'float 8s ease-in-out infinite',
      }}>
        <Image src="/cloud.png" alt="Cloud" width={150} height={120} opacity={0.5} />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen z-50">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Create Your WanderWay Account</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600 transition duration-300"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Login here</Link>
          </p>
        </div>
      </div>
      <style jsx>{`
                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
    </div>
  );
};

export default SignupPage;
