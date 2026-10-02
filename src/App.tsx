/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InventorySection } from './components/InventorySection';
import { ServicesSection } from './components/ServicesSection';
import { MaintenanceBlogSection } from './components/MaintenanceBlogSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CarDetailModal } from './components/CarDetailModal';
import { ServiceBookingModal } from './components/ServiceBookingModal';
import { AppointmentTrackerModal } from './components/AppointmentTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationToast } from './components/NotificationToast';
import { Car, ServiceBooking } from './types';
import { getStoredCars, CONTACT_DETAILS } from './data/mockData';
import { fetchCars } from './services/supabaseService';
import { Phone, Shield, Wrench, CheckCircle } from 'lucide-react';

export default function App() {
  const [cars, setCars] = useState<Car[]>(getStoredCars());
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inventory');

  // Real-time toast notifications
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    fetchCars().then((latest) => {
      if (latest && latest.length > 0) {
        setCars(latest);
      }
    });
  }, []);

  const refreshData = async () => {
    const latest = await fetchCars();
    setCars(latest);
  };

  const handleTriggerToast = (title: string, message: string) => {
    setToast({ title, message });
  };

  const handleBookServicePackage = (packageId: string) => {
    setPreselectedServiceId(packageId);
    setIsBookingModalOpen(true);
  };

  const handleBookingComplete = (booking: ServiceBooking) => {
    handleTriggerToast(
      'Service Slot Reserved',
      `Booking ${booking.bookingRef} confirmed for ${booking.vehicleMake} ${booking.vehicleModel}. SMS reminder scheduled.`
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Navigation */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenBooking={() => {
          setPreselectedServiceId(undefined);
          setIsBookingModalOpen(true);
        }}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(!isAdminOpen)}
        isAdminOpen={isAdminOpen}
      />

      <main>
        {/* Hero Section */}
        <Hero
          onExploreInventory={() => {
            const el = document.getElementById('inventory');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onBookService={() => {
            setPreselectedServiceId(undefined);
            setIsBookingModalOpen(true);
          }}
          onOpenTracker={() => setIsTrackerOpen(true)}
        />

        {/* Diagnostic & Warranty Assurance Strip */}
        <div className="border-b border-neutral-800 bg-neutral-900/40 py-4 px-4">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-500" />
              <span>Certified Pre-Purchase & Roadworthiness Inspection on Every Car</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-500" />
              <span>Direct OEM Scan Tools for Mercedes-Benz, BMW, Porsche & Toyota</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Instant Automated Appointment Reminders & Live Bay Status</span>
            </div>
            <a
              href={`tel:${CONTACT_DETAILS.phone}`}
              className="flex items-center gap-1.5 font-mono text-amber-400 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Hotline: {CONTACT_DETAILS.phoneDisplay}</span>
            </a>
          </div>
        </div>

        {/* Inventory Section */}
        <InventorySection
          cars={cars}
          onSelectCar={(car) => setSelectedCar(car)}
          currency={currency}
          onToggleCurrency={() => setCurrency(currency === 'NGN' ? 'USD' : 'NGN')}
        />

        {/* Services & Maintenance Section */}
        <ServicesSection
          onBookServicePackage={handleBookServicePackage}
          currency={currency}
        />

        {/* Maintenance Blog Section */}
        <MaintenanceBlogSection />

        {/* Customer Reviews Section */}
        <ReviewsSection
          onReviewAdded={() => {
            handleTriggerToast('Review Published', 'Thank you for your valuable feedback on Laye Autos!');
          }}
        />

        {/* Contact Us Section */}
        <ContactSection
          onInquirySubmitted={() => {
            handleTriggerToast('Message Received', 'Your inquiry has been submitted. A consultant will contact you shortly.');
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(sec) => {
          setActiveSection(sec);
          const el = document.getElementById(sec);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenBooking={() => {
          setPreselectedServiceId(undefined);
          setIsBookingModalOpen(true);
        }}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* MODALS */}

      {/* 1. Vehicle Detail Modal */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          currency={currency}
          onInquirySubmitted={() => {
            handleTriggerToast('Inquiry Received', `Inquiry submitted for ${selectedCar.title}. We will call you shortly.`);
          }}
        />
      )}

      {/* 2. Online Service Scheduling & Payment Modal */}
      {isBookingModalOpen && (
        <ServiceBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          preselectedServiceId={preselectedServiceId}
          currency={currency}
          onBookingComplete={handleBookingComplete}
        />
      )}

      {/* 3. Automated Notification & Appointment Tracker Modal */}
      {isTrackerOpen && (
        <AppointmentTrackerModal
          isOpen={isTrackerOpen}
          onClose={() => setIsTrackerOpen(false)}
          onTriggerToast={handleTriggerToast}
        />
      )}

      {/* 4. Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          onDataChanged={refreshData}
          onTriggerToast={handleTriggerToast}
        />
      )}

      {/* 5. Notification Toast */}
      <NotificationToast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
