import { supabase, SUPABASE_URL } from '../lib/supabase';
import { Car, ServiceBooking, CustomerInquiry, CustomerReview } from '../types';
import { 
  INITIAL_CARS, 
  INITIAL_BOOKINGS, 
  INITIAL_INQUIRIES, 
  INITIAL_REVIEWS, 
  getStoredCars, 
  saveStoredCars, 
  getStoredBookings, 
  saveStoredBookings, 
  getStoredInquiries, 
  saveStoredInquiries, 
  getStoredReviews, 
  saveStoredReviews 
} from '../data/mockData';

export const SQL_SCHEMA_SCRIPT = `-- Laye Autos Supabase Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/kwanuutfcppjjqkqdclh/sql

-- 1. Cars Table
CREATE TABLE IF NOT EXISTS public.cars (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price_ngn NUMERIC NOT NULL,
  price_usd NUMERIC NOT NULL,
  mileage INTEGER NOT NULL,
  condition TEXT NOT NULL,
  transmission TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  body_type TEXT NOT NULL,
  engine TEXT NOT NULL,
  horsepower INTEGER NOT NULL,
  acceleration TEXT,
  exterior_color TEXT,
  interior_color TEXT,
  vin TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  status TEXT DEFAULT 'Available',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Service Bookings Table
CREATE TABLE IF NOT EXISTS public.service_bookings (
  id TEXT PRIMARY KEY,
  booking_ref TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year INTEGER,
  plate_number TEXT,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_price_ngn NUMERIC NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  pickup_dropoff BOOLEAN DEFAULT false,
  notes TEXT,
  payment_method TEXT DEFAULT 'card',
  payment_status TEXT DEFAULT 'pending',
  amount_paid_ngn NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'confirmed',
  reminders_enabled BOOLEAN DEFAULT true,
  notifications_sent JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customer Inquiries Table
CREATE TABLE IF NOT EXISTS public.customer_inquiries (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  inquiry_type TEXT NOT NULL,
  vehicle_id TEXT,
  vehicle_title TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Customer Reviews Table
CREATE TABLE IF NOT EXISTS public.customer_reviews (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  location TEXT,
  service_or_car TEXT,
  rating INTEGER DEFAULT 5,
  date TEXT,
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Read/Write for demo
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on cars" ON public.cars FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cars" ON public.cars FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cars" ON public.cars FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on cars" ON public.cars FOR DELETE USING (true);

CREATE POLICY "Allow public all on service_bookings" ON public.service_bookings FOR ALL USING (true);
CREATE POLICY "Allow public all on customer_inquiries" ON public.customer_inquiries FOR ALL USING (true);
CREATE POLICY "Allow public all on customer_reviews" ON public.customer_reviews FOR ALL USING (true);
`;

// Map DB snake_case to Car interface
const mapRowToCar = (row: any): Car => ({
  id: row.id,
  title: row.title,
  make: row.make,
  model: row.model,
  year: row.year,
  priceNGN: Number(row.price_ngn),
  priceUSD: Number(row.price_usd),
  mileage: Number(row.mileage),
  condition: row.condition,
  transmission: row.transmission,
  fuelType: row.fuel_type,
  bodyType: row.body_type,
  engine: row.engine,
  horsepower: Number(row.horsepower),
  acceleration: row.acceleration || '',
  exteriorColor: row.exterior_color || '',
  interiorColor: row.interior_color || '',
  vin: row.vin || '',
  features: Array.isArray(row.features) ? row.features : [],
  imageUrl: row.image_url || '',
  status: row.status || 'Available',
  featured: Boolean(row.featured)
});

// Map Car to DB snake_case
const mapCarToRow = (car: Car) => ({
  id: car.id,
  title: car.title,
  make: car.make,
  model: car.model,
  year: car.year,
  price_ngn: car.priceNGN,
  price_usd: car.priceUSD,
  mileage: car.mileage,
  condition: car.condition,
  transmission: car.transmission,
  fuel_type: car.fuelType,
  body_type: car.bodyType,
  engine: car.engine,
  horsepower: car.horsepower,
  acceleration: car.acceleration,
  exterior_color: car.exteriorColor,
  interior_color: car.interiorColor,
  vin: car.vin,
  features: car.features,
  image_url: car.imageUrl,
  status: car.status,
  featured: car.featured || false
});

// Test Connection
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.from('cars').select('id').limit(1);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected to Supabase successfully' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed' };
  }
};

// Cars Service
export const fetchCars = async (): Promise<Car[]> => {
  try {
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped = data.map(mapRowToCar);
      saveStoredCars(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase fetch error, fallback to local storage:', err);
  }
  return getStoredCars();
};

export const syncCarToSupabase = async (car: Car): Promise<void> => {
  try {
    const row = mapCarToRow(car);
    const { error } = await supabase.from('cars').upsert(row);
    if (error) console.warn('Supabase upsert car failed:', error.message);
  } catch (err) {
    console.warn('Supabase car sync error:', err);
  }
};

export const deleteCarFromSupabase = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (error) console.warn('Supabase delete car failed:', error.message);
  } catch (err) {
    console.warn('Supabase delete car error:', err);
  }
};

// Bookings Service
export const fetchBookings = async (): Promise<ServiceBooking[]> => {
  try {
    const { data, error } = await supabase.from('service_bookings').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped: ServiceBooking[] = data.map((row) => ({
        id: row.id,
        bookingRef: row.booking_ref,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        vehicleMake: row.vehicle_make,
        vehicleModel: row.vehicle_model,
        vehicleYear: row.vehicle_year,
        plateNumber: row.plate_number,
        serviceId: row.service_id,
        serviceName: row.service_name,
        servicePriceNGN: Number(row.service_price_ngn),
        bookingDate: row.booking_date,
        timeSlot: row.time_slot,
        pickupDropoff: Boolean(row.pickup_dropoff),
        notes: row.notes,
        paymentMethod: row.payment_method,
        paymentStatus: row.payment_status,
        amountPaidNGN: Number(row.amount_paid_ngn),
        status: row.status,
        remindersEnabled: Boolean(row.reminders_enabled),
        createdAt: row.created_at,
        notificationsSent: Array.isArray(row.notifications_sent) ? row.notifications_sent : []
      }));
      saveStoredBookings(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Supabase bookings fetch error:', err);
  }
  return getStoredBookings();
};

export const syncBookingToSupabase = async (booking: ServiceBooking): Promise<void> => {
  try {
    const { error } = await supabase.from('service_bookings').upsert({
      id: booking.id,
      booking_ref: booking.bookingRef,
      customer_name: booking.customerName,
      customer_email: booking.customerEmail,
      customer_phone: booking.customerPhone,
      vehicle_make: booking.vehicleMake,
      vehicle_model: booking.vehicleModel,
      vehicle_year: booking.vehicleYear,
      plate_number: booking.plateNumber,
      service_id: booking.serviceId,
      service_name: booking.serviceName,
      service_price_ngn: booking.servicePriceNGN,
      booking_date: booking.bookingDate,
      time_slot: booking.timeSlot,
      pickup_dropoff: booking.pickupDropoff,
      notes: booking.notes,
      payment_method: booking.paymentMethod,
      payment_status: booking.paymentStatus,
      amount_paid_ngn: booking.amountPaidNGN,
      status: booking.status,
      reminders_enabled: booking.remindersEnabled,
      notifications_sent: booking.notificationsSent
    });
    if (error) console.warn('Supabase booking sync failed:', error.message);
  } catch (err) {
    console.warn('Supabase booking sync error:', err);
  }
};

// Inquiries Service
export const syncInquiryToSupabase = async (inquiry: CustomerInquiry): Promise<void> => {
  try {
    const { error } = await supabase.from('customer_inquiries').upsert({
      id: inquiry.id,
      customer_name: inquiry.customerName,
      customer_email: inquiry.customerEmail,
      customer_phone: inquiry.customerPhone,
      inquiry_type: inquiry.inquiryType,
      vehicle_id: inquiry.vehicleId,
      vehicle_title: inquiry.vehicleTitle,
      message: inquiry.message,
      status: inquiry.status
    });
    if (error) console.warn('Supabase inquiry sync failed:', error.message);
  } catch (err) {
    console.warn('Supabase inquiry sync error:', err);
  }
};

// Reviews Service
export const syncReviewToSupabase = async (review: CustomerReview): Promise<void> => {
  try {
    const { error } = await supabase.from('customer_reviews').upsert({
      id: review.id,
      customer_name: review.customerName,
      location: review.location,
      service_or_car: review.serviceOrCar,
      rating: review.rating,
      date: review.date,
      comment: review.comment,
      verified: review.verified
    });
    if (error) console.warn('Supabase review sync failed:', error.message);
  } catch (err) {
    console.warn('Supabase review sync error:', err);
  }
};

// Seed / Initial Push All Local Data to Supabase
export const pushAllDataToSupabase = async (): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    const cars = getStoredCars();
    const bookings = getStoredBookings();
    const inquiries = getStoredInquiries();
    const reviews = getStoredReviews();

    let count = 0;

    for (const car of cars) {
      await syncCarToSupabase(car);
      count++;
    }
    for (const booking of bookings) {
      await syncBookingToSupabase(booking);
      count++;
    }
    for (const inq of inquiries) {
      await syncInquiryToSupabase(inq);
      count++;
    }
    for (const rev of reviews) {
      await syncReviewToSupabase(rev);
      count++;
    }

    return { success: true, count };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Push failed' };
  }
};
