import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const databaseName = "abe-garage";
const mongoConnectionString =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";

const mongoClient = new MongoClient(mongoConnectionString, {
  serverSelectionTimeoutMS: 12000,
  connectTimeoutMS: 12000,
  socketTimeoutMS: 15000,
  family: 4,
  maxPoolSize: 20,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
});
const mongoDatabase = mongoClient.db(databaseName);

let authMongoConnectPromise: Promise<MongoClient> | null = null;

export const ensureAuthMongoConnected = async () => {
  if (!authMongoConnectPromise) {
    authMongoConnectPromise = mongoClient.connect().catch((error) => {
      authMongoConnectPromise = null;
      throw error;
    });
  }

  return authMongoConnectPromise;
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "dev-better-auth-secret-dev-better-auth-secret",
  database: mongodbAdapter(mongoDatabase, {
    client: mongoClient,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;

void ensureAuthMongoConnected().catch(() => {
  // Lazy auth operations will retry this connect path on demand.
});
