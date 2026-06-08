"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type RequestTypeOption = {
  id?: string;
  code: string;
  name: string;
  description: string;
};

type ApiState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; requestNumber: string; requestId: string }
  | { status: "error"; message: string };

export interface RequestTypeFormProps {
  requestTypes: RequestTypeOption[];
}

function fieldValue(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

export function RequestTypeForm({ requestTypes }: RequestTypeFormProps) {
  const router = useRouter();
  const [selectedCode, setSelectedCode] = useState("");
  const [apiState, setApiState] = useState<ApiState>({ status: "idle" });

  const selectedType = useMemo(
    () => requestTypes.find((requestType) => requestType.code === selectedCode),
    [requestTypes, selectedCode],
  );
  const isTravel = selectedCode === "travel";
  const isLeave = selectedCode === "leave";
  const isPurchase = selectedCode === "purchase";
  const isAsset = selectedCode === "asset";
  const isTraining = selectedCode === "training";
  const isAccess = selectedCode === "access";
  const hasSelectedType = Boolean(selectedType);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiState({ status: "submitting" });

    const form = new FormData(event.currentTarget);
    const payload = {
      requestType: selectedCode,
      requestTypeName: selectedType?.name ?? "Request",
      department: fieldValue(form, "department"),
      costCenter: fieldValue(form, "costCenter"),
      purpose: fieldValue(form, "purpose"),
      estimatedCost: fieldValue(form, "estimatedCost"),
      priority: fieldValue(form, "priority"),
      requestedByDate: fieldValue(form, "requestedByDate"),
      destination: isTravel ? fieldValue(form, "destination") : undefined,
      travelType: isTravel ? fieldValue(form, "travelType") : undefined,
      startDate: isTravel ? fieldValue(form, "startDate") : undefined,
      endDate: isTravel ? fieldValue(form, "endDate") : undefined,
      accommodationRequired: isTravel ? fieldValue(form, "accommodationRequired") : undefined,
      leaveType: isLeave ? fieldValue(form, "leaveType") : undefined,
      leaveStartDate: isLeave ? fieldValue(form, "leaveStartDate") : undefined,
      leaveEndDate: isLeave ? fieldValue(form, "leaveEndDate") : undefined,
      leaveReason: isLeave ? fieldValue(form, "leaveReason") : undefined,
      itemDescription: isPurchase || isAsset ? fieldValue(form, "itemDescription") : undefined,
      quantity: isPurchase || isAsset ? fieldValue(form, "quantity") : undefined,
      vendor: isPurchase ? fieldValue(form, "vendor") : undefined,
      businessJustification: isPurchase ? fieldValue(form, "businessJustification") : undefined,
      trainingProvider: isTraining ? fieldValue(form, "trainingProvider") : undefined,
      trainingDate: isTraining ? fieldValue(form, "trainingDate") : undefined,
      accessSystem: isAccess ? fieldValue(form, "accessSystem") : undefined,
      accessLevel: isAccess ? fieldValue(form, "accessLevel") : undefined,
    };

    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestTypeId: selectedType?.id,
        payload,
      }),
    });

    const responsePayload = await response.json();

    if (!response.ok) {
      setApiState({ status: "error", message: responsePayload.error ?? "Unable to submit request." });
      return;
    }

    const request = responsePayload.request;
    setApiState({
      status: "success",
      requestNumber: request.requestNumber,
      requestId: request.id,
    });
    router.refresh();
    router.push(`/requests/${request.id}`);
  }

  return (
    <form className="request-form" onSubmit={onSubmit}>
      <label className="span-2">
        Request type
        <select name="requestType" required value={selectedCode} onChange={(event) => setSelectedCode(event.target.value)}>
          <option value="">Select a request type</option>
          {requestTypes.map((requestType) => (
            <option key={requestType.code} value={requestType.code}>
              {requestType.name}
            </option>
          ))}
        </select>
        <small>{selectedType?.description ?? "Choose a request type to load the relevant form."}</small>
      </label>

      {hasSelectedType ? (
        <>
      <label>
        Department
        <input name="department" required placeholder="Operations" />
      </label>
      {!isLeave && !isAccess ? (
        <label>
          Cost center
          <input name="costCenter" required placeholder="CC-1001" />
        </label>
      ) : null}

      {isTravel ? (
        <>
          <label>
            Destination
            <input name="destination" required placeholder="Cape Town" />
          </label>
          <label>
            Travel type
            <select name="travelType" required defaultValue="Domestic">
              <option>Domestic</option>
              <option>International</option>
              <option>Client visit</option>
              <option>Conference</option>
            </select>
          </label>
          <label>
            Start date
            <input name="startDate" type="date" required />
          </label>
          <label>
            End date
            <input name="endDate" type="date" required />
          </label>
          <label className="span-2">
            Accommodation requirements
            <textarea name="accommodationRequired" rows={3} placeholder="Hotel, meals, transfers, or none" />
          </label>
        </>
      ) : null}

      {isLeave ? (
        <>
          <label>
            Leave type
            <select name="leaveType" required defaultValue="Annual">
              <option>Annual</option>
              <option>Sick</option>
              <option>Family responsibility</option>
              <option>Unpaid</option>
              <option>Study</option>
            </select>
          </label>
          <label>
            Start date
            <input name="leaveStartDate" type="date" required />
          </label>
          <label>
            End date
            <input name="leaveEndDate" type="date" required />
          </label>
          <label className="span-2">
            Reason
            <textarea name="leaveReason" required minLength={5} rows={4} />
          </label>
        </>
      ) : null}

      {isPurchase ? (
        <>
          <label>
            Item description
            <input name="itemDescription" required placeholder="Laptop, software license, consulting service" />
          </label>
          <label>
            Quantity
            <input name="quantity" type="number" min="1" step="1" required />
          </label>
          <label>
            Vendor
            <input name="vendor" required placeholder="Preferred supplier" />
          </label>
          <label className="span-2">
            Business justification
            <textarea name="businessJustification" required minLength={10} rows={4} />
          </label>
        </>
      ) : null}

      {isAsset ? (
        <>
          <label>
            Asset description
            <input name="itemDescription" required placeholder="Monitor, laptop, mobile device" />
          </label>
          <label>
            Quantity
            <input name="quantity" type="number" min="1" step="1" required />
          </label>
        </>
      ) : null}

      {isTraining ? (
        <>
          <label>
            Training provider
            <input name="trainingProvider" required placeholder="Provider or institution" />
          </label>
          <label>
            Training date
            <input name="trainingDate" type="date" required />
          </label>
        </>
      ) : null}

      {isAccess ? (
        <>
          <label>
            System or area
            <input name="accessSystem" required placeholder="ERP, CRM, building access" />
          </label>
          <label>
            Access level
            <input name="accessLevel" required placeholder="Read only, approver, admin" />
          </label>
        </>
      ) : null}

      {!isTravel && !isLeave && !isPurchase ? (
        <>
          <label>
            Priority
            <select name="priority" required defaultValue="Normal">
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </label>
          <label>
            Needed by
            <input name="requestedByDate" type="date" />
          </label>
        </>
      ) : null}

      {!isLeave && !isAccess ? (
        <label>
          Estimated cost
          <input name="estimatedCost" type="number" min="0" step="0.01" required />
        </label>
      ) : null}

      {!isLeave && !isPurchase ? (
        <label className="span-2">
          Purpose / business justification
          <textarea name="purpose" required minLength={10} rows={5} />
        </label>
      ) : null}

      {apiState.status === "error" ? <p className="error span-2">{apiState.message}</p> : null}
      {apiState.status === "success" ? (
        <p className="success span-2">Submitted {apiState.requestNumber}. Opening the request now.</p>
      ) : null}

      <button className="span-2" disabled={apiState.status === "submitting"} type="submit">
        {apiState.status === "submitting" ? "Submitting..." : "Submit request"}
      </button>
        </>
      ) : (
        <div className="component-state span-2">Select a request type to continue.</div>
      )}
    </form>
  );
}
