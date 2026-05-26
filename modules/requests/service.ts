import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
  const requestNumber = `TR-${Date.now()}`;

  return prisma.travelRequest.create({
    data: {
      ...input,
      requestNumber,
      requesterId,
      tenantId,
      status: "SUBMITTED",
      currentStep: "MANAGER_APPROVAL",
      auditLogs: {
        create: {
          tenantId,
          actorUserId: requesterId,
          entityType: "TravelRequest",
          action: "REQUEST_SUBMITTED",
          newValue: JSON.stringify({ requestNumber }),
        },
      },
      tasks: {
        create: {
          tenantId,
          stepName: "MANAGER_APPROVAL",
        },
      },
    },
    include: { tasks: true },
  });
}
