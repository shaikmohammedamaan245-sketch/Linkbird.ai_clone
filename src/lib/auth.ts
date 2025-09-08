import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/client";

const secret = process.env.BETTER_AUTH_SECRET || "dev-secret-change-me";

const baseConfig: any = {
  secret,
  emailAndPassword: { enabled: true },
  plugins: []
};

if (process.env.DATABASE_URL) {
  baseConfig.database = drizzleAdapter(db);
}

export const auth = betterAuth(baseConfig);

export type Session = Awaited<ReturnType<typeof auth.getSession>>;
