import { Ban, Check, Info, TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";

const Alert = ({
  type = "info",
  title,
  message,
  dismissible = false,
  autoClose = false,
  duration = 5000,
  onClose,
  className = "",
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const variants = {
    success: {
      container: "bg-success-100 border-success-500 text-success-700",
      icon: <Check />,
    },
    error: {
      container: "bg-danger-100 border-danger-500 text-danger-700",
      icon: <Ban />,
    },
    warning: {
      container: "bg-warning-100 border-warning-500 text-warning-700",
      icon: <TriangleAlert />,
    },
    info: {
      container: "bg-primary-100 border-primary-500 text-primary-700",
      icon: <Info />,
    },
  };

  const variant = variants[type] || variants.info;

  return (
    <div
      className={`rounded-md border-l-4 p-4 ${variant.container} ${className}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">{variant.icon}</div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={`text-sm ${title ? "mt-1" : ""}`}>{message}</div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={handleClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-opacity-20 hover:bg-gray-600`}
              >
                <span className="sr-only">Dismiss</span>
                <TriangleAlert />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
