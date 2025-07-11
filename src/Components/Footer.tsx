"use client";
import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const footerLinks = [
    {
      title: "Service Provider",
      links: [
        { label: "Find Jobs", href: "/jobs" },
        { label: "Why Get Listed?", href: "/why-get-listed" },
        { label: "Get Listed", href: "/get-listed" },
        { label: "Growth Hub", href: "/growth-hub" },
        { label: "Sponsorship", href: "/sponsorship" },
        { label: "Service FAQs", href: "/service-faqs" },
        { label: "Browse All Services", href: "/services" },
      ],
    },
    {
      title: "Buyers Section",
      links: [
        { label: "Find Firms", href: "/firms" },
        { label: "Review Service Providers", href: "/reviews" },
        { label: "Buyer FAQs", href: "/buyer-faqs" },
        { label: "Pricing FAQs", href: "/pricing-faqs" },
        { label: "ITGC Controls", href: "/itgc" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
        { label: "Blog", href: "/blog" },
        { label: "Leave a Review", href: "/leave-review" },
        { label: "Help & Support", href: "/support" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Enterprise", href: "/enterprise" },
        { label: "GCC", href: "/gcc" },
        { label: "EOR", href: "/eor" },
      ],
    },
    {
      title: "Terms & Privacy",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Sections */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-400">
              Get the latest updates, articles, and more.
            </p>
          </div>
          <form className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md bg-white text-black w-full md:w-64"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social + Copyright */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6">
          <div className="text-sm text-gray-400 text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} S3 Technologies. All rights
            reserved.
          </div>
          <div className="flex gap-4 text-gray-400">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <FaLinkedinIn />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
