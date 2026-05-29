/**
 * Direct MongoDB User Creation - Bypasses Prisma
 * Run: node scripts/create-users-direct.js
 */

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "mongodb://127.0.0.1:27017/enterprise_bpm";

async function createUsers() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("🔄 Connecting to MongoDB...\n");
    await client.connect();

    const db = client.db("enterprise_bpm");
    const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

    // 1. Create Tenant
    console.log("📍 Creating tenant...");
    const tenantResult = await db.collection("Tenant").findOne({ name: "Super Admin Tenant" });
    let tenantId = tenantResult?._id;

    if (!tenantResult) {
      const newTenant = await db.collection("Tenant").insertOne({
        name: "Super Admin Tenant",
        domain: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      tenantId = newTenant.insertedId;
      console.log("  ✅ Tenant created\n");
    } else {
      console.log("  ✅ Tenant exists\n");
      tenantId = tenantResult._id;
    }

    // 2. Create Roles
    console.log("👥 Creating roles...");
    const roleNames = ["SUPER_ADMIN", "ADMIN", "MANAGER", "FINANCE", "REQUESTER", "IT_SUPPORT"];
    for (const roleName of roleNames) {
      const existing = await db.collection("Role").findOne({ name: roleName });
      if (!existing) {
        await db.collection("Role").insertOne({
          name: roleName,
          tenantId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`  ✅ ${roleName}`);
      }
    }
    console.log("");

    // 3. Create Departments
    console.log("🏢 Creating departments...");
    const depts = ["Engineering", "Finance"];
    const deptMap = {};
    for (const deptName of depts) {
      const existing = await db.collection("Department").findOne({ tenantId, name: deptName });
      if (!existing) {
        const dept = await db.collection("Department").insertOne({
          tenantId,
          name: deptName,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        deptMap[deptName] = dept.insertedId;
        console.log(`  ✅ ${deptName}`);
      } else {
        deptMap[deptName] = existing._id;
      }
    }
    console.log("");

    // 4. Create Authority Levels
    console.log("📊 Creating authority levels...");
    const authLevels = [
      { code: "LM", name: "Line Manager", rankOrder: 1, approvalLimit: 50000 },
      { code: "BUMA", name: "Business Unit Manager", rankOrder: 2, approvalLimit: 500000 },
      { code: "C5", name: "C5 Executive", rankOrder: 3, approvalLimit: 5000000 },
      { code: "CEO", name: "Chief Executive Officer", rankOrder: 4, approvalLimit: null },
    ];
    const authMap = {};
    for (const auth of authLevels) {
      const existing = await db.collection("AuthorityLevel").findOne({ tenantId, code: auth.code });
      if (!existing) {
        const level = await db.collection("AuthorityLevel").insertOne({
          tenantId,
          code: auth.code,
          name: auth.name,
          rankOrder: auth.rankOrder,
          approvalLimit: auth.approvalLimit,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        authMap[auth.code] = level.insertedId;
        console.log(`  ✅ ${auth.code} - ${auth.name}`);
      } else {
        authMap[auth.code] = existing._id;
      }
    }
    console.log("");

    // 5. Create Users
    console.log("👤 Creating users...");
    const users = [
      {
        email: "admin@example.com",
        firstName: "Super",
        lastName: "Admin",
        role: "SUPER_ADMIN",
        dept: "Engineering",
        authLevel: "C5",
      },
      {
        email: "manager@example.com",
        firstName: "Mpho",
        lastName: "Manager",
        role: "MANAGER",
        dept: "Engineering",
        authLevel: "LM",
      },
      {
        email: "finance@example.com",
        firstName: "Fiona",
        lastName: "Finance",
        role: "FINANCE",
        dept: "Finance",
        authLevel: "BUMA",
      },
      {
        email: "requester@example.com",
        firstName: "Ravi",
        lastName: "Requester",
        role: "REQUESTER",
        dept: "Engineering",
        authLevel: null,
      },
      {
        email: "tenant.admin@example.com",
        firstName: "Tenant",
        lastName: "Admin",
        role: "ADMIN",
        dept: "Engineering",
        authLevel: null,
      },
      {
        email: "it.support@example.com",
        firstName: "Itumeleng",
        lastName: "Support",
        role: "IT_SUPPORT",
        dept: "Engineering",
        authLevel: null,
      },
    ];

    for (const user of users) {
      const existing = await db.collection("User").findOne({ email: user.email });
      if (!existing) {
        await db.collection("User").insertOne({
          email: user.email,
          passwordHash,
          firstName: user.firstName,
          lastName: user.lastName,
          tenantId,
          departmentId: deptMap[user.dept],
          authorityLevelId: user.authLevel ? authMap[user.authLevel] : null,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`  ✅ ${user.email} (${user.role})`);
      } else {
        console.log(`  ✓ ${user.email} (exists)`);
      }
    }

    console.log("\n✅ All users created!\n");
    console.log("\nAssigning roles...");
    for (const user of users) {
      const userRecord = await db.collection("User").findOne({ email: user.email });
      const roleRecord = await db.collection("Role").findOne({ name: user.role });

      if (!userRecord || !roleRecord) continue;

      const existingLink = await db.collection("UserRole").findOne({
        userId: userRecord._id,
        roleId: roleRecord._id,
      });

      if (!existingLink) {
        await db.collection("UserRole").insertOne({
          userId: userRecord._id,
          roleId: roleRecord._id,
        });
      }
      console.log(`  ${user.email} -> ${user.role}`);
    }

    console.log("Login now with:");
    console.log("  Email: admin@example.com");
    console.log("  Password: ChangeMe123!\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createUsers();
