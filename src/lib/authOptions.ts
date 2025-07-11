/* eslint-disable @typescript-eslint/no-explicit-any */

import  { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/Mongodb';
import { Employer } from '@/models/Employer/Employer';
import {Provider} from '@/models/Provider/Organization';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcryptjs';

interface IUser {
  emailVerified: boolean;
  _id: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
  role: 'admin' | 'employer' | 'provider';
  hasCompletedPlanSelection:boolean
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
     async authorize(credentials) {
    try {
    await dbConnect();

    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required.');
    }


    let user: IUser | null = null;
    let role: IUser['role'] | null = null;

    const employer = await Employer.findOne({ email: credentials.email });
    if (employer) {
      user = employer as unknown as IUser;
      role = 'employer';
    }

    if (!user) {
      const provider = await Provider.findOne({ email: credentials.email });
      if (provider) {
        user = provider as unknown as IUser;
        role = 'provider';
      }
    }

    if (!user) {
      const admin = await Admin.findOne({ email: credentials.email });
      if (admin) {
        user = admin as unknown as IUser;
        role = 'admin';
      }
    }

    if (!user || !role) {
      throw new Error('The Provided credentials does not match with our records.');
    }

    if (!user.emailVerified && role === 'provider') {
      // Only require verification for non-admins
      throw new Error('Please verify your email before logging in.');
    }

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

   return {
  id: user._id.toString(),
  name: user.name || `${user.firstname ?? ''} ${user.lastname ?? ''}`.trim(),
  email: user.email,
  role,
  emailVerified: user.emailVerified,
  hasCompletedPlanSelection: user.hasCompletedPlanSelection,
  firstname: user.firstname ?? '',
  image: null
};

  } 
  catch (err: any) {
    console.error('💥 Auth error:', err.message);
    throw new Error(err.message); 
  }
}

    }),
  ],
  pages: {
    signIn: '/users/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: 'fallback-secret-key',
callbacks: {
  async jwt({ token, user }) {
    if (user) {
        
      token.id = (user as any).id; 
      token.role = (user as any).role;
      token.emailVerified = (user as any).emailVerified;
      token.hasCompletedPlanSelection = (user as any).hasCompletedPlanSelection ?? false;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      (session.user as any).id = token.id;
      (session.user as any).role = token.role;
      (session.user as any).emailVerified = token.emailVerified;
      (session.user as any).hasCompletedPlanSelection = token.hasCompletedPlanSelection ?? false;
    }
    return session;
  },
}

};



 