/**
 * Initialize MongoDB Replica Set
 * Run: node scripts/init-replica-set.js
 */

const { MongoClient, Admin } = require("mongodb");

async function initReplicaSet() {
  const client = new MongoClient("mongodb://127.0.0.1:27017/");

  try {
    console.log("🔄 Connecting to MongoDB...");
    await client.connect();

    const admin = client.db("admin").admin();

    console.log("🔧 Initializing replica set 'rs0'...");
    try {
      const result = await admin.command({
        replSetInitiate: {
          _id: "rs0",
          members: [
            {
              _id: 0,
              host: "127.0.0.1:27017",
            },
          ],
        },
      });
      console.log("✅ Replica set initialized:", result);
    } catch (err) {
      if (err.message.includes("already initialized")) {
        console.log("ℹ️  Replica set already initialized");
      } else {
        throw err;
      }
    }

    console.log("\n✅ MongoDB is ready for Prisma!");
    console.log("\nNext steps:");
    console.log("1. Run: npx prisma db seed");
    console.log("2. Run: npm run dev");
    console.log("3. Visit: http://localhost:3000/login");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

initReplicaSet();
