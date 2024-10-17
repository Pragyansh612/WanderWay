'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === 'authenticated') {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      console.log("Login successful, awaiting session update");
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div>
        <h1>Already logged in</h1>
        <p>Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div  className="relative min-h-screen flex flex-col items-center overflow-hidden"
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
        right: '15%',
        animation: 'float 6s ease-in-out infinite',
      }}>
        <Image src="/cloud.png" alt="Cloud" width={140} height={100} opacity={0.6} />
      </div>
      <div style={{
        position: 'absolute',
        bottom: '0%',
        left: '20%',
        animation: 'float 8s ease-in-out infinite',
      }}>
        <Image src="/cloud.png" alt="Cloud" width={150} height={120} opacity={0.5} />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen z-50">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Welcome Back to WanderWay</h1>

          {error && <p className="text-center text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-600 transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-6">
            <div className="text-center text-gray-600 mb-4">Or login with</div>
            <div className="flex justify-center gap-4">
              <button
                className="flex items-center justify-center gap-2 w-full bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-200 transition duration-300"
                onClick={() => signIn("github")}
              >
                <img src="https://cdn.simpleicons.org/github/000" alt="GitHub" className="w-5 h-5" />
                GitHub
              </button>
              <button
                className="flex items-center justify-center gap-2 w-full bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-200 transition duration-300"
                onClick={() => signIn("google")}
              >
                <img src="https://cdn.simpleicons.org/google/4285F4" alt="Google" className="w-5 h-5" />
                Google
              </button>
            </div>
          </div>

          {/* Signup Link */}
          <p className="mt-4 text-center text-gray-600">
            New to WanderWay?{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline">
              Create an account
            </Link>
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

export default Page;
