export interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  priceNGN: number;
  priceUSD: number;
  mileage: number;
  condition: 'Brand New' | 'Certified Pre-Owned';
  transmission: 'Automatic' | 'Manual' | 'Dual-Clutch' | 'Direct-Drive EV';
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  bodyType: 'SUV' | 'Sedan' | 'Coupe' | 'Truck';
  engine: string;
  horsepower: number;
  acceleration: string;
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  features: string[];
  imageUrl: string;
  status: 'Available' | 'Reserved' | 'Sold';
  featured?: boolean;
}

export interface ServicePackage {
  id: string;
  name: string;
  category: 'Routine Maintenance' | 'Diagnostics & Mechanical' | 'Electrical & AC' | 'Brakes & Suspension' | 'Detailing';
  description: string;
  priceNGN: number;
  priceUSD: number;
  estimatedDuration: string;
  recommendedInterval: string;
  inclusions: string[];
  popular?: boolean;
}

export interface ServiceBooking {
  id: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  plateNumber: string;
  serviceId: string;
  serviceName: string;
  servicePriceNGN: number;
  bookingDate: string;
  timeSlot: string;
  pickupDropoff: boolean;
  notes?: string;
  paymentMethod: 'card' | 'bank_transfer' | 'pay_at_workshop';
  paymentStatus: 'paid_full' | 'deposit_paid' | 'pending';
  amountPaidNGN: number;
  status: 'confirmed' | 'in_service' | 'ready_for_pickup' | 'completed' | 'cancelled';
  remindersEnabled: boolean;
  createdAt: string;
  notificationsSent: {
    type: 'booking_confirmation' | '24h_reminder' | '2h_arrival' | 'service_update';
    timestamp: string;
    channel: 'SMS' | 'EMAIL';
    content: string;
  }[];
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  inquiryType: 'general' | 'sales_inquiry' | 'test_drive' | 'custom_car_order';
  vehicleId?: string;
  vehicleTitle?: string;
  message: string;
  status: 'new' | 'in_contact' | 'resolved';
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  location: string;
  serviceOrCar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Engine Care' | 'Brake System' | 'Air Conditioning' | 'Tires & Suspension' | 'Preventive';
  excerpt: string;
  content: string[];
  tipsChecklist: string[];
  readTime: string;
  publishedDate: string;
  author: string;
  coverImage: string;
}
