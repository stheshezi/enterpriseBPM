"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LoginModal } from "@/components/auth/login-modal";

export default function LandingPage() {
  const { data: session } = useSession();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  if (session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enterprise BPM</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user.name}</span>
              <Link href="/dashboard">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                  Dashboard
                </button>
              </Link>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {session.user.name}!
            </h2>
            <p className="text-xl text-gray-600">
              Your enterprise workflow management platform
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/requests/new">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">New Request</h3>
                <p className="text-gray-600">Submit a new travel request</p>
              </div>
            </Link>
            <Link href="/requests">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">My Requests</h3>
                <p className="text-gray-600">View and manage your requests</p>
              </div>
            </Link>
            <Link href="/tasks">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">My Tasks</h3>
                <p className="text-gray-600">Review pending approvals</p>
              </div>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Enterprise BPM</h1>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Enterprise Workflow Management
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Streamline your travel requests, approvals, and workflows with our
          comprehensive business process management platform.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Requests</h3>
            <p className="text-gray-600">
              Intelligent travel request handling with multi-level approval workflows
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Approvals</h3>
            <p className="text-gray-600">
              Streamlined approval process with real-time notifications
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Insights</h3>
            <p className="text-gray-600">
              Comprehensive reporting and analytics for better decision making
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16">
          <button
            onClick={() => setLoginModalOpen(true)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg"
          >
            Get Started
          </button>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
}
