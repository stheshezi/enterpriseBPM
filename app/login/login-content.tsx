"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import type { AppRole } from "@/types/auth";

type LoginPreset = "superAdmin" | "tenantAdmin" | "manager" | "finance" | "requester";

const demoPassword = "ChangeMe123!";

const loginPresets: Record<LoginPreset, { title: string; email: string; route: string; roles: AppRole[] }> = {
  superAdmin: { title: "Super Admin", email: "admin@example.com", route: "/dashboard", roles: ["SUPER_ADMIN"] },
  tenantAdmin: { title: "Tenant Admin", email: "tenant.admin@example.com", route: "/dashboard", roles: ["ADMIN"] },
  manager: { title: "Manager", email: "manager@example.com", route: "/dashboard", roles: ["MANAGER"] },
  finance: { title: "Finance", email: "finance@example.com", route: "/dashboard", roles: ["FINANCE"] },
  requester: { title: "Requester", email: "requester@example.com", route: "/dashboard", roles: ["REQUESTER"] },
};

function isSafeCallbackUrl(value: string | null) {
  return Boolean(value?.startsWith("/") && !value.startsWith("//") && !value.startsWith("/login"));
}

function destinationForLogin(callbackUrl: string | null) {
  if (isSafeCallbackUrl(callbackUrl)) return callbackUrl as string;
  return "/dashboard";
}

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const message = searchParams.get("message");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preset, setPreset] = useState<LoginPreset>("superAdmin");
  const [email, setEmail] = useState(loginPresets.superAdmin.email);
  const [password, setPassword] = useState(demoPassword);
  const [showPassword, setShowPassword] = useState(false);

  const activePreset = loginPresets[preset];

  useEffect(() => {
    let ignore = false;

    async function redirectAuthenticatedUser() {
      const session = await getSession();
      if (ignore || !session?.user) return;
      router.replace(destinationForLogin(callbackUrl));
      router.refresh();
    }

    void redirectAuthenticatedUser();

    return () => {
      ignore = true;
    };
  }, [callbackUrl, router]);

  function choosePreset(nextPreset: LoginPreset) {
    setPreset(nextPreset);
    setEmail(loginPresets[nextPreset].email);
    setPassword(demoPassword);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error || !result?.ok) {
        setError("Invalid email or password. Demo users use ChangeMe123!.");
        return;
      }

      await getSession();
      router.push(destinationForLogin(callbackUrl));
      router.refresh();
    } catch {
      setError("An unexpected sign-in error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="debt-login-page">
      <section className="debt-login-shell">
        <a className="debt-login-back" href="/">
          <ArrowLeft aria-hidden="true" size={18} />
          Back to EnterpriseBPM.co.za
        </a>

        <div className="debt-login-center">
          <header className="debt-login-header">
            <div className="debt-login-brand">Enterprise BPM</div>
            <p>Log in to manage requests, approvals, dashboards, and workflow decisions.</p>
          </header>

          <div className="debt-login-card">
            <div className="debt-login-meta">
              <div>
                <p>{activePreset.title}</p>
                <span>Next stop: {activePreset.route}</span>
              </div>
              <strong>Demo</strong>
            </div>

            {message ? <div className="debt-login-message debt-login-message--success">{message}</div> : null}

            {error ? (
              <div className="debt-login-message debt-login-message--error">
                <AlertCircle aria-hidden="true" size={17} />
                <span>{error}</span>
              </div>
            ) : null}

            <form className="debt-login-form" onSubmit={handleSubmit}>
              <label>
                <span>Email address</span>
                <input
                  autoComplete="email"
                  disabled={isLoading}
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  required
                  type="email"
                  value={email}
                />
              </label>

              <div className="debt-login-password-group">
                <div className="debt-login-password-label">
                  <label htmlFor="password">Password</label>
                  <a href="/login?message=Password reset is not wired yet.">Forgot your password?</a>
                </div>
                <div className="debt-login-password-input">
                  <input
                    autoComplete="current-password"
                    disabled={isLoading}
                    id="password"
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="debt-login-password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    type="button"
                  >
                    {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
                  </button>
                </div>
              </div>

              <button className="debt-login-submit" disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 aria-hidden="true" className="debt-login-spinner" size={18} />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </form>

            <p className="debt-login-signup">
              Don't have an account?{" "}
              <a href="/login?message=Ask your tenant admin to invite you.">Sign up</a>
            </p>
          </div>

          <div className="debt-login-demo">
            <p>Demo login</p>
            <div>
              {(Object.keys(loginPresets) as LoginPreset[]).map((key) => {
                const option = loginPresets[key];
                const selected = preset === key;

                return (
                  <button
                    aria-pressed={selected}
                    className={selected ? "is-active" : ""}
                    key={key}
                    onClick={() => choosePreset(key)}
                    type="button"
                  >
                    <span>{option.title}</span>
                    {selected ? <CheckCircle2 aria-hidden="true" size={16} /> : null}
                  </button>
                );
              })}
            </div>
            <small>
              {email} / {demoPassword}
            </small>
          </div>
        </div>

        <footer className="debt-login-footer">
          <p>Need help? Call us on 086 999 0606</p>
          <p>Powered by Enterprise BPM</p>
        </footer>
      </section>
    </main>
  );
}
