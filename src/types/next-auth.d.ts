// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";
declare module "react-draft-wysiwyg";
declare module "next-auth" {
  interface Session {
    user: {
      hasCompletedPlanSelection: boolean;
      id: string;
      name?: string | null;
      email?: string | null;
      firstname?: string | null;
      role?: "employer" | "provider" | "admin";
      emailVerified: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    firstname: string;
    email: string;
    role: "employer" | "provider" | "admin";
    emailVerified: boolean;
    hasCompletedPlanSelection: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "provider" | "employer";
    emailVerified?: boolean;
    hasCompletedPlanSelection?: boolean;
  }
}
