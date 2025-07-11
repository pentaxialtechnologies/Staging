"use client";
import { useEffect, useState } from "react";
import { Briefcase, Users, Building2, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState({
    jobSeekers: 0,
    jobPosts: 0,
    Providers: 0,
    applications: 0,
  });

  useEffect(() => {
    fetch("/api/auth/admin/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, []);

  return (
    <div className="p-12 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Jobs"
          icon={Briefcase}
          count={summary.jobPosts}
          color="bg-blue-100"
        />
        <Card
          title="Job Seekers"
          icon={Users}
          count={summary.jobSeekers}
          color="bg-green-100"
        />
        <Card
          title="Providers"
          icon={Building2}
          count={summary.Providers}
          color="bg-yellow-100"
        />
        <Card
          title="Applications"
          icon={FileText}
          count={summary.applications}
          color="bg-purple-100"
        />
      </div>
    </div>
  );
}

type CardProps = {
  title: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  icon: any;
  count: number;
  color: string;
};

function Card({ title, icon: Icon, count, color }: CardProps) {
  return (
    <div
      className={`p-4 ${color} rounded-xl shadow flex items-center space-x-4`}
    >
      <div className="bg-white p-2 rounded-full shadow">
        <Icon className="h-6 w-6 text-gray-700" />
      </div>
      <div>
        <h3 className="text-sm text-gray-600">{title}</h3>
        <p className="text-xl font-bold">{count}</p>
      </div>
    </div>
  );
}
