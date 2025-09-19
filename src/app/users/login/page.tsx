

'use client';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };


const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const response = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
      callbackUrl: '/',
    });

    console.log('Login response:', response);
    console.log('Login email:', form.email);
    console.log('Login password:', form.password);


    if (response?.error) {
      if (response.error.includes('verify')) {
    alert("Please verify your email before logging in.");
  }

      setError(response.error);
      
    }
    else if (response?.ok) {
      const session = await getSession(); 
      const role = session?.user?.role;
     const hasCompletedPlanSelection = session?.user?.hasCompletedPlanSelection;
     console.log(hasCompletedPlanSelection,'plan section');
     
      console.log('role',role);

      switch (role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'provider':
          if (!hasCompletedPlanSelection) {
        router.push('/providers/plans');
      } 
      else{
          router.push('/provider/dashboard');
      }
          break;
        case 'employer':
          router.push('/employer/dashboard');
          break;
        default:
          router.push('/users/login');
      }
    } else {
      setError('Login failed. Please try again.');
    }
  }// eslint-disable-next-line @typescript-eslint/no-explicit-any 
  catch (err: any) {
    console.error('Login error:', err);
    setError('An unexpected error occurred.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
          Welcome Back
        </h2>
 {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email address"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              autoComplete="current-password"
            />
          </div>

         

    <p className='text-sm text-end text-blue-500'><a href='/users/forgot-password'>Forgot password ?</a></p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don’t have an account?{' '}
            <button
              onClick={() => router.push('/users/signup')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
