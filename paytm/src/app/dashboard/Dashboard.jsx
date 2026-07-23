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

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* Welcome Section */}
        <WelcomeSection user={user} />

        {/* Recharge Form */}
        <section className="mt-6 sm:mt-8">
          <RechargeForm
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        </section>

        {/* Filters */}
        <section className="mt-6 sm:mt-8">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onApply={handleApply}
            onReset={handleReset}
          />
        </section>

        {/* Recharge History */}
        <section className="mt-6 sm:mt-8">
          <RechargeHistory
            filters={appliedFilters}
            refreshKey={refreshKey}
          />
        </section>

      </main>
    </div>
  );
}