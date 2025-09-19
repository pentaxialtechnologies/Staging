import {NextAuthOptions} from 'next-auth';
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

        // if (!user) {
        // user = await Provider.findOne({ email: credentials.email }).select('+password') as IUser;

        //   if (user) role = 'provider';
        
          
        // }
           if (!user) {
            try {
              // Try different ways to get password field
              user = await Provider.findOne({ email: credentials.email }).select('+password') as IUser;
              
              // If select('+password') doesn't work, try without select
              if (!user || !user.password) {
                user = await Provider.findOne({ email: credentials.email }) as IUser;
              }

              // If still no password, try with explicit field inclusion
              if (!user || !user.password) {
                user = await Provider.findOne(
                  { email: credentials.email },
                  { 
                    _id: 1, 
                    email: 1, 
                    password: 1, 
                    firstname: 1, 
                    lastname: 1, 
                    name: 1,
                    emailVerified: 1,
                    hasCompletedPlanSelection: 1 
                  }
                ) as IUser;
              }

              if (user) {
                role = 'provider';
                console.log('✅ Found provider:', user.email, 'Has password:', !!user.password);
              }
            } catch (error) {
              console.error('❌ Error searching Providers:', error);
            }
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