"use client";

import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/");
    router.refresh();
  }

  async function demoLogin(email: string) {
    setError(null);
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email,
      password: "ChangeMe123!",
      redirect: false,
    });
    setIsSubmitting(false);
    if (result?.error) {
      setError("Demo login failed. Run the seed first.");
      return;
    }
    router.push("/");
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
    <main className="auth-shell">
      <form className="panel" onSubmit={onSubmit}>
        <div>
          <p className="eyebrow">Enterprise BPM</p>
          <h1>Sign in</h1>
        </div>
        <label>
          Email
          <input name="email" type="email" defaultValue="admin@example.com" required />
        </label>
        <label>
          Password
          <input name="password" type="password" defaultValue="ChangeMe123!" required />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        <div className="demo-logins">
          <p>Demo logins</p>
          {demoUsers.map((user) => (
            <button key={user.email} type="button" disabled={isSubmitting} onClick={() => demoLogin(user.email)}>
              <span>{user.role}</span>
              <small>{user.email}</small>
            </button>
          ))}
        </div>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="auth-shell">Loading...</main>}>
      <LoginForm />
    </Suspense>
  );
}
