"use client";

import { useState } from "react";
import FilterBar from "@/components/FilterBar";
import Navbar from "@/components/Navbar";
import RechargeForm from "@/components/RechargeForm";
import RechargeHistory from "@/components/RechargeHistory";
import WelcomeSection from "@/components/WelcomeSection";

export default function Dashboard({ user }) {
  const [filters, setFilters] = useState({
    operator: "",
    date: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    operator: "",
    date: "",
  });

  const [refreshKey, setRefreshKey] = useState(0);

  function handleApply() {
    setAppliedFilters(filters);
  }

  function handleReset() {
    const emptyFilters = {
      operator: "",
      date: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        <WelcomeSection user={user} />

        <RechargeForm
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
        />

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onApply={handleApply}
          onReset={handleReset}
        />

        <RechargeHistory
          filters={appliedFilters}
          refreshKey={refreshKey}
        />

      </main>
    </div>
  );
}