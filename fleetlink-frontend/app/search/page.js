import SearchAndBook from "@/components/searchAndBook/SearchAndBook";

export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h1 className="text-3xl font-bold leading-6 text-gray-900">
          Search & Book Vehicles
        </h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Find and book available vehicles for your logistics needs
        </p>
      </div>

      <SearchAndBook />
    </div>
  );
}
