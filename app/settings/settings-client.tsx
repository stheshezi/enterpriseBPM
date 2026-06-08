"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TenantSettingsForm, TenantSettingsValues } from "@/components/admin/tenant-settings-form";

export function SettingsClient({ initialData }: { initialData: Partial<TenantSettingsValues> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: TenantSettingsValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to save settings");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TenantSettingsForm
      defaultValues={initialData}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    />
  );
}
