import Link from "next/link";
import React from "react";
import Button from "../Button";

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/vehicles/add">
            <Button variant="primary" className="w-full">
              Add Vehicle
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="w-full">
              Search & Book
            </Button>
          </Link>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          System Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">API Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Database</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
