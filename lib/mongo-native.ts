import { MongoClient } from "mongodb";

let clientPromise: Promise<MongoClient> | null = null;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  return uri;
}

export async function getMongoDb() {
  if (!clientPromise) {
    clientPromise = new MongoClient(getMongoUri()).connect();
  }

  const client = await clientPromise;
  return client.db();
}

export function nowStamp() {
  return new Date();
}
