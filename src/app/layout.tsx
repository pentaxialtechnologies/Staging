import SessionWrapper from "@/Components/SessionWraper";
import "./globals.css";



import type { Metadata } from "next";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export const metadata: Metadata = {
  title: "TrueFirms - World's #1 B2B Staff Augmentation Marketplace",
  description: "Hire or get hired by trusted firms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        <SessionWrapper>
          <Header />
          <main className="flex-1 px-4 sm:px-6 md:px-8">{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
