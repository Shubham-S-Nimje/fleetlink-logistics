const calculateRideDuration = (fromPincode, toPincode) => {
  const duration = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
  return duration || 1;
};

const calculateRealisticRideDuration = (
  fromPincode,
  toPincode,
  vehicleType = "truck"
) => {
  const from = parseInt(fromPincode);
  const to = parseInt(toPincode);

  // Basic distance calculation
  const baseDistance = Math.abs(to - from);

  let distanceKm;
  if (baseDistance < 10) {
    distanceKm = baseDistance * 15; // Local
  } else if (baseDistance < 100) {
    distanceKm = baseDistance * 8; // State
  } else {
    distanceKm = baseDistance * 5; // Inter state
  }

  const vehicleSpeeds = {
    truck: 50,
    van: 60,
    pickup: 55,
    trailer: 45,
  };

  const avgSpeed = vehicleSpeeds[vehicleType] || 50;

  const bufferFactor = 1.5;

  const duration = (distanceKm / avgSpeed) * bufferFactor;

  return Math.max(1, Math.min(48, Math.round(duration)));
};

const checkTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

const isValidPincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};

module.exports = {
  calculateRideDuration,
  calculateRealisticRideDuration,
  checkTimeOverlap,
  isValidPincode,
};
