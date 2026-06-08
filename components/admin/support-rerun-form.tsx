"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function SupportRerunForm({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  async function onRerun() {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/support/rerun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: "Assignment logic executed successfully." });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.error || "Failed to rerun logic." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={onRerun} isLoading={isSubmitting} variant="outline">
        Rerun Assignment Logic
      </Button>
      {message && (
        <p className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
