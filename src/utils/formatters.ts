export const formatCurrencyNGN = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatCurrencyUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatMileage = (km: number): string => {
  return new Intl.NumberFormat('en-US').format(km) + ' km';
};

export const generateBookingRef = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `LA-SRV-${randomNum}`;
};
