
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface CompanyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface CompanyData {
  firstname: string;
  lastname: string;
  companyname: string;
  websiteUrl: string;
  phone: string;
  gstno: string;
  strength: string;
  industry: string;
  description: string;
  location: CompanyLocation;
  createdBy?: string;
}

export default function CompanyForm() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const useremail = session?.user?.email;

  const [form, setForm] = useState<CompanyData>({
    firstname: "",
    lastname: "",
    companyname: "",
    websiteUrl: "",
    phone: "",
    gstno: "",
    strength: "",
    industry: "",
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [hasCompany, setHasCompany] = useState(false);

  // Fetch company details if exists
  useEffect(() => {
    if (!userId) return;

    const fetchCompany = async () => {
      setFetching(true);
      try {
        const res = await fetch(`/api/auth/employer/userprofile/update/${userId}`);
        if (res.status === 404) {
          setHasCompany(false);
          return;
        }

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        if (data.company) {
          setForm({
            firstname: data.company.firstname || "",
            lastname: data.company.lastname || "",
            companyname: data.company.companyname || "",
            websiteUrl: data.company.websiteUrl || "",
            phone: data.company.phone || "",
            gstno: data.company.gstno || "",
            strength: data.company.strength || "",
            industry: data.company.industry || "",
            description: data.company.description || "",
            location: {
              address: data.company.location?.address || "",
              city: data.company.location?.city || "",
              state: data.company.location?.state || "",
              country: data.company.location?.country || "",
              postalCode: data.company.location?.postalCode || "",
            },
            createdBy: data.company.createdBy,
          });
          setHasCompany(true);
        }
      } catch (err) {
        console.error("Failed to fetch company data:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchCompany();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Please login first.");
      return;
    }

    setLoading(true);
    try {
      const url = hasCompany
        ? `/api/auth/employer/userprofile/user/${userId}`
        : `/api/auth/employer/userprofile/create`;
      const method = hasCompany ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, createdBy: userId }),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const responseData = await res.json();
      const company = responseData.company;

      setForm({
        firstname: company.firstname || "",
        lastname: company.lastname || "",
        companyname: company.companyname || "",
        websiteUrl: company.websiteUrl || "",
        phone: company.phone || "",
        gstno: company.gstno || "",
        strength: company.strength || "",
        industry: company.industry || "",
        description: company.description || "",
        location: {
          address: company.location?.address || "",
          city: company.location?.city || "",
          state: company.location?.state || "",
          country: company.location?.country || "",
          postalCode: company.location?.postalCode || "",
        },
        createdBy: company.createdBy,
      });

      setHasCompany(true);
      alert(hasCompany ? "Company updated successfully!" : "Company created successfully!");
    } catch (err) {
      console.error("Error submitting company data:", err);
      alert("Failed to submit company data");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || fetching) return <div className="text-center mt-10">Loading...</div>;

  if (!userId) return <div className="text-center mt-10">Please login to manage your company.</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">
        {hasCompany ? "Update Company Details" : "Create Company"}
      </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label>First Name *</label>
    <input className="input"
          name="firstname"
          value={form.firstname}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        </div>
          <div>
            <label>Last Name *</label>
    <input className="input"
          name="lastname"
          value={form.lastname}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        </div>
          <div>
            <label>Company Name *</label>
    <input className="input"
          name="companyname"
          value={form.companyname}
          onChange={handleChange}
          placeholder="Company Name"
          required
        />
        </div>

        {/* Email */}
       <div className="w-full max-w-md mx-auto">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
    Email
  </label>
  <input
    type="email"
    id="email"
    name="email"
    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    value={useremail || ''}
    onChange={handleChange}
    placeholder="Enter email"
    required
    readOnly
  />
</div>


        <div>
  <label>Phone</label>
        <input
          type="number"
          maxLength={10}
          className="input"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        </div>
        <div>
        <label>Company Website Url</label>
        <input
          className="input"
          name="websiteUrl"
          value={form.websiteUrl}
          onChange={handleChange}
          placeholder="Website URL"
        />
        </div>
<div>
      <label>GST No</label>
        <input
          className="input"
          name="gstno"
          value={form.gstno}
          onChange={handleChange}
          placeholder="Enter GSTIN"
          maxLength={15}
          
        />
        </div>
<div className="w-full max-w-md mx-auto">
  <label htmlFor="strength" className="block text-sm font-medium text-gray-700 mb-1">
    How many people are in your company?
  </label>
  <select
    name="strength"
    id="strength"
    value={form.strength}
    onChange={handleChange}
    className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
  >
    <option value="" disabled>Select company-size</option>
    <option value="It's just me">It&apos;s just me</option>
    <option value="2-9 employees">2-9 employees</option>
    <option value="10-99 employees">10-99 employees</option>
    <option value="100-1000 employees">100-1000 employees</option>
    <option value="More than 1000 employees">More than 1000 employees</option>
  </select>
</div>

<div className="w-full max-w-md mx-auto">
      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Company Industry</label>
      <select name="industry" id="industry" value={form.industry}  onChange={handleChange} className="block w-full px-4 py-2  border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" >
    <option value="" disabled>
     Select Industry
    </option>
    <option value="Arts & entertainment & music">
      Arts & entertainment & music
    </option>
    <option value="Automotive">Automotive</option>
    <option value="Business services">Business services</option>
    <option value="Consumer products & services">
      Consumer products & services
    </option>
    <option value="Dental">Dental</option>
    <option value="eCommerce" >eCommerce</option>
    <option value="Education">Education</option>
    <option value="Energy & natural resources">Energy & natural resources</option>
    <option value="Financial services">Financial services</option>
    <option value="Gambling">Gambling</option>
    <option value="Gaming">Gaming</option>
    <option value="Government">Government</option>
    <option value="GPS & Navigation & GIS">GPS & Navigation & GIS</option>
    <option value="Health Care & Medical">Health Care & Medical</option>
    <option value="Hospitality & leisure">Hospitality & leisure</option>
    <option value="Information technology">Information technology</option>
    <option value="Legal">Legal</option>
    <option value="Legal Cannabis">Legal Cannabis</option>
    <option value="Manufacturing">Manufacturing</option>
    <option value="Media">Media</option>
    <option value="Non-profit">Non-profit</option>
    <option value="Politics">Politics</option>
    <option value="Real estate">Real estate</option>
    <option value="Retail">Retail</option>
    <option value="Telecommunications">Telecommunications</option>
    <option value="Transportation">Transportation</option>
    <option value="Utilities">Utilities</option>
    <option value="Other industries">Other industries</option>
  </select>
        </div>


<div>
   <label>Location</label>
        <input
          className="input"
          name="location.address"
          value={form.location.address}
          onChange={handleChange}
          placeholder="Address"
        />
</div>
<div>
      <label>City</label>
        <input
          className="input"
          name="location.city"
          value={form.location.city}
          onChange={handleChange}
          placeholder="City"
        />
        </div>
<div>
      <label>State</label>
        <input
          className="input"
          name="location.state"
          value={form.location.state}
          onChange={handleChange}
          placeholder="State"
        />
        </div>

      <div>
          <label>Country</label>
        <input
          className="input"
          name="location.country"
          value={form.location.country}
          onChange={handleChange}
          placeholder="Country"
        />
        </div>
<div>
      <label>Postal Code</label>
        <input
          className="input"
          name="location.postalCode"
          value={form.location.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
        />
        </div>

      </div>
<div>
      <label>Company Description</label>
      <textarea
        className="input w-full"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Company Description"
        rows={4}
      />
</div>
      
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? (hasCompany ? "Updating..." : "Creating...") : hasCompany ? "Update Company" : "Create Company"}
      </button>
    </form>
  );
}
