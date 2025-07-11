import SwitchToggle from "@/Components/Home/Toggle";
import React from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <div className="w-full mt-4 mb-6">
        <SwitchToggle />
      </div>
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
