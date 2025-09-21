import React from "react";
import Button from "../Button";
import Modal from "../Modal";
import { formatDate, formatDuration } from "@/lib/utils";

const BookingDetailModal = ({
  showDetailModal,
  setShowDetailModal,
  selectedBooking,
  statusColors,
  updatingStatus,
  cancellingBooking,
}) => {
  return (
    <Modal
      isOpen={showDetailModal}
      onClose={() => setShowDetailModal(false)}
      title="Booking Details"
      size="xl"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              Booking #{selectedBooking._id}
            </h4>
            <p className="text-sm text-gray-500">
              Created on {formatDate(selectedBooking.createdAt)}
            </p>
          </div>
          <span
            className={`inline-flex px-3 py-1 uppercase text-sm font-semibold rounded-full ${
              statusColors[selectedBooking.bookingStatus]
            }`}
          >
            {selectedBooking.bookingStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Trip Information</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Route:</span>
                <span className="font-medium text-primary-900">
                  {selectedBooking.fromPincode} → {selectedBooking.toPincode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Start Time:</span>
                <span className="font-medium text-primary-900">
                  {formatDate(selectedBooking.startTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">End Time:</span>
                <span className="font-medium text-primary-900">
                  {formatDate(selectedBooking.endTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium text-primary-900">
                  {formatDuration(selectedBooking.estimatedRideDurationHours)}
                </span>
              </div>
              {selectedBooking.totalCost && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Cost:</span>
                  <span className="font-medium text-primary-900">
                    ₹{selectedBooking.totalCost}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">
              Vehicle Information
            </h5>
            {selectedBooking.vehicleId && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-primary-900">
                    {selectedBooking.vehicleId.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium capitalize text-primary-900">
                    {selectedBooking.vehicleId.vehicleType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Capacity:</span>
                  <span className="font-medium text-primary-900">
                    {selectedBooking.vehicleId.capacityKg} kg
                  </span>
                </div>
                {selectedBooking.vehicleId.registrationNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Registration:</span>
                    <span className="font-medium text-primary-900">
                      {selectedBooking.vehicleId.registrationNumber}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">
              Customer Information
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer ID:</span>
                <span className="font-medium text-primary-900">
                  {selectedBooking.customerId}
                </span>
              </div>
              {selectedBooking.customerInfo?.name && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-primary-900">
                    {selectedBooking.customerInfo.name}
                  </span>
                </div>
              )}
              {selectedBooking.customerInfo?.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-primary-900">
                    {selectedBooking.customerInfo.phone}
                  </span>
                </div>
              )}
              {selectedBooking.customerInfo?.email && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-primary-900">
                    {selectedBooking.customerInfo.email}
                  </span>
                </div>
              )}
              {selectedBooking.customerInfo?.company && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Company:</span>
                  <span className="font-medium text-primary-900">
                    {selectedBooking.customerInfo.company}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">
              Cargo Information
            </h5>
            <div className="space-y-2 text-sm">
              {selectedBooking.cargoDetails?.weight && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Weight:</span>
                  <span className="font-medium text-primary-900">
                    {selectedBooking.cargoDetails.weight} kg
                  </span>
                </div>
              )}
              {selectedBooking.cargoDetails?.description && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Description:</span>
                  <span className="font-medium text-primary-900">
                    {selectedBooking.cargoDetails.description}
                  </span>
                </div>
              )}
              {selectedBooking.cargoDetails?.specialRequirements && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Special Requirements:</span>
                  <span className="font-medium text-primary-900">
                    {selectedBooking.cargoDetails.specialRequirements}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {(selectedBooking.actualPickupTime ||
          selectedBooking.actualDeliveryTime) && (
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Actual Timing</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedBooking.actualPickupTime && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Actual Pickup:</span>
                    <span className="font-medium text-primary-900">
                      {formatDate(selectedBooking.actualPickupTime)}
                    </span>
                  </div>
                </div>
              )}

              {selectedBooking.actualDeliveryTime && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Actual Delivery:</span>
                    <span className="font-medium text-primary-900">
                      {formatDate(selectedBooking.actualDeliveryTime)}
                    </span>
                  </div>
                  {selectedBooking.actualDurationHours && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Actual Duration:</span>
                      <span className="font-medium text-primary-900">
                        {formatDuration(selectedBooking.actualDurationHours)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedBooking.notes && (
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Notes</h5>
            <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
              {selectedBooking.notes}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {selectedBooking.bookingStatus === "confirmed" && (
            <>
              <Button
                variant="success"
                onClick={() =>
                  handleStatusUpdate(selectedBooking._id, "in-progress")
                }
                disabled={updatingStatus}
              >
                Start Trip
              </Button>
              <Button
                variant="danger"
                onClick={() => handleCancelBooking(selectedBooking._id)}
                loading={cancellingBooking === selectedBooking._id}
                disabled={cancellingBooking === selectedBooking._id}
              >
                Cancel Booking
              </Button>
            </>
          )}

          {selectedBooking.bookingStatus === "in-progress" && (
            <Button
              variant="success"
              onClick={() =>
                handleStatusUpdate(selectedBooking._id, "completed")
              }
              disabled={updatingStatus}
            >
              Complete Trip
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailModal;
