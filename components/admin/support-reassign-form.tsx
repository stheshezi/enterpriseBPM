"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Select } from "@/components/ui";

export function SupportReassignForm({ taskId, currentAssignee, users }: { taskId: string, currentAssignee: string, users: { id: string, name: string }[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newUserId = String(form.get("newUserId"));
    
    if (!newUserId) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/support/reassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, newUserId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: "Task successfully reassigned." });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: data.error || "Failed to reassign task." });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const userOptions = users.map(u => ({ label: u.name, value: u.id }));

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Select 
            label={`Reassign from: ${currentAssignee}`} 
            name="newUserId" 
            options={[{ label: "Select a new assignee...", value: "" }, ...userOptions]} 
            required 
          />
        </div>
        <Button type="submit" isLoading={isSubmitting}>Confirm Reassignment</Button>
      </div>
      {message && (
        <p className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
