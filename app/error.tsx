"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        background: "linear-gradient(135deg, #f0f5ff, #e6f7ff)",
        color: "#333",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Something went wrong</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        An unexpected error occurred. Please try again or report the issue.
      </p>
      <button
        onClick={reset}
        style={{
          padding: "0.6rem 1.2rem",
          backgroundColor: "#0066ff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Retry
      </button>
    </section>
  );
}
