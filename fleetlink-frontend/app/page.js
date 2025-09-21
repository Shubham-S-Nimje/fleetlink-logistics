import Dashboard from "@/components/dashboard/Dashboard";
import { api } from "@/lib/api";

const fetchDashboardData = async () => {
  try {
    const [vehiclesRes, bookingsRes] = await Promise.all([
      api.vehicles.getAll(),
      api.bookings.getAll({ limit: 5 }),
    ]);

    const vehicles = vehiclesRes.data.data;
    const bookings = bookingsRes.data.data;

    return {
      totalVehicles: vehicles.length,
      totalBookings: bookings.length,
      activeBookings: bookings.filter((b) =>
        ["confirmed", "in-progress"].includes(b.bookingStatus)
      ).length,
      completedBookings: bookings.filter((b) => b.bookingStatus === "completed")
        .length,
      recentBookings: bookings.slice(0, 5),
    };
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
  }
};

export default async function Home() {
  const vehiclesData = await fetchDashboardData();
  // console.log(vehiclesData);

  return (
    <Dashboard
      totalVehicles={vehiclesData?.totalVehicles}
      totalBookings={vehiclesData?.totalBookings}
      activeBookings={vehiclesData?.activeBookings}
      completedBookings={vehiclesData?.completedBookings}
      recentBookings={vehiclesData?.recentBookings}
    />
  );
}
