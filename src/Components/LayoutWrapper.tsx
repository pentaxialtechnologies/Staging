"use client";

import { usePathname } from "next/navigation";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

const hiddenPrefixes = [
  "/login",
  "/register",
  "/reset-password",
  "/forgot-password",
  "/company", // provider dashboard layout
  "/admin", // admin dashboard layout
];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current path starts with any hidden prefix
  const hideLayout = hiddenPrefixes.some((prefix) =>
    pathname.startsWith(prefix),
  );

  return (
    <>
      {!hideLayout && <Header />}
      <main className="flex-1 px-4 sm:px-6 md:px-8">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
