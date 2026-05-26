"use client";

import { FormEvent } from "react";
import { Button, Card, Input, Select } from "@/components/ui";

export type TenantSettingsValues = {
  tenantName: string;
  tenantCode: string;
  defaultTimezone: string;
  defaultCurrency: string;
  primaryContact: string;
  notificationEmail: string;
  slaDefaultHours: string;
};

export interface TenantSettingsFormProps {
  defaultValues?: Partial<TenantSettingsValues>;
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit: (values: TenantSettingsValues) => void;
}

export function TenantSettingsForm({ defaultValues, disabled, isSubmitting, onSubmit }: TenantSettingsFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit({
      tenantName: String(form.get("tenantName") ?? ""),
      tenantCode: String(form.get("tenantCode") ?? ""),
      defaultTimezone: String(form.get("defaultTimezone") ?? ""),
      defaultCurrency: String(form.get("defaultCurrency") ?? ""),
      primaryContact: String(form.get("primaryContact") ?? ""),
      notificationEmail: String(form.get("notificationEmail") ?? ""),
      slaDefaultHours: String(form.get("slaDefaultHours") ?? ""),
    });
  }

  return (
    <Card title="Tenant settings">
      <form className="tenant-settings-form" onSubmit={handleSubmit}>
        <Input label="Tenant Name" name="tenantName" required defaultValue={defaultValues?.tenantName} disabled={disabled} />
        <Input label="Tenant Code" name="tenantCode" required defaultValue={defaultValues?.tenantCode} disabled={disabled} />
        <Input label="Default Timezone" name="defaultTimezone" defaultValue={defaultValues?.defaultTimezone} disabled={disabled} />
        <Select label="Default Currency" name="defaultCurrency" defaultValue={defaultValues?.defaultCurrency} disabled={disabled} options={[{ label: "ZAR", value: "ZAR" }, { label: "USD", value: "USD" }, { label: "EUR", value: "EUR" }]} />
        <Input label="Primary Contact" name="primaryContact" defaultValue={defaultValues?.primaryContact} disabled={disabled} />
        <Input label="Notification Email" name="notificationEmail" type="email" defaultValue={defaultValues?.notificationEmail} disabled={disabled} />
        <Input label="SLA Defaults" name="slaDefaultHours" type="number" helperText="Default approval SLA in hours" defaultValue={defaultValues?.slaDefaultHours} disabled={disabled} />
        <Button type="submit" isLoading={isSubmitting} disabled={disabled}>Save Settings</Button>
      </form>
    </Card>
  );
}
