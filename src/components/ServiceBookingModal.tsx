import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, Building2, CheckCircle2, ShieldCheck, AlertCircle, Wrench, Car as CarIcon, ArrowRight, ArrowLeft, Printer, BellRing } from 'lucide-react';
import { ServicePackage, ServiceBooking } from '../types';
import { SERVICE_PACKAGES, saveStoredBookings, getStoredBookings } from '../data/mockData';
import { formatCurrencyNGN, formatCurrencyUSD, generateBookingRef } from '../utils/formatters';
import { syncBookingToSupabase } from '../services/supabaseService';

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  currency: 'NGN' | 'USD';
  onBookingComplete?: (booking: ServiceBooking) => void;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedServiceId,
  currency,
  onBookingComplete
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || SERVICE_PACKAGES[0].id
  );
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleMake, setVehicleMake] = useState('Mercedes-Benz');
  const [vehicleModel, setVehicleModel] = useState('E350');
  const [vehicleYear, setVehicleYear] = useState('2022');
  const [plateNumber, setPlateNumber] = useState('APP-892-JJ');
  const [bookingDate, setBookingDate] = useState('2026-10-05');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 11:00 AM');
  const [pickupDropoff, setPickupDropoff] = useState(false);
  const [notes, setNotes] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'pay_at_workshop'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Created Booking state for Step 4
  const [createdBooking, setCreatedBooking] = useState<ServiceBooking | null>(null);

  if (!isOpen) return null;

  const currentService = SERVICE_PACKAGES.find((s) => s.id === selectedServiceId) || SERVICE_PACKAGES[0];
  const servicePrice = currency === 'NGN' ? currentService.priceNGN : currentService.priceUSD;
  const pickupFee = pickupDropoff ? (currency === 'NGN' ? 15000 : 10) : 0;
  const totalPrice = servicePrice + pickupFee;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !vehicleModel) {
      alert('Please fill out all required customer and vehicle fields.');
      return;
    }
    setStep(3);
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    // Simulate secure PCI-DSS tokenization & transaction
    setTimeout(() => {
      setIsProcessingPayment(false);

      const ref = generateBookingRef();
      const newBooking: ServiceBooking = {
        id: `book-${Date.now()}`,
        bookingRef: ref,
        customerName,
        customerEmail: customerEmail || 'customer@layeautos.com',
        customerPhone,
        vehicleMake,
        vehicleModel,
        vehicleYear: Number(vehicleYear) || 2022,
        plateNumber: plateNumber || 'PENDING',
        serviceId: currentService.id,
        serviceName: currentService.name,
        servicePriceNGN: currentService.priceNGN + (pickupDropoff ? 15000 : 0),
        bookingDate,
        timeSlot,
        pickupDropoff,
        notes,
        paymentMethod,
        paymentStatus: paymentMethod === 'pay_at_workshop' ? 'pending' : 'paid_full',
        amountPaidNGN: paymentMethod === 'pay_at_workshop' ? 0 : currentService.priceNGN + (pickupDropoff ? 15000 : 0),
        status: 'confirmed',
        remindersEnabled: true,
        createdAt: new Date().toISOString(),
        notificationsSent: [
          {
            type: 'booking_confirmation',
            timestamp: new Date().toISOString(),
            channel: 'SMS',
            content: `Laye Autos: Booking ${ref} confirmed for ${bookingDate} at ${timeSlot}. Location: Plot 14 VI Lagos. Call +2348022341342.`
          },
          {
            type: '24h_reminder',
            timestamp: new Date(Date.now() + 86400000).toISOString(),
            channel: 'EMAIL',
            content: `Reminder: Your vehicle ${vehicleMake} ${vehicleModel} is scheduled for service tomorrow at Laye Autos.`
          }
        ]
      };

      // Persist to localStorage
      const existing = getStoredBookings();
      saveStoredBookings([newBooking, ...existing]);
      syncBookingToSupabase(newBooking);

      setCreatedBooking(newBooking);
      setStep(4);
      if (onBookingComplete) onBookingComplete(newBooking);
    }, 1200);
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Online Service Booking & Workshop Dispatch</h2>
              <p className="text-xs text-neutral-400">Guaranteed bay reservation & certified OEM parts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper Header */}
        {step < 4 && (
          <div className="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
              }`}>1</span>
              <span className={step === 1 ? 'text-white font-medium' : 'text-neutral-400'}>Service & Vehicle</span>
            </div>
            <div className="h-0.5 w-8 bg-neutral-800" />
            <div className="flex items-center gap-2">
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
              }`}>2</span>
              <span className={step === 2 ? 'text-white font-medium' : 'text-neutral-400'}>Schedule & Valet</span>
            </div>
            <div className="h-0.5 w-8 bg-neutral-800" />
            <div className="flex items-center gap-2">
              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 3 ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
              }`}>3</span>
              <span className={step === 3 ? 'text-white font-medium' : 'text-neutral-400'}>Secure Payment</span>
            </div>
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Service Package & Vehicle Identification */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Select Required Service Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICE_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedServiceId(pkg.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedServiceId === pkg.id
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{pkg.name}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{pkg.description}</div>
                      <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-neutral-800/80">
                        <span className="text-neutral-500 font-mono">{pkg.estimatedDuration}</span>
                        <span className="font-bold text-amber-400 font-mono tabular-nums">
                          {currency === 'NGN' ? formatCurrencyNGN(pkg.priceNGN) : formatCurrencyUSD(pkg.priceUSD)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  <CarIcon className="h-4 w-4 text-amber-400" />
                  <span>Vehicle & Owner Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Vehicle Make *</label>
                    <input
                      type="text"
                      required
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      placeholder="e.g. Mercedes-Benz, Toyota, Audi"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Model & Year *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="Model e.g. GLE 450"
                        className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        value={vehicleYear}
                        onChange={(e) => setVehicleYear(e.target.value)}
                        placeholder="Year"
                        className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Registration / Plate Number</label>
                    <input
                      type="text"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      placeholder="e.g. EKY-481-AA"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Phone Number (For SMS reminders) *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+234 802 000 0000"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Email Address (For Digital Invoice) *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="email@address.com"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!customerName || !customerPhone || !vehicleModel) {
                      alert('Please provide your name, phone number, and vehicle model to proceed.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  <span>Continue to Scheduling</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date, Time & Valet Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Choose Workshop Slot</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Appointment Date *</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Preferred Time Window *</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none cursor-pointer"
                    >
                      <option value="08:30 AM - 10:30 AM">08:30 AM - 10:30 AM (Early Priority)</option>
                      <option value="10:30 AM - 12:30 PM">10:30 AM - 12:30 PM (Mid Morning)</option>
                      <option value="01:30 PM - 03:30 PM">01:30 PM - 03:30 PM (Afternoon)</option>
                      <option value="03:30 PM - 05:30 PM">03:30 PM - 05:30 PM (Late Shift)</option>
                    </select>
                  </div>
                </div>

                {/* Valet Pickup Toggle */}
                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/60 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-white">Flatbed / Valet Vehicle Pickup Service</div>
                    <div className="text-[11px] text-neutral-400">
                      Our certified driver will collect your car from your residence or office in Lagos and return it post-service.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={pickupDropoff}
                      onChange={(e) => setPickupDropoff(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* Additional Technician Notes */}
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Specific Symptoms or Concerns</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe any strange noises, vibrations, check engine warning, or specific inspection points..."
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Automated notification assurance */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-neutral-300">
                <BellRing className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Automated Appointment Alerts:</strong> You will automatically receive booking confirmation, a 24-hour reminder, and real-time bay status alerts via SMS and Email.
                </span>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Service Tier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Secure Payment Processing */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Order Summary Line */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Selected Service</span>
                  <span className="text-white font-medium">{currentService.name}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Vehicle</span>
                  <span className="text-white font-medium">{vehicleMake} {vehicleModel} ({vehicleYear})</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Slot</span>
                  <span className="text-white font-medium">{bookingDate} · {timeSlot}</span>
                </div>
                {pickupDropoff && (
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>Valet Pickup & Return</span>
                    <span className="text-white font-mono">{currency === 'NGN' ? formatCurrencyNGN(15000) : formatCurrencyUSD(10)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-amber-400 font-mono tabular-nums">
                    {currency === 'NGN' ? formatCurrencyNGN(totalPrice) : formatCurrencyUSD(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                  Select Secure Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-amber-400 mb-1" />
                    <div>
                      <div className="text-xs font-bold text-white">Card Payment</div>
                      <div className="text-[10px] text-neutral-400">Visa, Mastercard, Verve</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <Building2 className="h-5 w-5 text-amber-400 mb-1" />
                    <div>
                      <div className="text-xs font-bold text-white">Bank Transfer / USSD</div>
                      <div className="text-[10px] text-neutral-400">Instant Automated Verify</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pay_at_workshop')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'pay_at_workshop'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <Wrench className="h-5 w-5 text-amber-400 mb-1" />
                    <div>
                      <div className="text-xs font-bold text-white">Pay at Workshop</div>
                      <div className="text-[10px] text-neutral-400">Pay POS / Cash on Completion</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Details Form */}
              {paymentMethod === 'card' && (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      256-bit Encrypted Card Checkout
                    </span>
                    <span className="text-[10px] text-neutral-400">PCI-DSS Level 1 Compliant</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder={customerName || 'Full Name on Card'}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                        setCardNumber(val);
                      }}
                      placeholder="5399 2012 3456 7890"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                  <div className="text-xs font-semibold text-white">Bank Account Details (Instant Settlement)</div>
                  <div className="rounded-lg bg-neutral-900 p-3 border border-neutral-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Bank Name</span>
                      <span className="text-white font-semibold">Zenith Bank Plc / GTBank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Account Name</span>
                      <span className="text-white font-semibold">LAYE AUTOS NIGERIA LIMITED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Account Number</span>
                      <span className="text-amber-400 font-mono font-bold text-sm tracking-widest">1014892019</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Payment Reference</span>
                      <span className="text-neutral-300 font-mono">LA-REF-{Math.floor(1000 + Math.random() * 9000)}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Once payment is sent from your banking app or USSD, click the button below to generate your verified booking receipt.
                  </p>
                </div>
              )}

              {paymentMethod === 'pay_at_workshop' && (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2 text-xs text-neutral-300">
                  <div className="font-semibold text-white">Pay Upon Vehicle Inspection & Release</div>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    Your bay slot is secured with zero upfront charge today. You can pay via POS, Corporate Transfer, or Cash upon service completion after your road test inspection.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Schedule</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleProcessPayment}
                  className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying & Securing Booking...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Confirm & Secure Booking ({currency === 'NGN' ? formatCurrencyNGN(totalPrice) : formatCurrencyUSD(totalPrice)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Voucher & Automated Notification Receipt */}
          {step === 4 && createdBooking && (
            <div className="space-y-6 text-center py-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Service Booking Confirmed!</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Your workshop slot is confirmed at Laye Autos Master Workshop.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 max-w-lg mx-auto text-left space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Booking Reference</div>
                    <div className="text-xl font-bold font-mono text-amber-400 tracking-wider">
                      {createdBooking.bookingRef}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      {createdBooking.paymentStatus === 'paid_full' ? 'Paid & Verified' : 'Pay at Workshop'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-neutral-500">Customer</div>
                    <div className="font-semibold text-white">{createdBooking.customerName}</div>
                    <div className="text-neutral-400">{createdBooking.customerPhone}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Vehicle</div>
                    <div className="font-semibold text-white">{createdBooking.vehicleMake} {createdBooking.vehicleModel}</div>
                    <div className="text-neutral-400 font-mono">Plate: {createdBooking.plateNumber}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Appointment Date</div>
                    <div className="font-semibold text-white">{createdBooking.bookingDate}</div>
                    <div className="text-neutral-400">{createdBooking.timeSlot}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Service Bay</div>
                    <div className="font-semibold text-amber-400">{createdBooking.serviceName}</div>
                  </div>
                </div>

                {/* Automated Notification Subscribed */}
                <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-3 text-xs text-neutral-300 flex items-start gap-2.5">
                  <BellRing className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Automated Notifications Active:</strong>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      Confirmation SMS sent to {createdBooking.customerPhone}. You will receive a 24-hour reminder alert before your slot.
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintVoucher}
                  className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <Printer className="h-4 w-4 text-amber-400" />
                  <span>Print Service Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-amber-500 px-6 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
