"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import Alert from "@/components/Alert";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { api } from "@/lib/api";

export default function AddVehicle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Basic data
    name: "",
    capacityKg: "",
    tyres: "",
    vehicleType: "truck",
    fuelType: "diesel",
    registrationNumber: "",

    // Driver data
    driverName: "",
    driverPhone: "",
    driverLicenseNumber: "",

    // Maintenance data
    lastService: "",
    nextService: "",
    mileage: "",

    // Insurance data
    insuranceProvider: "",
    policyNumber: "",
    insuranceExpiryDate: "",

    // Location data
    currentPincode: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});

  const vehicleTypeOptions = [
    { value: "truck", label: "Truck" },
    { value: "van", label: "Van" },
    { value: "pickup", label: "Pickup" },
    { value: "trailer", label: "Trailer" },
  ];

  const fuelTypeOptions = [
    { value: "diesel", label: "Diesel" },
    { value: "petrol", label: "Petrol" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = "Vehicle name is required";
    }

    if (!formData.capacityKg || formData.capacityKg <= 0) {
      newErrors.capacityKg = "Capacity must be greater than 0";
    }

    if (!formData.tyres || formData.tyres < 2) {
      newErrors.tyres = "Vehicle must have at least 2 tyres";
    }

    // Optional field validations
    if (
      formData.driverPhone &&
      !/^\+?[\d\s-]{10,15}$/.test(formData.driverPhone)
    ) {
      newErrors.driverPhone = "Invalid phone number format";
    }

    if (formData.currentPincode && !/^\d{6}$/.test(formData.currentPincode)) {
      newErrors.currentPincode = "Pincode must be 6 digits";
    }

    if (formData.mileage && formData.mileage < 0) {
      newErrors.mileage = "Mileage cannot be negative";
    }

    if (
      formData.latitude &&
      (formData.latitude < -90 || formData.latitude > 90)
    ) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }

    if (
      formData.longitude &&
      (formData.longitude < -180 || formData.longitude > 180)
    ) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const vehicleData = {
        name: formData.name.trim(),
        capacityKg: parseInt(formData.capacityKg),
        tyres: parseInt(formData.tyres),
        vehicleType: formData.vehicleType,
        fuelType: formData.fuelType,
        registrationNumber: formData.registrationNumber.trim() || undefined,
      };

      if (
        formData.driverName ||
        formData.driverPhone ||
        formData.driverLicenseNumber
      ) {
        vehicleData.driverInfo = {
          name: formData.driverName.trim() || undefined,
          phone: formData.driverPhone.trim() || undefined,
          licenseNumber: formData.driverLicenseNumber.trim() || undefined,
        };
      }

      if (formData.lastService || formData.nextService || formData.mileage) {
        vehicleData.maintenanceSchedule = {
          lastService: formData.lastService || undefined,
          nextService: formData.nextService || undefined,
          mileage: formData.mileage ? parseFloat(formData.mileage) : undefined,
        };
      }

      if (
        formData.insuranceProvider ||
        formData.policyNumber ||
        formData.insuranceExpiryDate
      ) {
        vehicleData.insuranceInfo = {
          provider: formData.insuranceProvider.trim() || undefined,
          policyNumber: formData.policyNumber.trim() || undefined,
          expiryDate: formData.insuranceExpiryDate || undefined,
        };
      }

      if (formData.currentPincode || formData.latitude || formData.longitude) {
        vehicleData.location = {
          currentPincode: formData.currentPincode.trim() || undefined,
          latitude: formData.latitude
            ? parseFloat(formData.latitude)
            : undefined,
          longitude: formData.longitude
            ? parseFloat(formData.longitude)
            : undefined,
        };
      }

      const response = await api.vehicles.add(vehicleData);

      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: "",
          capacityKg: "",
          tyres: "",
          vehicleType: "truck",
          fuelType: "diesel",
          registrationNumber: "",
          driverName: "",
          driverPhone: "",
          driverLicenseNumber: "",
          lastService: "",
          nextService: "",
          mileage: "",
          insuranceProvider: "",
          policyNumber: "",
          insuranceExpiryDate: "",
          currentPincode: "",
          latitude: "",
          longitude: "",
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err) {
      console.error("Error adding vehicle:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add vehicle. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

      {success && (
        <div className="mb-6">
          <Alert
            type="success"
            title="Success"
            message="Vehicle added successfully! Redirecting..."
            autoClose
            duration={2000}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Vehicle Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Truck-001"
              required
              error={errors.name}
            />

            <Input
              label="Capacity (kg)"
              name="capacityKg"
              type="number"
              value={formData.capacityKg}
              onChange={handleInputChange}
              placeholder="e.g., 5000"
              required
              min="1"
              error={errors.capacityKg}
            />

            <Input
              label="Number of Tyres"
              name="tyres"
              type="number"
              value={formData.tyres}
              onChange={handleInputChange}
              placeholder="e.g., 6"
              required
              min="2"
              error={errors.tyres}
            />

            <Dropdown
              label="Vehicle Type"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              options={vehicleTypeOptions}
              required
            />

            <Dropdown
              label="Fuel Type"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              options={fuelTypeOptions}
              required
            />

            <Input
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="e.g., MH01AB1234"
              error={errors.registrationNumber}
            />
          </div>
        </div>

        {/* Driver */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Driver Information
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={handleInputChange}
              placeholder="e.g., John Doe"
            />

            <Input
              label="Driver Phone"
              name="driverPhone"
              value={formData.driverPhone}
              onChange={handleInputChange}
              placeholder="e.g., +91-9876543210"
              error={errors.driverPhone}
            />

            <Input
              label="License Number"
              name="driverLicenseNumber"
              value={formData.driverLicenseNumber}
              onChange={handleInputChange}
              placeholder="e.g., MH0120110012345"
            />
          </div>
        </div>

        {/* Maintenance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Maintenance Information
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DatePicker
              label="Last Service Date"
              name="lastService"
              value={formData.lastService}
              onChange={handleInputChange}
            />

            <DatePicker
              label="Next Service Date"
              name="nextService"
              value={formData.nextService}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
            />

            <Input
              label="Current Mileage (km)"
              name="mileage"
              type="number"
              value={formData.mileage}
              onChange={handleInputChange}
              placeholder="e.g., 15000"
              min="0"
              error={errors.mileage}
            />
          </div>
        </div>

        {/* Insurance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Insurance Information
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Insurance Provider"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleInputChange}
              placeholder="e.g., HDFC ERGO"
            />

            <Input
              label="Policy Number"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleInputChange}
              placeholder="e.g., POL123456789"
            />

            <DatePicker
              label="Insurance Expiry Date"
              name="insuranceExpiryDate"
              value={formData.insuranceExpiryDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Location  */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            Location Information
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Input
              label="Current Pincode"
              name="currentPincode"
              value={formData.currentPincode}
              onChange={handleInputChange}
              placeholder="e.g., 400001"
              pattern="\d{6}"
              error={errors.currentPincode}
            />

            <Input
              label="Latitude"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleInputChange}
              placeholder="e.g., 19.0760"
              min="-90"
              max="90"
              error={errors.latitude}
            />

            <Input
              label="Longitude"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleInputChange}
              placeholder="e.g., 72.8777"
              min="-180"
              max="180"
              error={errors.longitude}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Add Vehicle
          </Button>
        </div>
      </form>
    </div>
  );
}
