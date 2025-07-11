import SwitchToggle from "@/Components/Home/Toggle";
import { Search } from "lucide-react";
import React from "react";

const SearchJob = () => {
  type Company = { title: string; desc: string };

  const CompanyItems: Company[] = [
    { title: "939+", desc: "Available Jobs" },
    { title: "88+", desc: "Countries Covered" },
    { title: "3000+", desc: "In-demand Skills" },
    { title: "90+", desc: "Service Categories" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mt-10">
        <SwitchToggle />
      </div>
      <div className="flex flex-col  items-center text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1A2B6B] mt-8 mb-4">
          Explore Contract Jobs
        </h1>
        <p className="text-sm sm:text-lg md:text-xl leading-relaxed text-gray-700 max-w-2xl">
          Browse 939+ contract jobs posted on TrueFirms or deploy your bench to
          get inquiries from potential clients.
        </p>
        <div className="flex items-center w-full max-w-md mx-auto rounded-full overflow-hidden border mt-5">
          <input
            type="search"
            placeholder="search Contract jobs by skill...."
            className="w-full  rounded-full px-4 py-2 overflow-hidden focus:outline-none "
          />
          <button className="bg-[#1A2B6B] p-2 text-white hover:bg-[#16245b] transition-colors duration-200 ">
            <Search size={25} />
          </button>
        </div>
        <div className="mt-4">
          <div className="w-10 h-10 mx-auto flex items-center justify-center border border-orange-600 rounded-full text-orange-600 font-semibold">
            OR
          </div>
          <button className="bg-orange-600 text-white text-lg sm:text-2xl px-6 py-2 mt-3 rounded-lg hover:bg-orange-700 transition duration-200">
            Deploy Your Branch
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 w-full">
        {CompanyItems.map((item, index) => (
          <div key={index} className="text-center">
            <h3 className="text-orange-500 font-bold text-lg sm:text-2xl">
              {item.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchJob;
