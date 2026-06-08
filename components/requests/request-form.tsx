"use client";

import { FormEvent, ReactNode } from "react";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";

export interface RequestFormValues {
  department: string;
  requestType: string;
  // Optional fields that may apply to specific request types
  destination?: string;
  travelType?: string;
  startDate?: string;
  endDate?: string;
  purpose: string;
  estimatedCost?: string;
  costCenter: string;
}

export interface RequestFormProps {
  defaultValues?: Partial<RequestFormValues>;
  errors?: Partial<Record<keyof RequestFormValues, string>>;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
  disabled?: boolean;
  fileUpload?: ReactNode;
  onSubmit: (values: RequestFormValues) => void;
  onSaveDraft?: (values: RequestFormValues) => void;
}

function readValues(form: HTMLFormElement): RequestFormValues {
  const data = new FormData(form);
  return {
    department: String(data.get("department") ?? ""),
    requestType: String(data.get("requestType") ?? ""),
    destination: String(data.get("destination") ?? ""),
    travelType: String(data.get("travelType") ?? ""),
    startDate: String(data.get("startDate") ?? ""),
    endDate: String(data.get("endDate") ?? ""),
    purpose: String(data.get("purpose") ?? ""),
    estimatedCost: String(data.get("estimatedCost") ?? ""),
    costCenter: String(data.get("costCenter") ?? ""),
  };
}

export function RequestForm({ defaultValues, errors = {}, isSubmitting, isSavingDraft, disabled, fileUpload, onSubmit, onSaveDraft }: RequestFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(readValues(event.currentTarget));
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <Card title="Requester Information" className="span-2">
        <Input label="Department" name="department" required defaultValue={defaultValues?.department} error={errors.department} disabled={disabled} />
        <Input label="Cost Center" name="costCenter" required defaultValue={defaultValues?.costCenter} error={errors.costCenter} disabled={disabled} />
      </Card>
      <Card title="Request Details" className="span-2">
        <Select
          label="Request Type"
          name="requestType"
          required
          defaultValue={defaultValues?.requestType}
          error={errors.requestType}
          disabled={disabled}
          options={[
            { label: "Travel", value: "Travel" },
            { label: "Budget Reallocation", value: "BudgetReallocation" },
            { label: "Procurement", value: "Procurement" },
            { label: "Asset Request", value: "AssetRequest" },
            { label: "HR Request", value: "HRRequest" },
          ]}
        />
        {/* Destination is only relevant for Travel requests – keep optional */}
        <Input label="Destination" name="destination" defaultValue={defaultValues?.destination} error={errors.destination} disabled={disabled} />
        <Select
          label="Travel Type"
          name="travelType"
          defaultValue={defaultValues?.travelType}
          error={errors.travelType}
          disabled={disabled}
          options={[{ label: "Domestic", value: "Domestic" }, { label: "International", value: "International" }, { label: "Client visit", value: "Client visit" }, { label: "Conference", value: "Conference" }]}
        />
        <Input label="Start Date" name="startDate" type="date" defaultValue={defaultValues?.startDate} error={errors.startDate} disabled={disabled} />
        <Input label="End Date" name="endDate" type="date" defaultValue={defaultValues?.endDate} error={errors.endDate} disabled={disabled} />
        <Textarea label="Purpose" name="purpose" required defaultValue={defaultValues?.purpose} error={errors.purpose} disabled={disabled} maxLength={1000} />
      </Card>
      <Card title="Financial Details" className="span-2">
        <Input label="Estimated Cost" name="estimatedCost" type="number" defaultValue={defaultValues?.estimatedCost} error={errors.estimatedCost} disabled={disabled} />
      </Card>
      {fileUpload ? <Card title="Supporting Documents" className="span-2">{fileUpload}</Card> : null}
      <div className="form-actions span-2">
        {onSaveDraft ? <Button variant="outline" isLoading={isSavingDraft} disabled={disabled} onClick={(event) => onSaveDraft(readValues(event.currentTarget.form!))}>Save Draft</Button> : null}
        <Button type="submit" isLoading={isSubmitting} disabled={disabled}>Submit</Button>
      </div>
    </form>
  );
}
