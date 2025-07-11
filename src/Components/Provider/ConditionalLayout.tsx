// src/components/ConditionalLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/provider/dashboard/");

  return (
    <>
      {!isDashboard && <Header />}
      <main className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}
