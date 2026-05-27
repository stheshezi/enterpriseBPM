import { z } from "zod";
import { workflowEngine } from "@/modules/workflow/workflow-engine";

export const travelRequestSchema = z
  .object({
    department: z.string().min(2),
    destination: z.string().min(2),
    travelType: z.string().min(2),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    purpose: z.string().min(10),
    estimatedCost: z.coerce.number().nonnegative(),
    costCenter: z.string().min(2),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });

export type CreateTravelRequestInput = z.infer<typeof travelRequestSchema>;

export async function createSubmittedTravelRequest({
  input,
  requesterId,
  tenantId,
}: {
  input: CreateTravelRequestInput;
  requesterId: string;
  tenantId: string;
}) {
  return workflowEngine.submitRequest({ input, requesterId, tenantId });
}
