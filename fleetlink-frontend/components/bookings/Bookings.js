"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import { PageLoader, TableSkeleton } from "@/components/Loader";
import { api } from "@/lib/api";
import { DivideCircle } from "lucide-react";
import Filters from "./Filters";
import BookingsTable from "./BookingsTable";
import BookingDetailModal from "./BookingDetailModal";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    customerId: "",
    vehicleId: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const statusColors = {
    confirmed: "bg-primary-100 text-primary-800",
    "in-progress": "bg-warning-100 text-warning-800",
    completed: "bg-success-100 text-success-800",
    cancelled: "bg-danger-100 text-danger-800",
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = { ...filters };

      // Remove empty
      Object.keys(queryParams).forEach((key) => {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      });

      const response = await api.bookings.getAll(queryParams);

      if (response.data.success) {
        setBookings(response.data.data || []);
        setPagination(response.data.pagination || {});
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingStatus(true);
      setStatusError(null);

      const response = await api.bookings.updateStatus(bookingId, newStatus);

      if (response.data.success) {
        // Refresh
        await fetchBookings();

        // Update selected booking
        if (selectedBooking && selectedBooking._id === bookingId) {
          setSelectedBooking(response.data.data);
        }
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
      setStatusError("Failed to update booking status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingBooking(bookingId);
      setCancelError(null);

      const response = await api.bookings.cancel(bookingId);

      if (response.data.success) {
        // Refresh
        await fetchBookings();

        // Close modal
        if (selectedBooking && selectedBooking._id === bookingId) {
          setShowDetailModal(false);
          setSelectedBooking(null);
        }
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setCancelError("Failed to cancel booking.");
    } finally {
      setCancellingBooking(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    } else {
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours - wholeHours) * 60);
      return minutes === 0 ? `${wholeHours}h` : `${wholeHours}h ${minutes}m`;
    }
  };

  if (loading && bookings.length === 0) {
    return <PageLoader message="Loading bookings..." />;
  }

  return (
    <div>
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

      {statusError && (
        <div className="mb-6">
          <Alert
            type="error"
            title="Status Update Error"
            message={statusError}
            dismissible
            onClose={() => setStatusError(null)}
          />
        </div>
      )}

      {cancelError && (
        <div className="mb-6">
          <Alert
            type="error"
            title="Cancel Error"
            message={cancelError}
            dismissible
            onClose={() => setCancelError(null)}
          />
        </div>
      )}

      <Filters filters={filters} setFilters={setFilters} />

      <BookingsTable
        setSelectedBooking={setSelectedBooking}
        setShowDetailModal={setShowDetailModal}
        bookings={bookings}
        pagination={pagination}
        loading={loading}
        statusColors={statusColors}
        updatingStatus={updatingStatus}
        cancellingBooking={cancellingBooking}
        handleStatusUpdate={handleStatusUpdate}
        handleCancelBooking={handleCancelBooking}
      />

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          showDetailModal={showDetailModal}
          setShowDetailModal={setShowDetailModal}
          selectedBooking={selectedBooking}
          statusColors={statusColors}
          updatingStatus={updatingStatus}
          cancellingBooking={cancellingBooking}
        />
      )}
    </div>
  );
}
