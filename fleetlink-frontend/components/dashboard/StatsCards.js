import { Calendar, Check, SquareMenu, Timer } from "lucide-react";
import React from "react";

const StatsCards = ({
  totalVehicles,
  totalBookings,
  activeBookings,
  completedBookings,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
                <SquareMenu />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Vehicles
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalVehicles}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-500 rounded-md flex items-center justify-center">
                <Calendar />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Bookings
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalBookings}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-warning-500 rounded-md flex items-center justify-center">
                <Timer />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Bookings
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {activeBookings}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-600 rounded-md flex items-center justify-center">
                <Check />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Completed
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {completedBookings}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
