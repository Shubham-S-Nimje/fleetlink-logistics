import React from "react";
import Button from "../Button";
import Modal from "../Modal";
import Alert from "../Alert";
import Input from "../Input";
import { formatDuration } from "@/lib/utils";
import { Check } from "lucide-react";

const BookingModal = ({
  showBookingModal,
  setShowBookingModal,
  bookingSuccess,
  selectedVehicle,
  bookingError,
  setBookingError,
  bookingData,
  searchParams,
  bookingLoading,
  handleBookingSubmit,
  handleBookingInputChange,
  estimatedDuration,
  errors,
}) => {
  return (
    <Modal
      isOpen={showBookingModal}
      onClose={() => setShowBookingModal(false)}
      title="Book Vehicle"
      size="xl"
    >
      {bookingSuccess ? (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100 mb-4">
            <Check />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-sm text-gray-500">
            Your vehicle has been successfully booked.
          </p>
        </div>
      ) : (
        <>
          {selectedVehicle && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Selected Vehicle
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <span className="ml-2 font-medium text-primary-900">
                    {selectedVehicle.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Capacity:</span>
                  <span className="ml-2 font-medium text-primary-900">
                    {selectedVehicle.capacityKg} kg
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-2 font-medium capitalize text-primary-900">
                    {selectedVehicle.vehicleType}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 font-medium text-primary-900">
                    {formatDuration(estimatedDuration)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {bookingError && (
            <div className="mb-6">
              <Alert
                type="error"
                title="Booking Error"
                message={bookingError}
                dismissible
                onClose={() => setBookingError(null)}
              />
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Customer Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Customer ID"
                    name="customerId"
                    value={bookingData.customerId}
                    onChange={handleBookingInputChange}
                    placeholder="e.g., CUST001"
                    required
                    error={errors.customerId}
                  />

                  <Input
                    label="Customer Name"
                    name="customerName"
                    value={bookingData.customerName}
                    onChange={handleBookingInputChange}
                    placeholder="e.g., John Doe"
                  />

                  <Input
                    label="Phone Number"
                    name="customerPhone"
                    value={bookingData.customerPhone}
                    onChange={handleBookingInputChange}
                    placeholder="e.g., +91-9876543210"
                    error={errors.customerPhone}
                  />

                  <Input
                    label="Email"
                    name="customerEmail"
                    type="email"
                    value={bookingData.customerEmail}
                    onChange={handleBookingInputChange}
                    placeholder="e.g., john@example.com"
                    error={errors.customerEmail}
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Company"
                      name="customerCompany"
                      value={bookingData.customerCompany}
                      onChange={handleBookingInputChange}
                      placeholder="e.g., ABC Logistics"
                    />
                  </div>
                </div>
              </div>

              {/* Cargo Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Cargo Information
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Cargo Weight (kg)"
                    name="cargoWeight"
                    type="number"
                    value={bookingData.cargoWeight}
                    onChange={handleBookingInputChange}
                    placeholder="e.g., 500"
                    min="0"
                    max={selectedVehicle?.capacityKg}
                    error={errors.cargoWeight}
                  />

                  <Input
                    label="Cargo Description"
                    name="cargoDescription"
                    value={bookingData.cargoDescription}
                    onChange={handleBookingInputChange}
                    placeholder="e.g., Electronics, Furniture"
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Special Requirements"
                      name="specialRequirements"
                      value={bookingData.specialRequirements}
                      onChange={handleBookingInputChange}
                      placeholder="e.g., Fragile items, Temperature controlled"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        value={bookingData.notes}
                        onChange={handleBookingInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Any additional notes or instructions..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Summary */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Trip Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Route:</span>
                  <span className="font-medium text-primary-600">
                    {searchParams.fromPincode} → {searchParams.toPincode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Start Time:</span>
                  <span className="font-medium text-primary-600">
                    {new Date(searchParams.startTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Duration:</span>
                  <span className="font-medium text-primary-600">
                    {formatDuration(estimatedDuration)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated End Time:</span>
                  <span className="font-medium text-primary-600">
                    {new Date(
                      new Date(searchParams.startTime).getTime() +
                        estimatedDuration * 60 * 60 * 1000
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowBookingModal(false)}
                disabled={bookingLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={bookingLoading}
                disabled={bookingLoading}
              >
                {bookingLoading ? "Creating Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};

export default BookingModal;
