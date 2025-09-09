'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {  Menu, X } from 'lucide-react';

type ApiSubCategory = {
  _id: string;
  name: string;
  href?: string;
};

type ApiCategory = {
  _id: string;
  name: string;
  subcategory: ApiSubCategory[];
};

const CompanyHeader = () => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openEnterprise, setOpenEnterprise] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const res = await fetch('/api/auth/categories/get');
        const data = await res.json();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dynamicCategory: ApiCategory[] = data.category.map((cat: any) => ({
          _id: cat._id,
          name: cat.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          subcategory: cat.subcategory.map((sub: any) => ({
            _id: sub._id,
            name: sub.name,
            href: `/category/${cat._id}/subcategory/${sub._id}`,
          })),
        }));

        setCategories(dynamicCategory);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchDatas();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setActiveCategoryId(null);
        setOpenEnterprise(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <header className="w-full bg-white dark:bg-gray-900 shadow- z-50 flex justify-between items-center">
      <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left - Mobile Menu Icon */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
          {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-white" />}
        </button>

        {/* Middle - Nav Links */}
        <nav className="hidden md:flex items-center space-x-6" ref={dropdownRef}>
          {/* Service Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-700 dark:text-white hover:text-blue-600"
            >
              Service Categories ▾
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 border shadow-lg rounded-md z-50"
                >
                  {categories.map((category) => (
                    <div key={category._id} className="relative">
                      <div
                        onClick={() =>setActiveCategoryId(activeCategoryId === category._id ? null : category._id)}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                      >
                        {category.name}
                        <span>▸</span>
                      </div>

                      {/* Subcategory Dropdown */}
                      <AnimatePresence>
                        {activeCategoryId === category._id && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute left-full top-0 w-64 bg-white dark:bg-gray-800 border shadow-lg rounded-md"
                          >
                            {category.subcategory.map((sub) => (
                              <Link
                                key={sub._id}
                                href={sub.href!}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Standard Links */}
          <Link href="/find" className="text-gray-700 dark:text-white hover:text-blue-600">Find Firms</Link>
          <Link href="/jobs" className="text-gray-700 dark:text-white hover:text-blue-600">Find Jobs </Link>
          <Link href="/pricing" className="text-gray-700 dark:text-white hover:text-blue-600"> Pricing & Plans</Link>

          {/* Enterprises Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenEnterprise(!openEnterprise)}
              className="text-gray-700 dark:text-white hover:text-blue-600"
            >
              Enterprises ▾
            </button>

            <AnimatePresence>
              {openEnterprise && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 border shadow-lg rounded-md z-50"
                >
                  <Link
                    href="/enterprise/employer-record"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setOpenEnterprise(false)}
                  >
                    Employer of the Records
                  </Link>
                  <Link
                    href="/enterprise/gcc-services"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setOpenEnterprise(false)}
                  >
                    GCC Services
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-6 pb-4 space-y-2">
          <Link href="/find" className="block text-gray-700 dark:text-white">Find Firms</Link>
          <Link href="/jobs" className="block text-gray-700 dark:text-white">Find Jobs</Link>
          <Link href="/pricing" className="block text-gray-700 dark:text-white"> Pricing & Plans</Link>
          <Link href="/enterprise/employer-record" className="block text-gray-700 dark:text-white">Employer of the Record</Link>
          <Link href="/enterprise/gcc-services" className="block text-gray-700 dark:text-white">GCC Services</Link>
        </div>
      )}
    </header> 
    <div className='border border-gray-300 mb-5 w-full'></div>

    </>
  );
};

export default CompanyHeader;
