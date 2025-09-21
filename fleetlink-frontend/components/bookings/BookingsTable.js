import React from "react";
import Button from "../Button";
import { TableSkeleton } from "../Loader";
import Pagination from "./Pagination";
import { api } from "@/lib/api";
import { formatDate, formatDuration } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

const BookingsTable = ({
  setSelectedBooking,
  setShowDetailModal,
  bookings,
  pagination,
  loading,
  statusColors,
  updatingStatus,
  cancellingBooking,
  handleStatusUpdate,
  handleCancelBooking,
}) => {
  const handleViewDetails = async (bookingId) => {
    try {
      const response = await api.bookings.getById(bookingId);
      if (response.data.success) {
        setSelectedBooking(response.data.data);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError("Failed to load booking details.");
    }
  };
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Bookings ({pagination.total || 0})
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          Page {pagination.page || 1} of {pagination.pages || 1}
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <TriangleAlert />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No bookings found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No bookings match your current filters.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.customerId}
                      </div>
                      {booking.customerInfo?.name && (
                        <div className="text-sm text-gray-500">
                          {booking.customerInfo.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.vehicleId?.name || booking.vehicleId}
                      </div>
                      {booking.vehicleId?.registrationNumber && (
                        <div className="text-sm text-gray-500">
                          {booking.vehicleId.registrationNumber}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.fromPincode} → {booking.toPincode}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDuration(booking.estimatedRideDurationHours)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.startTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 capitalize py-1 text-xs font-semibold rounded-full ${
                          statusColors[booking.bookingStatus] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(booking._id)}
                      >
                        View
                      </Button>

                      {booking.bookingStatus === "confirmed" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() =>
                              handleStatusUpdate(booking._id, "in-progress")
                            }
                            disabled={updatingStatus}
                          >
                            Start
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleCancelBooking(booking._id)}
                            loading={cancellingBooking === booking._id}
                            disabled={cancellingBooking === booking._id}
                          >
                            Cancel
                          </Button>
                        </>
                      )}

                      {booking.bookingStatus === "in-progress" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            handleStatusUpdate(booking._id, "completed")
                          }
                          disabled={updatingStatus}
                        >
                          Complete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && <Pagination pagination={pagination} />}
        </>
      )}
    </div>
  );
};

export default BookingsTable;
