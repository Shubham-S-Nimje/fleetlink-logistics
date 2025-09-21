// Spinner Loader
export const Spinner = ({ size = "md", color = "primary" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colors = {
    primary: "text-primary-500",
    white: "text-white",
    gray: "text-gray-500",
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// main Loader
export const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 py-12">
      <Spinner size="xl" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

// Card Skeleton
export const CardSkeleton = () => {
  return (
    <div className="animate-pulse card">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="mt-6">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

// Skeleton Loader
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 mb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-gray-100 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Inline Loader
export const InlineLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center space-x-2">
      <Spinner size="sm" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

export default {
  Spinner,
  PageLoader,
  CardSkeleton,
  TableSkeleton,
  InlineLoader,
};
