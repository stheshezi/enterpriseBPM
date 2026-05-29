"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ApiState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; requestNumber: string; requestId: string }
  | { status: "error"; message: string };

export function TravelRequestForm() {
  const router = useRouter();
  const [apiState, setApiState] = useState<ApiState>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiState({ status: "submitting" });

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/travel-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });

    const payload = await response.json();

    if (!response.ok) {
      setApiState({ status: "error", message: payload.error ?? "Unable to submit request." });
      return;
    }

    const request = payload.travelRequest;
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
      <label>
        Department
        <input name="department" required placeholder="Operations" />
      </label>
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
      <label>
        Estimated cost
        <input name="estimatedCost" type="number" min="0" step="0.01" required />
      </label>
      <label>
        Cost center
        <input name="costCenter" required placeholder="CC-1001" />
      </label>
      <label className="span-2">
        Purpose
        <textarea name="purpose" required minLength={10} rows={5} />
      </label>

      {apiState.status === "error" ? <p className="error span-2">{apiState.message}</p> : null}
      {apiState.status === "success" ? (
        <p className="success span-2">Submitted {apiState.requestNumber}. Opening the request now.</p>
      ) : null}

      <button className="span-2" disabled={apiState.status === "submitting"} type="submit">
        {apiState.status === "submitting" ? "Submitting..." : "Submit request"}
      </button>
    </form>
  );
}
