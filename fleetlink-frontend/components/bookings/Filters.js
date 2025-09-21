import React from "react";
import Input from "../Input";
import Dropdown from "../Dropdown";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const Filters = ({ filters, setFilters }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Dropdown
          label="Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          options={statusOptions}
        />

        <Input
          label="Customer ID"
          name="customerId"
          value={filters.customerId}
          onChange={handleFilterChange}
          placeholder="Filter by customer ID"
        />

        <Input
          label="Vehicle ID"
          name="vehicleId"
          value={filters.vehicleId}
          onChange={handleFilterChange}
          placeholder="Filter by vehicle ID"
        />
      </div>
    </div>
  );
};

export default Filters;
