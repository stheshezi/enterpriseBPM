import type { AuditAction } from "@prisma/client";
import { auditRecorder } from "@/modules/audit/audit-recorder";

export class ComplianceLogger {
  async log(input: {
    tenantId: string;
    actorUserId?: string | null;
    entityType: string;
    entityId?: string | null;
    action: AuditAction;
    oldValue?: unknown;
    newValue?: unknown;
    previousState?: string | null;
    nextState?: string | null;
    authorityOwnerUserId?: string | null;
    delegated?: boolean;
  }) {
    return auditRecorder.record(input);
  }
}

export const complianceLogger = new ComplianceLogger();
