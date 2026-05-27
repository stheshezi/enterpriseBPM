"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LoginModal } from "@/components/auth/login-modal";

export default function LandingPage() {
  const { data: session } = useSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Authenticated view – simple dashboard shortcut
  if (session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
        <nav className="flex items-center justify-between px-8 py-4">
          <h1 className="text-2xl font-bold">Enterprise BPM</h1>
          <div className="flex items-center gap-4">
            <span>{session.user.name}</span>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition">
                Dashboard
              </button>
            </Link>
            <button onClick={() => signOut()} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition">
              Sign out
            </button>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto py-24 text-center">
          <h2 className="text-4xl font-bold mb-6">Welcome back, {session.user.name}!</h2>
          <p className="text-lg mb-8">Your enterprise workflow hub is ready.</p>
          <Link href="/dashboard">
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition">
              Go to Dashboard
            </button>
          </Link>
        </main>
      </div>
    );
  }

  // Guest view – premium landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-bold">Enterprise BPM</h1>
        <button
          onClick={() => setLoginModalOpen(true)}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition"
        >
          Sign in
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center py-24">
        <h2 className="text-5xl font-extrabold mb-6">Enterprise Workflow Management</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Streamline your travel requests, approvals, and workflows with our comprehensive business process management platform.
        </p>
        <button
          onClick={() => setLoginModalOpen(true)}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
        >
          Get Started
        </button>
      </section>

      {/* Feature cards – glassmorphism */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4 pb-16">
        <div className="glass-card p-6 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl text-center">
          <div className="text-4xl mb-4">✈️</div>
          <h3 className="text-xl font-semibold mb-2">Smart Requests</h3>
          <p className="text-sm opacity-90">
            Intelligent travel request handling with multi‑level approval workflows
          </p>
        </div>
        <div className="glass-card p-6 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Fast Approvals</h3>
          <p className="text-sm opacity-90">
            Streamlined approval process with real‑time notifications
          </p>
        </div>
        <div className="glass-card p-6 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Insights</h3>
          <p className="text-sm opacity-90">
            Comprehensive reporting and analytics for better decision making
          </p>
        </div>
      </section>

      {/* Footer demo credentials */}
      <footer className="text-center py-8">
        <p className="text-sm opacity-80 mb-2">Demo logins</p>
        <div className="flex justify-center gap-4 text-sm">
          <span className="font-mono">admin@example.com / ChangeMe123!</span>
          <span className="font-mono">tenant.admin@example.com / ChangeMe123!</span>
          <span className="font-mono">it.support@example.com / ChangeMe123!</span>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
}
