"use client";

import { useState } from "react";
import Input from "@/components/Input";
import DatePicker from "@/components/DatePicker";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import Modal from "@/components/Modal";
import { PageLoader, CardSkeleton, InlineLoader } from "@/components/Loader";
import { api } from "@/lib/api";
import BookingModal from "./BookingModal";
import { TriangleAlert } from "lucide-react";

export default function SearchAndBook() {
  const [searchParams, setSearchParams] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [bookingData, setBookingData] = useState({
    customerId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerCompany: "",
    cargoWeight: "",
    cargoDescription: "",
    specialRequirements: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateSearchForm = () => {
    const newErrors = {};

    if (!searchParams.capacityRequired || searchParams.capacityRequired <= 0) {
      newErrors.capacityRequired = "Capacity required must be greater than 0";
    }

    if (
      !searchParams.fromPincode ||
      !/^\d{6}$/.test(searchParams.fromPincode)
    ) {
      newErrors.fromPincode = "From pincode must be a 6-digit number";
    }

    if (!searchParams.toPincode || !/^\d{6}$/.test(searchParams.toPincode)) {
      newErrors.toPincode = "To pincode must be a 6-digit number";
    }

    if (searchParams.fromPincode === searchParams.toPincode) {
      newErrors.toPincode = "To pincode must be different from from pincode";
    }

    if (!searchParams.startTime) {
      newErrors.startTime = "Start time is required";
    } else {
      const startDate = new Date(searchParams.startTime);
      const now = new Date();
      if (startDate <= now) {
        newErrors.startTime = "Start time must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBookingForm = () => {
    const newErrors = {};

    if (!bookingData.customerId.trim()) {
      newErrors.customerId = "Customer ID is required";
    }

    if (
      bookingData.customerPhone &&
      !/^\+?[\d\s-]{10,15}$/.test(bookingData.customerPhone)
    ) {
      newErrors.customerPhone = "Invalid phone number format";
    }

    if (
      bookingData.customerEmail &&
      !/\S+@\S+\.\S+/.test(bookingData.customerEmail)
    ) {
      newErrors.customerEmail = "Invalid email format";
    }

    if (bookingData.cargoWeight) {
      const weight = parseFloat(bookingData.cargoWeight);
      if (weight <= 0) {
        newErrors.cargoWeight = "Cargo weight must be greater than 0";
      } else if (selectedVehicle && weight > selectedVehicle.capacityKg) {
        newErrors.cargoWeight = `Cargo weight cannot exceed vehicle capacity (${selectedVehicle.capacityKg} kg)`;
      }
    }

    return newErrors;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!validateSearchForm()) {
      return;
    }

    setSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setHasSearched(false);

    try {
      const response = await api.vehicles.getAvailable({
        capacityRequired: parseInt(searchParams.capacityRequired),
        fromPincode: searchParams.fromPincode,
        toPincode: searchParams.toPincode,
        startTime: new Date(searchParams.startTime).toISOString(),
      });

      if (response.data.success) {
        setSearchResults(response.data.data || []);
        setEstimatedDuration(response.data.estimatedRideDurationHours || 0);
        setHasSearched(true);
      }
    } catch (err) {
      console.error("Error searching vehicles:", err);
      setSearchError(
        err.response?.data?.message ||
          "Failed to search vehicles. Please try again."
      );
    } finally {
      setSearching(false);
    }
  };

  const handleBookNow = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBookingModal(true);
    setBookingError(null);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateBookingForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const bookingPayload = {
        vehicleId: selectedVehicle._id,
        customerId: bookingData.customerId.trim(),
        fromPincode: searchParams.fromPincode,
        toPincode: searchParams.toPincode,
        startTime: new Date(searchParams.startTime).toISOString(),
        customerInfo: {
          name: bookingData.customerName.trim() || undefined,
          phone: bookingData.customerPhone.trim() || undefined,
          email: bookingData.customerEmail.trim() || undefined,
          company: bookingData.customerCompany.trim() || undefined,
        },
        cargoDetails: {
          weight: bookingData.cargoWeight
            ? parseFloat(bookingData.cargoWeight)
            : undefined,
          description: bookingData.cargoDescription.trim() || undefined,
          specialRequirements:
            bookingData.specialRequirements.trim() || undefined,
        },
        notes: bookingData.notes.trim() || undefined,
      };

      const response = await api.bookings.create(bookingPayload);

      if (response.data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setShowBookingModal(false);
          // Refresh
          handleSearch({ preventDefault: () => {} });
          // Reset booking
          setBookingData({
            customerId: "",
            customerName: "",
            customerPhone: "",
            customerEmail: "",
            customerCompany: "",
            cargoWeight: "",
            cargoDescription: "",
            specialRequirements: "",
            notes: "",
          });
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      if (err.response?.status === 409) {
        setBookingError(
          "Vehicle is no longer available for the selected time slot. Please search again."
        );
      } else {
        setBookingError(
          err.response?.data?.message ||
            "Failed to create booking. Please try again."
        );
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDuration = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else if (hours === 1) {
      return "1 hour";
    } else {
      const wholeHours = Math.floor(hours);
      const minutes = Math.round((hours - wholeHours) * 60);
      if (minutes === 0) {
        return `${wholeHours} hours`;
      } else {
        return `${wholeHours}h ${minutes}m`;
      }
    }
  };

  return (
    <div>
      <div className="card mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Search Criteria
        </h3>

        {searchError && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Search Error"
              message={searchError}
              dismissible
              onClose={() => setSearchError(null)}
            />
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              label="Capacity Required (kg)"
              name="capacityRequired"
              type="number"
              value={searchParams.capacityRequired}
              onChange={handleSearchInputChange}
              placeholder="e.g., 1000"
              required
              min="1"
              error={errors.capacityRequired}
            />

            <Input
              label="From Pincode"
              name="fromPincode"
              value={searchParams.fromPincode}
              onChange={handleSearchInputChange}
              placeholder="e.g., 400001"
              required
              pattern="\d{6}"
              maxLength="6"
              error={errors.fromPincode}
            />

            <Input
              label="To Pincode"
              name="toPincode"
              value={searchParams.toPincode}
              onChange={handleSearchInputChange}
              placeholder="e.g., 411001"
              required
              pattern="\d{6}"
              maxLength="6"
              error={errors.toPincode}
            />

            <DatePicker
              label="Start Date & Time"
              name="startTime"
              value={searchParams.startTime}
              onChange={handleSearchInputChange}
              includeTime
              required
              min={new Date().toISOString().slice(0, 16)}
              error={errors.startTime}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={searching}
              disabled={searching}
              className="min-w-32"
            >
              {searching ? "Searching..." : "Search Vehicles"}
            </Button>
          </div>
        </form>
      </div>

      {searching && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {hasSearched && !searching && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results ({searchResults.length} vehicles found)
            </h3>
            {estimatedDuration > 0 && (
              <div className="text-sm text-gray-600">
                Estimated duration:{" "}
                <span className="font-medium text-primary-600">
                  {formatDuration(estimatedDuration)}
                </span>
              </div>
            )}
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 card">
              <TriangleAlert />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No vehicles available
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No vehicles match your search criteria. Try adjusting your
                requirements.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((vehicle) => (
                <div
                  key={vehicle._id}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      {vehicle.name}
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Available
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Capacity:</span>
                      <span className="font-medium text-primary-600">
                        {vehicle.capacityKg} kg
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium capitalize text-primary-600">
                        {vehicle.vehicleType}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tyres:</span>
                      <span className="font-medium text-primary-600">
                        {vehicle.tyres}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fuel:</span>
                      <span className="font-medium capitalize text-primary-600">
                        {vehicle.fuelType}
                      </span>
                    </div>
                    {vehicle.registrationNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Registration:</span>
                        <span className="font-medium text-primary-600">
                          {vehicle.registrationNumber}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium text-primary-600">
                        {formatDuration(estimatedDuration)}
                      </span>
                    </div>
                    {vehicle.realisticRideDurationHours && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Realistic Duration:
                        </span>
                        <span className="font-medium text-primary-600">
                          {formatDuration(vehicle.realisticRideDurationHours)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleBookNow(vehicle)}
                    variant="primary"
                    className="w-full"
                  >
                    Book Now
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <BookingModal
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        bookingSuccess={bookingSuccess}
        selectedVehicle={selectedVehicle}
        bookingError={bookingError}
        setBookingError={setBookingError}
        bookingData={bookingData}
        searchParams={searchParams}
        bookingLoading={bookingLoading}
        handleBookingSubmit={handleBookingSubmit}
        handleBookingInputChange={handleBookingInputChange}
        estimatedDuration={estimatedDuration}
        errors={errors}
      />
    </div>
  );
}
