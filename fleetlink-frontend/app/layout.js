import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/Loaders/ProgressBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FleetLink - Logistics Vehicle Booking System",
  description: "Manage and book logistics vehicles for B2B clients",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressBar />
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
