import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              <h1 className="text-2xl font-bold text-primary-600">FleetLink</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/vehicles/add"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Add Vehicle
            </Link>
            <Link
              href="/search"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Search & Book
            </Link>
            <Link
              href="/bookings"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Bookings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
