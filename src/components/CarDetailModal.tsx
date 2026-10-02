import React, { useState } from 'react';
import { X, Check, Calendar, Phone, MessageSquare, Calculator, ShieldCheck, Gauge, Zap, Fuel, Activity } from 'lucide-react';
import { Car, CustomerInquiry } from '../types';
import { formatCurrencyNGN, formatCurrencyUSD, formatMileage } from '../utils/formatters';
import { CONTACT_DETAILS, saveStoredInquiries, getStoredInquiries } from '../data/mockData';
import { syncInquiryToSupabase } from '../services/supabaseService';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  currency: 'NGN' | 'USD';
  onInquirySubmitted?: () => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  currency,
  onInquirySubmitted
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'finance' | 'inquiry'>('specs');
  
  // Finance calculator state
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [loanTermMonths, setLoanTermMonths] = useState(24);
  const [interestRatePct, setInterestRatePct] = useState(15); // typical auto finance rate

  // Test drive / inquiry form state
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<'test_drive' | 'sales_inquiry'>('test_drive');
  const [custMessage, setCustMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!car) return null;

  // Finance calculation
  const carPrice = currency === 'NGN' ? car.priceNGN : car.priceUSD;
  const downPayment = (carPrice * downPaymentPct) / 100;
  const principal = carPrice - downPayment;
  const monthlyRate = interestRatePct / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
        (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
      : principal / loanTermMonths;

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now()}`,
      customerName: custName,
      customerEmail: custEmail || 'N/A',
      customerPhone: custPhone,
      inquiryType: inquiryType,
      vehicleId: car.id,
      vehicleTitle: `${car.year} ${car.title}`,
      message: custMessage || `Interested in ${car.title}. Please provide details.`,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const currentInquiries = getStoredInquiries();
    saveStoredInquiries([newInquiry, ...currentInquiries]);
    syncInquiryToSupabase(newInquiry);
    setSubmitted(true);
    if (onInquirySubmitted) onInquirySubmitted();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Laye Autos, I am interested in purchasing or test driving the ${car.year} ${car.title} listed on your website (VIN: ${car.vin}). Please share more details.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-8">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span>{car.year}</span>
              <span>·</span>
              <span>{car.condition}</span>
              <span>·</span>
              <span className="text-amber-400">VIN: {car.vin}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{car.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Main Showcase Image & Quick Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 relative">
              <img
                src={car.imageUrl}
                alt={car.title}
                className="w-full h-64 sm:h-80 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-medium text-amber-400 border border-neutral-800">
                {car.condition}
              </div>
              <div className="absolute bottom-3 right-3 bg-neutral-950/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-white border border-neutral-800 tabular-nums">
                {currency === 'NGN' ? formatCurrencyNGN(car.priceNGN) : formatCurrencyUSD(car.priceUSD)}
              </div>
            </div>

            {/* Quick Metrics & Highlights */}
            <div className="md:col-span-5 space-y-3">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Performance Profile</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/60">
                    <div className="text-neutral-500 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" />
                      Horsepower
                    </div>
                    <div className="text-sm font-semibold text-white mt-1 tabular-nums">{car.horsepower} HP</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/60">
                    <div className="text-neutral-500 flex items-center gap-1">
                      <Activity className="h-3 w-3 text-amber-400" />
                      0 - 100 km/h
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">{car.acceleration}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/60">
                    <div className="text-neutral-500 flex items-center gap-1">
                      <Gauge className="h-3 w-3 text-amber-400" />
                      Mileage
                    </div>
                    <div className="text-sm font-semibold text-white mt-1 tabular-nums">{formatMileage(car.mileage)}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/60">
                    <div className="text-neutral-500 flex items-center gap-1">
                      <Fuel className="h-3 w-3 text-amber-400" />
                      Fuel
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">{car.fuelType}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span>Transmission: <strong className="text-neutral-200">{car.transmission}</strong></span>
                  <span>Exterior: <strong className="text-neutral-200">{car.exteriorColor}</strong></span>
                </div>
              </div>

              {/* Direct Quick Action CTAs */}
              <div className="flex flex-col gap-2">
                <a
                  href={`https://wa.me/2348022341342?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat with Consultant on WhatsApp
                </a>
                <a
                  href={`tel:${CONTACT_DETAILS.phone}`}
                  className="flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-amber-400" />
                  Call Sales Desk: {CONTACT_DETAILS.phoneDisplay}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-neutral-800 flex items-center gap-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
                activeTab === 'specs'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Full Specifications & Equipment
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative flex items-center gap-1.5 ${
                activeTab === 'finance'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calculator className="h-4 w-4" />
              Financing Estimator
            </button>
            <button
              onClick={() => setActiveTab('inquiry')}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative flex items-center gap-1.5 ${
                activeTab === 'inquiry'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Schedule Test Drive / Offer
            </button>
          </div>

          {/* Tab 1: Specifications */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="text-xs font-semibold text-neutral-400">Powertrain & Mechanical</div>
                  <ul className="text-xs space-y-1.5 text-neutral-300">
                    <li className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-500">Engine</span>
                      <span className="font-medium text-white">{car.engine}</span>
                    </li>
                    <li className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-500">Horsepower</span>
                      <span className="font-medium text-white tabular-nums">{car.horsepower} HP</span>
                    </li>
                    <li className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-500">Transmission</span>
                      <span className="font-medium text-white">{car.transmission}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-neutral-500">Drivetrain</span>
                      <span className="font-medium text-white">All-Wheel / Rear-Wheel Drive</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="text-xs font-semibold text-neutral-400">Trim & Comfort Details</div>
                  <ul className="text-xs space-y-1.5 text-neutral-300">
                    <li className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-500">Interior Color</span>
                      <span className="font-medium text-white">{car.interiorColor}</span>
                    </li>
                    <li className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-500">Exterior Color</span>
                      <span className="font-medium text-white">{car.exteriorColor}</span>
                    </li>
                    <li className="flex justify-between border-b border-neutral-900 pb-1">
                      <span className="text-neutral-500">Body Configuration</span>
                      <span className="font-medium text-white">{car.bodyType}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-neutral-500">Customs Clearance</span>
                      <span className="font-medium text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Fully Duty Paid & Clean Title
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Equipment & Features list */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="text-xs font-semibold text-neutral-400 mb-3">Key Factory Options & Technology</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                      <Check className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Finance Calculator */}
          {activeTab === 'finance' && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <div className="text-xs text-neutral-400">Total Purchase Price</div>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {currency === 'NGN' ? formatCurrencyNGN(car.priceNGN) : formatCurrencyUSD(car.priceUSD)}
                  </div>
                </div>
                <div className="rounded-lg bg-neutral-900 p-3 border border-neutral-800 text-right sm:text-left">
                  <div className="text-xs text-amber-400 font-medium">Estimated Monthly Payment</div>
                  <div className="text-2xl font-bold text-amber-400 tabular-nums">
                    {currency === 'NGN' ? formatCurrencyNGN(monthlyPayment) : formatCurrencyUSD(monthlyPayment)}
                    <span className="text-xs text-neutral-400 font-normal"> / month</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Down Payment */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Down Payment ({downPaymentPct}%)</span>
                    <span className="text-white font-mono tabular-nums">
                      {currency === 'NGN' ? formatCurrencyNGN(downPayment) : formatCurrencyUSD(downPayment)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>10%</span>
                    <span>30%</span>
                    <span>60%</span>
                  </div>
                </div>

                {/* Term */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Tenure</span>
                    <span className="text-white font-mono">{loanTermMonths} Months ({loanTermMonths / 12} Yrs)</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="48"
                    step="12"
                    value={loanTermMonths}
                    onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>12m</span>
                    <span>24m</span>
                    <span>36m</span>
                    <span>48m</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Interest Rate (Annual)</span>
                    <span className="text-white font-mono">{interestRatePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="22"
                    step="1"
                    value={interestRatePct}
                    onChange={(e) => setInterestRatePct(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>8%</span>
                    <span>15%</span>
                    <span>22%</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-900">
                * Note: Estimates are illustrative based on standard bank and auto financier rates in Nigeria. Final terms are subject to credit assessment and insurance.
              </div>
            </div>
          )}

          {/* Tab 3: Inquiry & Test Drive */}
          {activeTab === 'inquiry' && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Inquiry Submitted Successfully!</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    Thank you, {custName}. A senior sales consultant from Laye Autos will contact you at <strong className="text-neutral-200">{custPhone}</strong> within 30 minutes to confirm arrangements.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-amber-400 underline hover:text-amber-300 pt-2 cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-neutral-800 pb-3">
                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="radio"
                        name="inqType"
                        checked={inquiryType === 'test_drive'}
                        onChange={() => setInquiryType('test_drive')}
                        className="accent-amber-500"
                      />
                      <span>Schedule VIP Test Drive</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="radio"
                        name="inqType"
                        checked={inquiryType === 'sales_inquiry'}
                        onChange={() => setInquiryType('sales_inquiry')}
                        className="accent-amber-500"
                      />
                      <span>Submit Purchase Offer / Pricing Inquiry</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="e.g. Babatunde Adeyemi"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Phone Number (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+234 802 000 0000"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Custom Notes / Preferred Time</label>
                    <textarea
                      rows={3}
                      value={custMessage}
                      onChange={(e) => setCustMessage(e.target.value)}
                      placeholder={`I am interested in this ${car.title}. Please confirm availability for a test drive at Victoria Island showroom.`}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-amber-500 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Submit Vehicle Inquiry
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
