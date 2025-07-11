"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

interface UserType {
  id: string;
  firstname: string;
  lastname: string;
  email?: string;
}

const CompanyDashboardPage = () => {
  const [, setCompletion] = useState<number>(0);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [, setShowModal] = useState(false);

  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/user/session", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
      }
    };

    if (session?.user?.id) {
      fetchUser();
    }
  }, [session]);

  useEffect(() => {
    const shouldShow = searchParams.get("profileCompleted");
    if (shouldShow === "true") {
      setShowModal(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    const stored = localStorage.getItem("profile");
    if (stored && !isNaN(parseInt(stored))) {
      setCompletion(parseInt(stored));
    }
  }, []);

  if (status === "loading" || !userData) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Provider Dashboard</h1>

      <p className="text-2xl font-semibold text-blue-600 mb-4">
        Welcome, {userData.firstname} {userData.lastname}
      </p>

      {/* Remaining Code Same */}
    </div>
  );
};

const DashboardWrapper = () => (
  <Suspense fallback={<p className="p-4">Loading...</p>}>
    <CompanyDashboardPage />
  </Suspense>
);

export default DashboardWrapper;
