"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import StatsCards from "./StatsCards";
import QuickActions from "./QuickActions";
import RecentBookings from "./RecentBookings";

const Dashboard = ({
  totalVehicles,
  totalBookings,
  activeBookings,
  completedBookings,
  recentBookings,
}) => {
  const [error, setError] = useState(null);

  return (
    <div className="px-4 py-6 sm:px-0">
      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            title="Error"
            message={error}
            dismissible
            onClose={() => setError(null)}
          />
        </div>
      )}

      <StatsCards
        totalVehicles={totalVehicles}
        totalBookings={totalBookings}
        activeBookings={activeBookings}
        completedBookings={completedBookings}
      />

      <QuickActions />

      <RecentBookings recentBookings={recentBookings} />
    </div>
  );
};

export default Dashboard;
