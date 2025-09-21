import Link from "next/link";
import React from "react";
import Button from "../Button";
import { TriangleAlert } from "lucide-react";

const RecentBookings = ({ recentBookings }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
        <Link href="/bookings">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      {recentBookings.length === 0 ? (
        <div className="text-center py-8">
          <TriangleAlert />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No bookings
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new booking.
          </p>
          <div className="mt-6">
            <Link href="/search">
              <Button variant="primary">Create Booking</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-900">
                    {booking.customerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.fromPincode} → {booking.toPincode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold capitalize rounded-full ${
                        booking.bookingStatus === "completed"
                          ? "bg-success-100 text-success-800"
                          : booking.bookingStatus === "in-progress"
                          ? "bg-warning-100 text-warning-800"
                          : booking.bookingStatus === "cancelled"
                          ? "bg-danger-100 text-danger-800"
                          : "bg-primary-100 text-primary-800"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* {new Date(booking.startTime).toLocaleDateString()} */}
                    {booking.startTime.split("T")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentBookings;
