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
    },
    create: {
      email: adminEmail,
      passwordHash,
      firstName: "Super",
      lastName: "Admin",
      tenantId: tenant.id,
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
    { role: "MANAGER", email: "manager@example.com", firstName: "Mpho", lastName: "Manager" },
    { role: "FINANCE", email: "finance@example.com", firstName: "Fiona", lastName: "Finance" },
    { role: "REQUESTER", email: "requester@example.com", firstName: "Ravi", lastName: "Requester" },
  ] as const;

  for (const demoUser of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        passwordHash,
        tenantId: tenant.id,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
      },
      create: {
        email: demoUser.email,
        passwordHash,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        tenantId: tenant.id,
      },
    });

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

  console.log(`Seeded tenant ${tenant.name} and admin ${admin.email}`);

  // -------------------------------------------------------
  // Create a demo travel request so the UI has something to show
  // -------------------------------------------------------
  await prisma.travelRequest.create({
    data: {
      requestNumber: 'TR-001',
      requesterId: admin.id,
      tenantId: tenant.id,
      department: 'Engineering',
      destination: 'New York',
      travelType: 'Business',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
      purpose: 'Demo conference attendance',
      estimatedCost: 1200,
      costCenter: 'CC100',
      status: 'DRAFT',
    },
  });

  console.log('✅ Demo TravelRequest TR-001 created');

  console.log(`Login with email: ${admin.email} and password: ${process.env.SUPER_ADMIN_PASSWORD ?? 'ChangeMe123!'}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
