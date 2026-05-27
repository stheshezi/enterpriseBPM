import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { ROLE_NAMES } from "../config/roles";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { name: "Super Admin Tenant" },
    update: {
      domain: process.env.SUPER_ADMIN_TENANT_DOMAIN ?? "admin",
    },
    create: {
      name: "Super Admin Tenant",
      domain: process.env.SUPER_ADMIN_TENANT_DOMAIN ?? "admin",
    },
  });

  const roles = await Promise.all(
    ROLE_NAMES.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: { tenantId: tenant.id },
        create: { name, tenantId: tenant.id },
      }),
    ),
  );

  const engineering = await prisma.department.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: "Engineering" } },
    update: {},
    create: { tenantId: tenant.id, name: "Engineering" },
  });

  const financeDepartment = await prisma.department.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: "Finance" } },
    update: {},
    create: { tenantId: tenant.id, name: "Finance" },
  });

  const authoritySeeds = [
    { code: "LM", name: "Line Manager", rankOrder: 1, approvalLimit: 50_000 },
    { code: "BUMA", name: "Business Unit Manager", rankOrder: 2, approvalLimit: 500_000 },
    { code: "C5", name: "C5 Executive", rankOrder: 3, approvalLimit: 5_000_000 },
    { code: "CEO", name: "Chief Executive Officer", rankOrder: 4, approvalLimit: null },
  ];

  const authorityLevels = await Promise.all(
    authoritySeeds.map((level) =>
      prisma.authorityLevel.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: level.code } },
        update: {
          name: level.name,
          rankOrder: level.rankOrder,
          approvalLimit: level.approvalLimit,
        },
        create: {
          tenantId: tenant.id,
          code: level.code,
          name: level.name,
          rankOrder: level.rankOrder,
          approvalLimit: level.approvalLimit,
        },
      }),
    ),
  );

  const adminEmail = (process.env.SUPER_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      tenantId: tenant.id,
      firstName: "Super",
      lastName: "Admin",
      departmentId: engineering.id,
      authorityLevelId: authorityLevels.find((level) => level.code === "C5")?.id,
    },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: "Super",
      lastName: "Admin",
      tenantId: tenant.id,
      departmentId: engineering.id,
      authorityLevelId: authorityLevels.find((level) => level.code === "C5")?.id,
    },
  });

  const superAdminRole = roles.find((role) => role.name === "SUPER_ADMIN");
  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: admin.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: admin.id,
        roleId: superAdminRole.id,
      },
    });
  }

  const demoUsers = [
    { role: "ADMIN", email: "tenant.admin@example.com", firstName: "Tenant", lastName: "Admin" },
    { role: "IT_SUPPORT", email: "it.support@example.com", firstName: "Itumeleng", lastName: "Support" },
    { role: "MANAGER", email: "manager@example.com", firstName: "Mpho", lastName: "Manager" },
    { role: "FINANCE", email: "finance@example.com", firstName: "Fiona", lastName: "Finance" },
    { role: "REQUESTER", email: "requester@example.com", firstName: "Ravi", lastName: "Requester" },
  ] as const;

  const demoUserRecords: Record<string, string> = {};

  for (const demoUser of demoUsers) {
    const authorityLevelId =
      demoUser.role === "MANAGER"
        ? authorityLevels.find((level) => level.code === "LM")?.id
        : demoUser.role === "FINANCE"
          ? authorityLevels.find((level) => level.code === "BUMA")?.id
          : undefined;

    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        passwordHash,
        tenantId: tenant.id,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        departmentId: demoUser.role === "FINANCE" ? financeDepartment.id : engineering.id,
        authorityLevelId,
      },
      create: {
        email: demoUser.email,
        passwordHash,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        tenantId: tenant.id,
        departmentId: demoUser.role === "FINANCE" ? financeDepartment.id : engineering.id,
        authorityLevelId,
      },
    });

    demoUserRecords[demoUser.role] = user.id;

    const role = roles.find((candidate) => candidate.name === demoUser.role);
    if (role) {
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
  }

  if (demoUserRecords.REQUESTER && demoUserRecords.MANAGER) {
    await prisma.user.update({
      where: { id: demoUserRecords.REQUESTER },
      data: { managerId: demoUserRecords.MANAGER },
    });
  }

  if (demoUserRecords.MANAGER && demoUserRecords.FINANCE) {
    await prisma.user.update({
      where: { id: demoUserRecords.MANAGER },
      data: { managerId: demoUserRecords.FINANCE },
    });
  }

  if (demoUserRecords.FINANCE) {
    await prisma.user.update({
      where: { id: demoUserRecords.FINANCE },
      data: { managerId: admin.id },
    });
  }

  console.log(`Seeded tenant ${tenant.name} and admin ${admin.email}`);

  // -------------------------------------------------------
  // Create a demo request so the UI has something to show
  // -------------------------------------------------------
  await prisma.request.upsert({
    where: { requestNumber: "TR-001" },
    update: {
      requesterId: admin.id,
      tenantId: tenant.id,
      departmentId: engineering.id,
      payload: {
        destination: "New York",
        travelType: "Business",
        purpose: "Demo conference attendance",
        estimatedCost: 1200,
        costCenter: "CC100",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      status: "DRAFT",
    },
    create: {
      requestNumber: "TR-001",
      requesterId: admin.id,
      tenantId: tenant.id,
      departmentId: engineering.id,
      payload: {
        destination: "New York",
        travelType: "Business",
        purpose: "Demo conference attendance",
        estimatedCost: 1200,
        costCenter: "CC100",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      status: "DRAFT",
    },
  });

  console.log('✅ Demo Request TR-001 created');

  console.log(`Login with email: ${admin.email} and password: ${process.env.SUPER_ADMIN_PASSWORD ?? "ChangeMe123!"}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
