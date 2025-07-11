"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface PortfolioType {
  title: string;
  description: string;
  project_category: string;
  project_cost: string;
  project_link: string;
  screenshot: string;
  thumbnail: string;
  timeline: string;
  isdelete?: boolean;
}

const Page = () => {
  const [portfolio, setPortfolio] = useState<PortfolioType[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const id = session?.user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/auth/provider/portfolio/${id}`);
        if (res.ok) {
          const data = await res.json();
          console.log(data, "response data");
          setPortfolio(data.portfolio);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleRemove = async (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this portfolio item?",
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/auth/provider/remove`, {
        method: "POST",
        body: JSON.stringify({ id, index }),
      });

      if (res.ok) {
        setPortfolio((prev) => {
          const updatedPortfolio = [...prev];
          updatedPortfolio[index].isdelete = true;
          return updatedPortfolio;
        });
        alert("Portfolio item deleted successfully.");
      } else {
        alert("Failed to delete the portfolio item.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the portfolio item.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <button
        onClick={() => router.push("/provider/profile/portfolio/create")}
        className="bg-[#f07164] text-white px-4 py-2 rounded-full"
      >
        Add Portfolio
      </button>
      <div className="flex justify-between items-center mb-4">
        <table className="min-w-full divide-y divide-gray-200 mt-5">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Portfolio
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Timeline
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Project Link
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Project Cost
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolio
              .filter((item) => !item.isdelete)
              .map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-row gap-4">
                      <button
                        onClick={() =>
                          router.push(
                            `/provider/profile/portfolio/edit/${index}`,
                          )
                        }
                        className="bg-blue-500 px-4 py-2 text-white rounded-full"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(index)}
                        className="bg-[#f07164] px-4 py-2 text-white rounded-full"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Image
                      src={item.screenshot}
                      alt="portfolio"
                      width={300}
                      height={100}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.timeline}
                  </td>
                  <td className="tracking-normal text-sm text-gray-900 max-w-xs">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    <a
                      href={item.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.project_link}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                    {item.project_cost}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
