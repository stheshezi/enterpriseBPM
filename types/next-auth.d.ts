import "next-auth";
import "next-auth/jwt";
import type { AppPermission, AppRole } from "@/types/auth";

declare module "next-auth" {
  interface User {
    tenantId: string;
    tenantDomain?: string | null;
    roles: AppRole[];
    permissions: AppPermission[];
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      tenantId: string;
      tenantDomain?: string | null;
      roles: AppRole[];
      permissions: AppPermission[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    tenantId: string;
    tenantDomain?: string | null;
    roles: AppRole[];
    permissions: AppPermission[];
  }
}
