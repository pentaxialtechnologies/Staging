'use client';

import { useParams } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';

interface Staff {
  OrgId: string;
  primarySkills: string;
  skills: string[];
  designation: string;
  numberBenchStaff: string;
  averageExperience: string;
  rate: string;
  rateType: string;
  availability: string;
  inDirectMessage: boolean;
  engagementType: string;
  workFrom: string;
  availableAtClientLocation: string;
}

const Page = () => {
  const [form, setForm] = useState<Staff>({
    OrgId: '',
    primarySkills: '',
    skills: [],
    designation: '',
    numberBenchStaff: '',
    averageExperience: '',
    rate: '',
    rateType: '',
    availability: '',
    inDirectMessage: false,
    engagementType: '',
    workFrom: '',
    availableAtClientLocation: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const params = useParams();
  const id = params.id as string;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await fetch(`/api/auth/organization/staff/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...form}),
      });

      if (res.ok) {
        const data = await res.json();
        alert('Staff updated successfully!');
        console.log('Updated Staff:', data);
      } else {
        alert('Failed to update staff');
        console.error('Server error:', await res.text());
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Something went wrong');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/auth/organization/staff/get/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm(data.staff);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex flex-row justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Edit Staff Details</h1>
          <button className="border border-orange-500 px-4 py-2 rounded-full">Back</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block mb-2">Primary Skills</label>
              <input
                type="text"
                name="primarySkills"
                value={form.primarySkills}
                 onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>

            <div>
              <label className="block mb-2">Skills</label>
              <div className="flex flex-wrap gap-2 mb-1">
                {form.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-red-500 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type skill and press Enter"
                className="px-3 py-2 border rounded-lg w-full"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
            </div>

            <div>
              <label className="block mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>

            <div>
              <label className="block mb-2">Number of Bench Staff</label>
              <input
                type="text"
                name="numberBenchStaff"
                value={form.numberBenchStaff}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>

            <div>
              <label className="block mb-2">Average Experience (Years)</label>
              <input
                type="text"
                name="averageExperience"
                value={form.averageExperience}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>

            <div>
              <label className="block mb-2">Rate</label>
              <input
                type="text"
                name="rate"
                value={form.rate}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              />
            </div>

            <div>
              <label className="block mb-2">Rate Type</label>
              <select
                name="rateType"
                value={form.rateType}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              >
                <option value="">Select</option>
                <option value="Hourly">Hourly</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Availability</label>
              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              >
                <option value="">Select</option>
                <option value="Immediately">Immediately</option>
                <option value="In 1 or 2 weeks from now">In 1 or 2 weeks from now</option>
                <option value="In 1 or 2 months from now">In 1 or 2 months from now</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Engagement Type</label>
              <select
                name="engagementType"
                value={form.engagementType}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              >
                <option value="">Select</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Full-Time">Full-Time</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Work From</label>
              <select
                name="workFrom"
                value={form.workFrom}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              >
                <option value="">Select</option>
                <option value="Remote">Remote</option>
                <option value="On-Site">On-Site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Available at Client&apos;s Location</label>
              <select
                name="availableAtClientLocation"
                value={form.availableAtClientLocation}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg w-full"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Update Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
