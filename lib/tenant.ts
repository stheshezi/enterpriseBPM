import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export type TenantContext = {
  tenantId: string;
  tenantDomain: string | null;
};

export function getTenantDomainFromHost(host: string | null) {
  if (!host) return null;

  const hostname = host.split(":")[0];
  const parts = hostname.split(".");

  if (hostname === "localhost" || hostname === "127.0.0.1" || parts.length < 3) {
    return null;
  }

  return parts[0] || null;
}

export async function getTenantContextFromHeaders(): Promise<TenantContext> {
  const headerBag = headers();
  const tenantId = headerBag.get("x-tenant-id");
  const tenantDomain = headerBag.get("x-tenant-domain");

  if (tenantId) {
    return { tenantId, tenantDomain };
  }

  if (tenantDomain) {
    const tenant = await prisma.tenant.findFirst({ where: { domain: tenantDomain } });
    if (tenant) return { tenantId: tenant.id, tenantDomain: tenant.domain };
  }

  const fallback = await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" } });
  if (!fallback) {
    throw new Error("No tenant is configured. Run prisma db seed first.");
  }

  return { tenantId: fallback.id, tenantDomain: fallback.domain };
}
