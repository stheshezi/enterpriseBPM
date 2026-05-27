"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  callbackUrl?: string;
}

const demoUsers = [
  { role: "Super Admin", email: "admin@example.com" },
  { role: "Tenant Admin", email: "tenant.admin@example.com" },
  { role: "IT Support", email: "it.support@example.com" },
  { role: "Manager", email: "manager@example.com" },
  { role: "Finance", email: "finance@example.com" },
  { role: "Requester", email: "requester@example.com" },
];

export const LoginModal = ({ open, onClose, callbackUrl = "/" }: LoginModalProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  async function submitCredentials(nextEmail = email, nextPassword = password) {
    setIsSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      email: nextEmail,
      password: nextPassword,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Login failed. Check the database seed and credentials.");
      return;
    }

    onClose();
    router.push(callbackUrl);
    router.refresh();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitCredentials();
  }

  return (
    <div className="ui-modal" role="presentation" onMouseDown={onClose}>
      <section
        aria-modal="true"
        className="ui-modal__panel login-modal"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="ui-modal__header">
          <div>
            <p className="eyebrow">Enterprise BPM</p>
            <h2>Sign in</h2>
          </div>
          <button aria-label="Close login" className="ui-button ui-button--icon ui-button--ghost" onClick={onClose} type="button">
            x
          </button>
        </header>

        <form className="login-modal__form" onSubmit={handleSubmit}>
          <label>
            Email
            <input autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input
              autoComplete="current-password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="demo-logins">
          <p>Demo logins</p>
          {demoUsers.map((user) => (
            <button
              disabled={isSubmitting}
              key={user.email}
              onClick={() => submitCredentials(user.email, "ChangeMe123!")}
              type="button"
            >
              <span>{user.role}</span>
              <small>{user.email}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
