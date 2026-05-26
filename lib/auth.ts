import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getPermissionsForRoles } from "@/config/roles";
import type { AppRole } from "@/types/auth";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
          include: {
            tenant: true,
            roles: { include: { role: true } },
          },
        });

        if (!user?.passwordHash) return null;

        const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!passwordMatches) return null;

        const roles = user.roles.map((userRole) => userRole.role.name as AppRole);

        return {
          id: user.id,
          email: user.email,
          name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
          tenantId: user.tenantId,
          tenantDomain: user.tenant.domain,
          roles,
          permissions: getPermissionsForRoles(roles),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.tenantId = user.tenantId;
        token.tenantDomain = user.tenantDomain;
        token.roles = user.roles;
        token.permissions = user.permissions;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.tenantId = token.tenantId;
        session.user.tenantDomain = token.tenantDomain;
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
      }

      return session;
    },
  },
};
