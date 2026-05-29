import React from "react";
import { requirePermission } from "../../lib/requirePermission";
import StateWrapper from "../../components/StateWrapper";
import { PERMISSIONS } from "@/config/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  // Permission check
  await requirePermission([PERMISSIONS.REQUESTS_VIEW_OWN, PERMISSIONS.REQUESTS_VIEW_TENANT]);

  // Placeholder: fetch list of requests (could be replaced with actual data fetching)
  const requests = await prisma.request.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  const loading = false;
  const error = null;
  const empty = requests.length === 0;

  return (
    <StateWrapper loading={loading} error={error} empty={empty}>
      <h1 className="text-3xl font-bold mb-4">Requests</h1>
      <ul className="space-y-2">
        {requests.map((req) => (
          <li key={req.id} className="p-2 border rounded hover:bg-gray-50">
            <a href={`/requests/${req.id}`} className="font-medium text-blue-600">
              {req.requestNumber} – {req.status}
            </a>
          </li>
        ))}
      </ul>
    </StateWrapper>
  );
}
