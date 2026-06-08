/**
 * Fix User Roles - Link users to their roles
 */

const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb://127.0.0.1:27017/enterprise_bpm";

async function fixUserRoles() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("🔄 Connecting to MongoDB...\n");
    await client.connect();

    const db = client.db("enterprise_bpm");

    // Get all users and roles
    const users = await db.collection("User").find({}).toArray();
    const roles = await db.collection("Role").find({}).toArray();

    const userRoleMap = {
      "admin@example.com": "SUPER_ADMIN",
      "manager@example.com": "MANAGER",
      "finance@example.com": "FINANCE",
      "requester@example.com": "REQUESTER",
      "tenant.admin@example.com": "ADMIN",
      "it.support@example.com": "IT_SUPPORT",
    };

    console.log("👥 Linking users to roles...\n");

    for (const [email, roleName] of Object.entries(userRoleMap)) {
      const user = users.find((u) => u.email === email);
      const role = roles.find((r) => r.name === roleName);

      if (user && role) {
        const existing = await db.collection("UserRole").findOne({
          userId: user._id,
          roleId: role._id,
        });

        if (!existing) {
          await db.collection("UserRole").insertOne({
            userId: user._id,
            roleId: role._id,
          });
          console.log(`  ✅ Linked ${email} → ${roleName}`);
        } else {
          console.log(`  ✓ Already linked ${email}`);
        }
      }
    }

    console.log("\n✅ User roles linked!\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

fixUserRoles();
