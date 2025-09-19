import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/Mongodb';
import { Employers } from '@/models/Employer/Employer';
import { Provider } from '@/models/Provider/Organization';
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
  hasCompletedPlanSelection: boolean;
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
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        let user: IUser | null = null;
        let role: IUser['role'] | null = null;

        // Look up user in all collections
        user = (await Employers.findOne({ email: credentials.email })) as IUser;
        role = user ? 'employer' : null;

        if (!user) {
        user = await Provider.findOne({ email: credentials.email }).select('+password') as IUser;

          if (user) role = 'provider';
        
          
        }

        if (!user) {
          user = (await Admin.findOne({ email: credentials.email })) as IUser;
          if (user) role = 'admin';
        }

        if (!user || !role) {
          throw new Error('The provided credentials do not match our records.');
        }
        if (!user.password) {
          throw new Error(`User ${user.email} has no stored password hash.`);
        }
        if (!user.emailVerified && role === 'provider') {
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
          image: null,
        };
      },
    }),
  ],
  pages: {
    signIn: '/users/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
    options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true },
  },
},
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