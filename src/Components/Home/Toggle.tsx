"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { Briefcase, Search } from "lucide-react";

const SwitchToggle: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"hire" | "find">("hire");
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname.includes("/search-job")) {
      setActiveTab("find");
    } else {
      setActiveTab("hire");
    }
  }, [pathname]);

  const handleSwitch = (tab: "hire" | "find") => {
    if (tab === "hire") {
      router.push("/");
    } else {
      router.push("/search-job");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const nextTab = activeTab === "hire" ? "find" : "hire";
      handleSwitch(nextTab);
    }
  };

  return (
    <div
      className="flex justify-center my-6 px-4"
      role="tablist"
      aria-label="Switch between Hire and Find"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative flex w-full max-w-2xl border border-gray-300 bg-white rounded-full shadow-md overflow-hidden">
        {/* Animated Indicator */}
       <div
  ref={indicatorRef}
  className={clsx(
    "absolute top-0 bottom-0 w-1/2 transition-all duration-300 rounded-full bg-[#1A2B6B]",
    activeTab === "find" ? "left-1/2" : "left-0"
  )}
/>


        {/* Hire Button */}
        <button
          onClick={() => handleSwitch("hire")}
          className={clsx(
            "relative z-10 w-1/2 py-3 flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300",
            activeTab === "hire" ? "text-white" : "text-gray-700 hover:bg-gray-100"
          )}
          role="tab"
          aria-selected={activeTab === "hire"}
        >
          <Briefcase className="w-5 h-5" />
          Hire Talent
        </button>

        {/* Find Button */}
        <button
          onClick={() => handleSwitch("find")}
          className={clsx(
            "relative z-10 w-1/2 py-3 flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300",
            activeTab === "find" ? "text-white" : "text-gray-700 hover:bg-gray-100"
          )}
          role="tab"
          aria-selected={activeTab === "find"}
        >
          <Search className="w-5 h-5" />
          Find Jobs
        </button>
      </div>
    </div>
  );
};

export default SwitchToggle;
