import { z } from "zod";
import { workflowEngine } from "@/modules/workflow/workflow-engine";

// Generic request schema - request-specific data goes in payload
export const createRequestSchema = z.object({
  requestTypeId: z.string().optional(),
  departmentId: z.string().optional(),
  payload: z.record(z.any()),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const genericRequestPayloadSchema = z.object({
  requestType: z.string().min(2),
  requestTypeName: z.string().min(2).optional(),
  department: z.string().min(2),
  purpose: z.string().min(10),
  estimatedCost: z.coerce.number().nonnegative().optional(),
  costCenter: z.string().min(2).optional(),
  priority: z.string().min(2).optional(),
  requestedByDate: z.string().optional(),
});

export type GenericRequestPayload = z.infer<typeof genericRequestPayloadSchema>;

// Travel request specific schema (maps to payload)
export const travelRequestPayloadSchema = z
  .object({
    requestType: z.literal("travel"),
    department: z.string().min(2),
    destination: z.string().min(2),
    travelType: z.string().min(2),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    purpose: z.string().min(10),
    estimatedCost: z.coerce.number().nonnegative(),
    costCenter: z.string().min(2),
    accommodationRequired: z.string().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });

export type TravelRequestPayload = z.infer<typeof travelRequestPayloadSchema>;

export const leaveRequestPayloadSchema = z
  .object({
    requestType: z.literal("leave"),
    requestTypeName: z.string().min(2).optional(),
    department: z.string().min(2),
    leaveType: z.string().min(2),
    leaveStartDate: z.coerce.date(),
    leaveEndDate: z.coerce.date(),
    leaveReason: z.string().min(5),
  })
  .refine((data) => data.leaveEndDate >= data.leaveStartDate, {
    message: "End date must be on or after the start date.",
    path: ["leaveEndDate"],
  });

export const purchaseRequestPayloadSchema = z.object({
  requestType: z.literal("purchase"),
  requestTypeName: z.string().min(2).optional(),
  department: z.string().min(2),
  costCenter: z.string().min(2),
  itemDescription: z.string().min(2),
  quantity: z.coerce.number().int().positive(),
  vendor: z.string().min(2),
  estimatedCost: z.coerce.number().nonnegative(),
  businessJustification: z.string().min(10),
});

/**
 * Create and submit a generic request
 */
export async function createSubmittedRequest({
  input,
  requesterId,
  tenantId,
}: {
  input: CreateRequestInput;
  requesterId: string;
  tenantId: string;
}) {
  return workflowEngine.submitRequest({ input, requesterId, tenantId });
}

/**
 * Get request by ID with full details
 */
export async function getRequest(requestId: string) {
  return workflowEngine.getRequest(requestId);
}

/**
 * Get requests for a user
 */
export async function getUserRequests(userId: string, tenantId: string) {
  return workflowEngine.getUserRequests(userId, tenantId);
}

/**
 * Update request status
 */
export async function updateRequestStatus(
  requestId: string,
  status: string,
  tenantId: string
) {
  return workflowEngine.updateRequestStatus(requestId, status, tenantId);
}
