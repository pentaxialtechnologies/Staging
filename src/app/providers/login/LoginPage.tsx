'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/provider/dashboard";

  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl
      });
      console.log("SignIn response:", res);

      if (res?.ok) {
        router.push(callbackUrl);
      } else if (res?.error) {
        alert(res.error);
      } else {
        alert('Invalid credentials!');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-semibold text-center mb-8 text-green-700">
          Provider Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div className="flex flex-col">
            <label htmlFor="Email" className="mb-2 font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className={`border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email}</p>}
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="Password" className="mb-2 font-medium text-gray-700">
              Password
            </label>
            <input
              id="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={`border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-green-600 hover:text-green-800 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 text-white font-semibold py-3 rounded-md transition ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
