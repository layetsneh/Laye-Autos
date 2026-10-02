import React, { useState } from 'react';
import { X, Search, BellRing, CheckCircle2, Clock, Car, Phone, Mail, ShieldAlert, Send, Sparkles, AlertCircle } from 'lucide-react';
import { ServiceBooking } from '../types';
import { getStoredBookings } from '../data/mockData';
import { formatCurrencyNGN } from '../utils/formatters';

interface AppointmentTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (title: string, message: string) => void;
}

export const AppointmentTrackerModal: React.FC<AppointmentTrackerModalProps> = ({
  isOpen,
  onClose,
  onTriggerToast
}) => {
  const bookings = getStoredBookings();
  const [searchQuery, setSearchQuery] = useState('LA-SRV-8821');
  const [activeBooking, setActiveBooking] = useState<ServiceBooking | null>(
    bookings.find((b) => b.bookingRef === 'LA-SRV-8821') || bookings[0] || null
  );
  const [remindersActive, setRemindersActive] = useState(true);
  const [simulatingSend, setSimulatingSend] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const found = bookings.find(
      (b) =>
        b.bookingRef.toLowerCase() === query ||
        b.customerPhone.replace(/\s+/g, '').includes(query.replace(/\s+/g, '')) ||
        b.customerEmail.toLowerCase().includes(query)
    );

    if (found) {
      setActiveBooking(found);
      setRemindersActive(found.remindersEnabled);
    } else {
      alert(`No active booking found for "${searchQuery}". Please check your booking reference code or telephone number.`);
    }
  };

  const handleSimulateInstantNotification = (channel: 'SMS' | 'EMAIL') => {
    if (!activeBooking) return;
    setSimulatingSend(true);

    setTimeout(() => {
      setSimulatingSend(false);
      const msg =
        channel === 'SMS'
          ? `[SMS to ${activeBooking.customerPhone}]: Laye Autos Alert - Your ${activeBooking.vehicleMake} ${activeBooking.vehicleModel} is scheduled for Oct 3 at 09:00 AM. Bay 04 assigned.`
          : `[Email to ${activeBooking.customerEmail}]: Upcoming Appointment Reminder for ${activeBooking.serviceName} at Laye Autos.`;

      onTriggerToast(
        channel === 'SMS' ? 'Automated SMS Alert Sent' : 'Automated Email Dispatched',
        msg
      );
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Service Appointment & Notification Center</h2>
              <p className="text-xs text-neutral-400">Live vehicle bay status & automated reminder triggers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Booking Reference (e.g. LA-SRV-8821) or Phone..."
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Track Status
            </button>
          </form>

          {/* Quick Click Samples */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <span>Quick test references:</span>
            {bookings.slice(0, 2).map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSearchQuery(b.bookingRef);
                  setActiveBooking(b);
                }}
                className="font-mono text-amber-400 hover:underline cursor-pointer bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800"
              >
                {b.bookingRef}
              </button>
            ))}
          </div>

          {activeBooking ? (
            <div className="space-y-6">
              {/* Current Status Tracker Banner */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-400">BOOKING REFERENCE</div>
                    <div className="text-lg font-bold font-mono text-amber-400">{activeBooking.bookingRef}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-medium text-amber-400 capitalize">
                      <Clock className="h-3 w-3" />
                      Status: {activeBooking.status.replace('_', ' ')}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      Payment: {activeBooking.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-emerald-500" />
                      <div className="text-[11px] font-semibold text-emerald-400">Confirmed</div>
                      <div className="text-[9px] text-neutral-500">Bay reserved</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-amber-500 animate-pulse" />
                      <div className="text-[11px] font-semibold text-amber-400">Inspection</div>
                      <div className="text-[9px] text-neutral-500">OBD-II Scan</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-neutral-800" />
                      <div className="text-[11px] font-medium text-neutral-500">Service Bay</div>
                      <div className="text-[9px] text-neutral-600">Work in progress</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-neutral-800" />
                      <div className="text-[11px] font-medium text-neutral-500">Ready</div>
                      <div className="text-[9px] text-neutral-600">Handover</div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-neutral-800/80 text-xs">
                  <div>
                    <div className="text-neutral-500">Vehicle</div>
                    <div className="font-semibold text-white">{activeBooking.vehicleMake} {activeBooking.vehicleModel} ({activeBooking.vehicleYear})</div>
                    <div className="text-neutral-400 font-mono text-[11px]">Plate: {activeBooking.plateNumber}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Scheduled Time</div>
                    <div className="font-semibold text-white">{activeBooking.bookingDate}</div>
                    <div className="text-amber-400 font-mono text-[11px]">{activeBooking.timeSlot}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Service Tier</div>
                    <div className="font-semibold text-white line-clamp-1">{activeBooking.serviceName}</div>
                    <div className="text-neutral-400 font-mono text-[11px]">{formatCurrencyNGN(activeBooking.servicePriceNGN)}</div>
                  </div>
                </div>
              </div>

              {/* AUTOMATED NOTIFICATION SYSTEM PANEL */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Automated Notification Schedule
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remindersActive}
                      onChange={(e) => setRemindersActive(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Automated Alerts Active</span>
                  </label>
                </div>

                <div className="space-y-3">
                  {/* Alert 1 */}
                  <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Booking Confirmation (SMS & Email)</div>
                        <div className="text-[11px] text-neutral-400">Dispatched upon secure reservation</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Delivered
                    </span>
                  </div>

                  {/* Alert 2 */}
                  <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">24-Hour Prior Reminder (SMS)</div>
                        <div className="text-[11px] text-neutral-400">Scheduled 1 day before appointment date</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      Queued
                    </span>
                  </div>

                  {/* Alert 3 */}
                  <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <Car className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Vehicle Ready for Handover Alert</div>
                        <div className="text-[11px] text-neutral-400">Triggered upon final road test & QA signoff</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">
                      Pending Work
                    </span>
                  </div>
                </div>

                {/* Instant Simulation Action */}
                <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-neutral-400">
                    Test automated alert dispatch to <strong>{activeBooking.customerPhone}</strong>:
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={simulatingSend}
                      onClick={() => handleSimulateInstantNotification('SMS')}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 hover:text-white hover:border-neutral-600 cursor-pointer disabled:opacity-50"
                    >
                      <Phone className="h-3 w-3 text-amber-400" />
                      <span>Test Trigger SMS</span>
                    </button>
                    <button
                      type="button"
                      disabled={simulatingSend}
                      onClick={() => handleSimulateInstantNotification('EMAIL')}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 hover:text-white hover:border-neutral-600 cursor-pointer disabled:opacity-50"
                    >
                      <Mail className="h-3 w-3 text-amber-400" />
                      <span>Test Trigger Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400 text-xs">
              Search by booking reference to track live progress and automated alerts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
