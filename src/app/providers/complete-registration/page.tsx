"use client";
import { useSession } from "next-auth/react";

import React, { useEffect, useState, Key, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface IndustryFocus {
  category: string;
  percentage?: string;
}

interface ServiceLines {
  category: string;
  serviceline: string;
}

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  _id: Key | null | undefined;
  id: string;
  name: string;
  subcategory: SubCategory[];
}

interface Profile {
  companylogo: string;
  company_name: string;
  company_website: string;
  phone_number: string;
  company_location: string;
  location: {
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  service_lines: ServiceLines[];
  industry_focus: IndustryFocus[];
}

const Page = () => {
  const [steps, setSteps] = useState(1);
  const totalSteps = 3;

  const router = useRouter();
  const [formdata, setFormdata] = useState<Profile>({
    companylogo: "",
    company_name: "",
    company_website: "",
    phone_number: "",
    company_location: "",
    location: {
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
    service_lines: [{ category: "", serviceline: "" }],
    industry_focus: [{ category: "" }],
  });

  const [categories, setcategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [, setSelectedCity] = useState("");

  const { data: session } = useSession();
  // const  email= session?.user?.email
  const Id = session?.user?.id;
  //   const mail = localStorage.getItem('userEmail')
  console.log(Id, "ID");
  useEffect(() => {
    const fetchUser = async () => {
      if (!Id) return;
      try {
        const res = await fetch(`/api/auth/provider/${Id}`); // You need to create this API route
        const data = await res.json();
        setFormdata((prev) => ({
          ...prev,
          ...data, // pre-fill values
        }));
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [Id]);

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/positions",
      );
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCountries(data.data.map((item: any) => item.name));
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    const fetchStates = async () => {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: selectedCountry }),
        },
      );
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStates(data.data.states.map((s: any) => s.name));
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
    };
    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedState) return;
    const fetchCities = async () => {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: selectedCountry,
            state: selectedState,
          }),
        },
      );
      const data = await res.json();
      setCities(data.data);
      setSelectedCity("");
    };
    fetchCities();
  }, [selectedState, selectedCountry]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/auth/categories/get");
        if (res.ok) {
          const data = await res.json();
          setcategories(data.category);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // const sessions = async()=>{
    //         try{
    //  const res = await fetch('/api/auth/user/session');
    //         if (res.ok) {
    //           const data = await res.json();
    //           setcategories(data.category);
    //         }
    //         }
    //         catch(error){
    // console.error(error);
    //         }
    //     }
    fetchData();
    // sessions();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/provider/${Id}`, {
        method: "PUT", // or PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formdata, hasCompletedPlanSelection: true }),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        router.push("/provider/dashboard?profileCompleted=true");
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile");
    formData.append("folder", "company/profiles");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfrfq0ch8/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    if (data.secure_url) {
      setFormdata((prev) => ({ ...prev, companylogo: data.secure_url }));
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Let&apos;s get some basic information
          <span className="text-base float-right">
            Step {steps}/{totalSteps}
          </span>
        </h1>

        <form className="space-y-6">
          {steps === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <input
                type="file"
                className="w-full px-4 py-2 border rounded-lg col-span-1"
                onChange={handleImageUpload}
              />
              <input
                type="text"
                value={formdata.company_name}
                onChange={(e) =>
                  setFormdata({ ...formdata, company_name: e.target.value })
                }
                placeholder="Company Name"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formdata.company_website}
                onChange={(e) =>
                  setFormdata({ ...formdata, company_website: e.target.value })
                }
                placeholder="Website"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formdata.phone_number}
                onChange={(e) =>
                  setFormdata({ ...formdata, phone_number: e.target.value })
                }
                placeholder="Phone Number"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                value={formdata.company_location}
                onChange={(e) =>
                  setFormdata({ ...formdata, company_location: e.target.value })
                }
                placeholder="Company Location"
                className="w-full px-4 py-2 border rounded-lg"
              />

              <select
                value={formdata.location.country}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setFormdata((prev) => ({
                    ...prev,
                    location: { ...prev.location, country: e.target.value },
                  }));
                }}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <select
                value={formdata.location.state}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setFormdata((prev) => ({
                    ...prev,
                    location: { ...prev.location, state: e.target.value },
                  }));
                }}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={!states.length}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <select
                value={formdata.location.city}
                onChange={(e) => {
                  setFormdata((prev) => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value },
                  }));
                }}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={!cities.length}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={formdata.location.postal_code}
                onChange={(e) =>
                  setFormdata((prev) => ({
                    ...prev,
                    location: { ...prev.location, postal_code: e.target.value },
                  }))
                }
                placeholder="Postal Code"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          )}

          {steps === 2 && (
            <div className="space-y-8">
              {formdata.service_lines.map((line, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <select
                    value={line.category}
                    onChange={(e) => {
                      const updated = [...formdata.service_lines];
                      updated[index].category = e.target.value;
                      setFormdata({ ...formdata, service_lines: updated });
                    }}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Service Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={line.serviceline}
                    onChange={(e) => {
                      const updated = [...formdata.service_lines];
                      updated[index].serviceline = e.target.value;
                      setFormdata({ ...formdata, service_lines: updated });
                    }}
                    disabled={!line.category}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Subcategory</option>
                    {categories
                      .find((cat) => cat.name === line.category)
                      ?.subcategory.map((sub) => (
                        <option key={sub.id} value={sub.name}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormdata((prev) => ({
                      ...prev,
                      service_lines: [
                        ...prev.service_lines,
                        { category: "", serviceline: "" },
                      ],
                    }))
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  + Add Service
                </button>

                {formdata.service_lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormdata((prev) => ({
                        ...prev,
                        service_lines: prev.service_lines.slice(0, -1),
                      }))
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    - Delete
                  </button>
                )}
              </div>

              {formdata.industry_focus.map((focus, index) => (
                <div key={index}>
                  <select
                    value={focus.category}
                    onChange={(e) => {
                      const updated = [...formdata.industry_focus];
                      updated[index].category = e.target.value;
                      setFormdata({ ...formdata, industry_focus: updated });
                    }}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Industry</option>
                    {[
                      "Advertising & marketing",
                      "Education",
                      "Finance",
                      "Health Care",
                      "Technology",
                      "Transportation",
                      "Legal",
                      "Other industries",
                    ].map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormdata((prev) => ({
                      ...prev,
                      industry_focus: [
                        ...prev.industry_focus,
                        { category: "" },
                      ],
                    }))
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  + Add Industry
                </button>

                {formdata.industry_focus.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormdata((prev) => ({
                        ...prev,
                        industry_focus: prev.industry_focus.slice(0, -1),
                      }))
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    {" "}
                    -Delete{" "}
                  </button>
                )}
              </div>
            </div>
          )}

          {steps === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Review Your Details
              </h2>

              <div>
                <strong>Company:</strong> {formdata.company_name}
              </div>
              <div>
                <strong>Website:</strong> {formdata.company_website}
              </div>
              <div>
                <strong>Phone:</strong> {formdata.phone_number}
              </div>
              <div>
                <strong>Location:</strong> {formdata.company_location},{" "}
                {formdata.location.city}, {formdata.location.state},{" "}
                {formdata.location.country} - {formdata.location.postal_code}
              </div>

              <div>
                <strong>Services:</strong>
                <ul className="list-disc ml-5">
                  {formdata.service_lines.map((s, i) => (
                    <li key={i}>
                      {s.category} → {s.serviceline}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Industries:</strong>
                <ul className="list-disc ml-5">
                  {formdata.industry_focus.map((f, i) => (
                    <li key={i}>{f.category}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {steps > 1 && (
              <button
                type="button"
                onClick={() => setSteps(steps - 1)}
                className="w-full sm:w-auto bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Prev
              </button>
            )}

            {steps !== totalSteps ? (
              <button
                type="button"
                onClick={() => setSteps(steps + 1)}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
