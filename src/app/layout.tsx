import SessionWrapper from "@/Components/SessionWraper";
import "./globals.css";
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';


import type { Metadata } from "next";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export const metadata: Metadata = {
  title: "Staffing-website",
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
