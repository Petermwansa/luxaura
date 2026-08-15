import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("DATABASE_URL is not defined");
}

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();

    console.log("MongoDB connection successful!");

    await client.db("admin").command({
      ping: 1,
    });

    console.log("MongoDB ping successful!");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);
  } finally {
    await client.close();
  }
}

main();