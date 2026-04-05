import dotenv from "dotenv";
import { randomBytes } from "node:crypto";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

dotenv.config();

const databaseName = "abe-garage";
const mongoConnectionString =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";

const mongoClient = new MongoClient(mongoConnectionString, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 15000,
  family: 4,
  maxPoolSize: 20,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
});

const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "dev-better-auth-secret-dev-better-auth-secret",
  database: mongodbAdapter(mongoClient.db(databaseName), {
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
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
  ],
});

const defaultName = process.env.ADMIN_NAME || "First Admin";
const defaultEmail = process.env.ADMIN_EMAIL || "admin@abe.local";
const password =
  process.env.ADMIN_PASSWORD || randomBytes(12).toString("base64url");

async function main() {
  await mongoClient.connect();

  const usersCollection = mongoClient.db(databaseName).collection("user");

  const existingAdmin = await usersCollection.findOne({ role: "admin" });

  if (existingAdmin) {
    console.log(
      JSON.stringify(
        {
          created: false,
          message: "An admin account already exists.",
          email: existingAdmin.email,
        },
        null,
        2,
      ),
    );
    return;
  }

  const existingUserWithDefaultEmail = await usersCollection.findOne({
    email: defaultEmail,
  });

  if (existingUserWithDefaultEmail) {
    await usersCollection.updateOne(
      { _id: existingUserWithDefaultEmail._id },
      { $set: { role: "admin", updatedAt: new Date() } },
    );

    const promotedUser = await usersCollection.findOne({
      _id: existingUserWithDefaultEmail._id,
    });

    console.log(
      JSON.stringify(
        {
          created: false,
          promoted: true,
          message: "Existing user was promoted to admin.",
          email: promotedUser?.email,
          role: promotedUser?.role,
        },
        null,
        2,
      ),
    );
    return;
  }

  let email = defaultEmail;
  let suffix = 1;
  while (await usersCollection.findOne({ email })) {
    const [localPart, domainPart] = defaultEmail.split("@");
    email = `${localPart}+${suffix}@${domainPart || "abe.local"}`;
    suffix += 1;
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: defaultName,
      email,
      password,
      role: "admin",
    },
  });

  await usersCollection.updateOne(
    { id: result.user.id },
    { $set: { role: "admin", updatedAt: new Date() } },
  );

  const adminUser = await usersCollection.findOne({ id: result.user.id });

  console.log(
    JSON.stringify(
      {
        created: true,
        email,
        password,
        role: adminUser?.role || "admin",
        user: {
          ...result.user,
          role: adminUser?.role || "admin",
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoClient.close();
  });
