"use client";

import { FormEvent, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { AppRole } from "@/types/auth";

const roleRoutes: Array<{ role: AppRole; route: string }> = [
  { role: "SUPER_ADMIN", route: "/admin" },
  { role: "ADMIN", route: "/admin/users" },
  { role: "IT_SUPPORT", route: "/admin/users" },
  { role: "MANAGER", route: "/approvals" },
  { role: "FINANCE", route: "/approvals" },
  { role: "REQUESTER", route: "/requests" },
];

function destinationForRoles(roles: AppRole[] | undefined) {
  const match = roleRoutes.find((candidate) => roles?.includes(candidate.role));
  return match?.route ?? "/requests";
}

export function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    const session = await getSession();
    onClose();
    router.push(destinationForRoles(session?.user.roles));
    router.refresh();
  }

  async function demoLogin(demoEmail: string) {
    setError(null);
    setIsSubmitting(true);
    setEmail(demoEmail);
    const result = await signIn("credentials", {
      email: demoEmail,
      password: "ChangeMe123!",
      redirect: false,
    });
    setIsSubmitting(false);
    if (result?.error) {
      setError("Login failed. Please check your connection.");
      return;
    }
    const session = await getSession();
    onClose();
    router.push(destinationForRoles(session?.user.roles));
    router.refresh();
  }

  const demoUsers = [
    { role: "Super Admin", email: "admin@example.com" },
    { role: "Tenant Admin", email: "tenant.admin@example.com" },
    { role: "IT Support", email: "it.support@example.com" },
    { role: "Manager", email: "manager@example.com" },
    { role: "Finance", email: "finance@example.com" },
    { role: "Requester", email: "requester@example.com" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <p className="text-sm font-medium text-gray-500">Enterprise BPM</p>
              <h2 className="text-lg font-bold text-gray-900">Sign in</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo logins</span>
              </div>
            </div>

            {/* Demo Login Buttons */}
            <div className="mt-6 space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => demoLogin(user.email)}
                  disabled={isSubmitting}
                  className="w-full p-3 border border-gray-200 hover:border-gray-300 disabled:opacity-50 rounded-md text-left hover:bg-gray-50 transition"
                >
                  <div className="font-medium text-sm text-gray-900">{user.role}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
