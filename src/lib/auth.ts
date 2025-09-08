import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/client";

const secret = process.env.BETTER_AUTH_SECRET || "dev-secret-change-me";

export const auth = betterAuth({
  secret,
  database: drizzleAdapter(db),
  emailAndPassword: {
    enabled: true
  },
  plugins: []
});

export type Session = Awaited<ReturnType<typeof auth.getSession>>;
