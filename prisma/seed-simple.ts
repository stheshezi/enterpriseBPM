/**
 * Simple Seed Script - No Transactions
 * Works with standalone MongoDB (not replica set)
 */

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { ROLE_NAMES } from "../config/roles";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🌱 Starting database seed...\n");

    // 1. Create/Update Tenant
    console.log("📍 Creating tenant...");
    const tenant = await prisma.tenant.findFirst({
      where: { name: "Super Admin Tenant" },
    });

    let tenantId: string;
    if (!tenant) {
      const newTenant = await prisma.tenant.create({
        data: {
          name: "Super Admin Tenant",
          domain: process.env.SUPER_ADMIN_TENANT_DOMAIN ?? "admin",
        },
      });
      tenantId = newTenant.id;
      console.log("  ✅ Tenant created");
    } else {
      tenantId = tenant.id;
      console.log("  ✅ Tenant exists");
    }

    // 2. Create/Update Roles
    console.log("👥 Creating roles...");
    for (const roleName of ROLE_NAMES) {
      const existing = await prisma.role.findFirst({
        where: { name: roleName },
      });
      if (!existing) {
        await prisma.role.create({
          data: {
            name: roleName,
            tenantId,
          },
        });
      }
    }
    console.log("  ✅ Roles ready");

    // 3. Create Departments
    console.log("🏢 Creating departments...");
    const engineering = await prisma.department.findFirst({
      where: { tenantId, name: "Engineering" },
    });
    if (!engineering) {
      await prisma.department.create({
        data: {
          tenantId,
          name: "Engineering",
        },
      });
    }

    const finance = await prisma.department.findFirst({
      where: { tenantId, name: "Finance" },
    });
    if (!finance) {
      await prisma.department.create({
        data: {
          tenantId,
          name: "Finance",
        },
      });
    }
    console.log("  ✅ Departments ready");

    // 4. Create Authority Levels
    console.log("📊 Creating authority levels...");
    const authoritySeeds = [
      { code: "LM", name: "Line Manager", rankOrder: 1, approvalLimit: 50_000 },
      { code: "BUMA", name: "Business Unit Manager", rankOrder: 2, approvalLimit: 500_000 },
      { code: "C5", name: "C5 Executive", rankOrder: 3, approvalLimit: 5_000_000 },
      { code: "CEO", name: "Chief Executive Officer", rankOrder: 4, approvalLimit: null },
    ];

    for (const level of authoritySeeds) {
      const existing = await prisma.authorityLevel.findFirst({
        where: { tenantId, code: level.code },
      });
      if (!existing) {
        await prisma.authorityLevel.create({
          data: {
            tenantId,
            ...level,
          },
        });
      }
    }
    console.log("  ✅ Authority levels ready");

    // 5. Create Admin User
    console.log("👤 Creating admin user...");
    const adminEmail = (process.env.SUPER_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "ChangeMe123!";
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const engineeringDept = await prisma.department.findFirst({
      where: { tenantId, name: "Engineering" },
    });

    const c5Level = await prisma.authorityLevel.findFirst({
      where: { tenantId, code: "C5" },
    });

    const admin = await prisma.user.findFirst({
      where: { email: adminEmail },
    });

    if (!admin) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          firstName: "Super",
          lastName: "Admin",
          tenantId,
          departmentId: engineeringDept?.id,
          authorityLevelId: c5Level?.id,
        },
      });
      console.log(`  ✅ Admin user created: ${adminEmail}`);
    } else {
      console.log(`  ✅ Admin user exists: ${adminEmail}`);
    }

    // 6. Create Demo Users
    console.log("👥 Creating demo users...");
    const demoUsers = [
      { role: "MANAGER", email: "manager@example.com", firstName: "Mpho", lastName: "Manager" },
      { role: "FINANCE", email: "finance@example.com", firstName: "Fiona", lastName: "Finance" },
      { role: "REQUESTER", email: "requester@example.com", firstName: "Ravi", lastName: "Requester" },
      { role: "ADMIN", email: "tenant.admin@example.com", firstName: "Tenant", lastName: "Admin" },
      { role: "IT_SUPPORT", email: "it.support@example.com", firstName: "Itumeleng", lastName: "Support" },
    ];

    const lmLevel = await prisma.authorityLevel.findFirst({
      where: { tenantId, code: "LM" },
    });

    const bumaLevel = await prisma.authorityLevel.findFirst({
      where: { tenantId, code: "BUMA" },
    });

    const financeDept = await prisma.department.findFirst({
      where: { tenantId, name: "Finance" },
    });

    for (const demoUser of demoUsers) {
      const existing = await prisma.user.findFirst({
        where: { email: demoUser.email },
      });

      if (!existing) {
        const authorityLevelId =
          demoUser.role === "MANAGER"
            ? lmLevel?.id
            : demoUser.role === "FINANCE"
              ? bumaLevel?.id
              : undefined;

        await prisma.user.create({
          data: {
            email: demoUser.email,
            passwordHash,
            firstName: demoUser.firstName,
            lastName: demoUser.lastName,
            tenantId,
            departmentId: demoUser.role === "FINANCE" ? financeDept?.id : engineeringDept?.id,
            authorityLevelId,
          },
        });
        console.log(`  ✅ Created: ${demoUser.email} (${demoUser.role})`);
      } else {
        console.log(`  ✓ Exists: ${demoUser.email}`);
      }
    }

    console.log("\n✅ Seed complete!\n");
    console.log("Assigning demo roles...");
    const roleAssignments = [
      { email: adminEmail, role: "SUPER_ADMIN" },
      ...demoUsers.map((user) => ({ email: user.email, role: user.role })),
    ];

    for (const assignment of roleAssignments) {
      const [user, role] = await Promise.all([
        prisma.user.findUnique({ where: { email: assignment.email } }),
        prisma.role.findUnique({ where: { name: assignment.role } }),
      ]);

      if (!user || !role) continue;

      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }
    console.log("Role assignments ready");

    console.log("Login credentials:");
    console.log(`  Email: admin@example.com`);
    console.log(`  Password: ChangeMe123!\n`);
    console.log("Other demo accounts:");
    demoUsers.forEach((u) => {
      console.log(`  - ${u.email} (${u.role})`);
    });
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
