"use client";
import { useEffect, useState } from "react";

interface StaffsType {
  isApproved: boolean;
  updatedAt: string | number | Date;
  availableAtClientLocation: string;
  primarySkills: string;
  rate: string;
  workFrom: string;
  primaryskills: string[];
  _id: string;
  OrgId: {
    company_name: string;
  };
  designation: string;
  availability: string;
  averageExperience: string;
  engagementType: string;
  skills: string[];
  numberBenchStaff: string;
  rateType: string;
}

const Page = () => {
  const [staffData, setStaffData] = useState<StaffsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/auth/admin/staff");
        const data = await res.json();
        console.log(data, "Fetched staff data");
        if (Array.isArray(data.staff)) {
          setStaffData(data.staff);
        } else {
          console.error('Expected "staff" to be an array in API response');
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch(`/api/auth/admin/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) {
        setStaffData((prevData) =>
          prevData.map((staff) =>
            staff._id === id ? { ...staff, isApproved } : staff,
          ),
        );
        alert(`Status updated to ${isApproved ? "Approved" : "Rejected"}`);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="grid grid-cols-1 gap-6">
      {staffData.length === 0 ? (
        <p className="text-center text-gray-500">No staff records found.</p>
      ) : (
        staffData.map((staff) => (
          <div
            key={staff._id}
            className="bg-white shadow-md border border-gray-200 rounded-lg p-5 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h1 className="text-xl font-bold">
                  Company Name:
                  <span className="text-gray-800 ml-2">
                    {staff.OrgId?.company_name || "N/A"}
                  </span>
                </h1>
                <p className="font-semibold">
                  Primary Skill:{" "}
                  <span className="font-medium text-sm">
                    {staff.primarySkills}
                  </span>
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {staff.designation}
                </p>
                <p className="text-sm text-gray-500">
                  Staff Count: {staff.numberBenchStaff}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <span className="font-semibold">Rate:</span> ${staff.rate} (
                  {staff.rateType})
                </p>
                <p>
                  <span className="font-semibold">Experience:</span>{" "}
                  {staff.averageExperience} yrs
                </p>
                <p>
                  <span className="font-semibold">Primary Skills:</span>{" "}
                  {staff.primaryskills?.join(", ") || "-"}
                </p>
                <p>
                  <span className="font-semibold">Work From:</span>{" "}
                  {staff.workFrom}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Engagement Type:</span>{" "}
                  {staff.engagementType}
                </p>
                <p>
                  <span className="font-semibold">Client Location:</span>{" "}
                  {staff.availableAtClientLocation}
                </p>
                <p>
                  <span className="font-semibold">Availability:</span>{" "}
                  {staff.availability}
                </p>
                <p>
                  <span className="font-semibold">Updated At:</span>{" "}
                  {new Date(staff.updatedAt).toLocaleDateString()}
                </p>
                <p className="font-semibold">
                  Status:{" "}
                  <span
                    className={`ml-1 px-2 py-1 rounded-full text-xs ${
                      staff.isApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {staff.isApproved ? "Approved" : "Pending"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold text-sm mb-1">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {staff.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-4 justify-end">
              <button
                onClick={() => handleStatusChange(staff._id, true)}
                className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(staff._id, false)}
                className="bg-gray-400 text-white px-4 py-1.5 rounded-md text-sm hover:bg-gray-500"
              >
                Hold
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Page;
