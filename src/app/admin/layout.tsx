"use client";

import { AdminHeader } from "@/Components/AdminHeader";
import { Sidebar } from "@/Components/SideBar";
import React, { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <AdminHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed z-40 inset-y-0 left-0 transform bg-white border-r w-64 
            transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0 lg:block
          `}
        >
          <Sidebar />
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
