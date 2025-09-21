export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateOnly = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDuration = (hours) => {
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

export const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const calculateEndTime = (startTime, durationHours) => {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return end.toISOString();
};

export const validatePincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};

export const validatePhone = (phone) => {
  return /^\+?[\d\s-]{10,15}$/.test(phone);
};

export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const getStatusColor = (status) => {
  const colors = {
    confirmed: "bg-primary-100 text-primary-800",
    "in-progress": "bg-warning-100 text-warning-800",
    completed: "bg-success-100 text-success-800",
    cancelled: "bg-danger-100 text-danger-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
