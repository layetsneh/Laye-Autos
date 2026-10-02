import React, { useState } from 'react';
import { 
  Car as CarIcon, 
  Wrench, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  X, 
  Send, 
  DollarSign, 
  Shield, 
  Check, 
  Phone, 
  Mail, 
  BellRing,
  AlertTriangle,
  Database,
  GitBranch,
  RefreshCw,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Car, ServiceBooking, CustomerInquiry } from '../types';
import { 
  getStoredCars, 
  saveStoredCars, 
  getStoredBookings, 
  saveStoredBookings, 
  getStoredInquiries, 
  saveStoredInquiries 
} from '../data/mockData';
import { formatCurrencyNGN, formatMileage } from '../utils/formatters';
import { 
  syncCarToSupabase, 
  deleteCarFromSupabase, 
  syncBookingToSupabase, 
  syncInquiryToSupabase, 
  testSupabaseConnection, 
  pushAllDataToSupabase, 
  SQL_SCHEMA_SCRIPT 
} from '../services/supabaseService';
import { SUPABASE_URL } from '../lib/supabase';

interface AdminDashboardProps {
  onClose: () => void;
  onDataChanged: () => void;
  onTriggerToast: (title: string, message: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onDataChanged,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'inquiries' | 'bookings' | 'cloud'>('inventory');

  // Local state mirrored from storage
  const [cars, setCars] = useState<Car[]>(getStoredCars());
  const [bookings, setBookings] = useState<ServiceBooking[]>(getStoredBookings());
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(getStoredInquiries());

  // Cloud & Supabase status state
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isPushingAll, setIsPushingAll] = useState(false);
  const [pushStatus, setPushStatus] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Add/Edit Car Modal
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Car Form fields
  const [carTitle, setCarTitle] = useState('');
  const [carMake, setCarMake] = useState('Mercedes-Benz');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('2024');
  const [carPriceNGN, setCarPriceNGN] = useState('85000000');
  const [carMileage, setCarMileage] = useState('5000');
  const [carCondition, setCarCondition] = useState<'Brand New' | 'Certified Pre-Owned'>('Certified Pre-Owned');
  const [carTransmission, setCarTransmission] = useState<'Automatic' | 'Manual' | 'Dual-Clutch' | 'Direct-Drive EV'>('Automatic');
  const [carFuelType, setCarFuelType] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'>('Petrol');
  const [carBodyType, setCarBodyType] = useState<'SUV' | 'Sedan' | 'Coupe' | 'Truck'>('SUV');
  const [carEngine, setCarEngine] = useState('3.0L V6 Turbocharged');
  const [carHorsepower, setCarHorsepower] = useState('385');
  const [carImageUrl, setCarImageUrl] = useState('/src/assets/images/laye_luxury_sedan_1790849513464.jpg');
  const [carStatus, setCarStatus] = useState<'Available' | 'Reserved' | 'Sold'>('Available');

  // KPI calculations
  const totalInventoryValue = cars.reduce((sum, c) => sum + (c.status === 'Available' ? c.priceNGN : 0), 0);
  const availableCarsCount = cars.filter((c) => c.status === 'Available').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;

  // Handlers for Inventory
  const handleOpenAddCar = () => {
    setEditingCar(null);
    setCarTitle('');
    setCarMake('Mercedes-Benz');
    setCarModel('');
    setCarYear('2024');
    setCarPriceNGN('95000000');
    setCarMileage('3200');
    setCarCondition('Certified Pre-Owned');
    setCarTransmission('Automatic');
    setCarFuelType('Petrol');
    setCarBodyType('SUV');
    setCarEngine('3.0L Turbo V6');
    setCarHorsepower('380');
    setCarImageUrl('/src/assets/images/laye_premium_suv_1790849524175.jpg');
    setCarStatus('Available');
    setIsCarModalOpen(true);
  };

  const handleOpenEditCar = (car: Car) => {
    setEditingCar(car);
    setCarTitle(car.title);
    setCarMake(car.make);
    setCarModel(car.model);
    setCarYear(String(car.year));
    setCarPriceNGN(String(car.priceNGN));
    setCarMileage(String(car.mileage));
    setCarCondition(car.condition);
    setCarTransmission(car.transmission);
    setCarFuelType(car.fuelType);
    setCarBodyType(car.bodyType);
    setCarEngine(car.engine);
    setCarHorsepower(String(car.horsepower));
    setCarImageUrl(car.imageUrl);
    setCarStatus(car.status);
    setIsCarModalOpen(true);
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carTitle || !carPriceNGN) return;

    const price = Number(carPriceNGN) || 50000000;
    const priceUSD = Math.round(price / 1500);

    if (editingCar) {
      // Update
      const updated = cars.map((c) =>
        c.id === editingCar.id
          ? {
              ...c,
              title: carTitle,
              make: carMake,
              model: carModel || carTitle,
              year: Number(carYear) || 2024,
              priceNGN: price,
              priceUSD,
              mileage: Number(carMileage) || 0,
              condition: carCondition,
              transmission: carTransmission,
              fuelType: carFuelType,
              bodyType: carBodyType,
              engine: carEngine,
              horsepower: Number(carHorsepower) || 300,
              imageUrl: carImageUrl,
              status: carStatus
            }
          : c
      );
      setCars(updated);
      saveStoredCars(updated);
      const updatedItem = updated.find((c) => c.id === editingCar.id);
      if (updatedItem) syncCarToSupabase(updatedItem);
      onTriggerToast('Inventory Updated', `Successfully updated "${carTitle}"`);
    } else {
      // Create new
      const newCar: Car = {
        id: `car-${Date.now()}`,
        title: carTitle,
        make: carMake,
        model: carModel || carTitle,
        year: Number(carYear) || 2024,
        priceNGN: price,
        priceUSD,
        mileage: Number(carMileage) || 0,
        condition: carCondition,
        transmission: carTransmission,
        fuelType: carFuelType,
        bodyType: carBodyType,
        engine: carEngine,
        horsepower: Number(carHorsepower) || 300,
        acceleration: '5.2s (0-100 km/h)',
        exteriorColor: 'Obsidian Black',
        interiorColor: 'Black Leather',
        vin: `LYA${Math.floor(10000000 + Math.random() * 90000000)}`,
        features: ['Certified Pre-Purchase Inspection', 'OEM Factory Specs', 'Full Customs Duty Cleared'],
        imageUrl: carImageUrl,
        status: carStatus,
        featured: false
      };
      const updated = [newCar, ...cars];
      setCars(updated);
      saveStoredCars(updated);
      syncCarToSupabase(newCar);
      onTriggerToast('Vehicle Added', `Added "${carTitle}" to active inventory.`);
    }

    setIsCarModalOpen(false);
    onDataChanged();
  };

  const handleDeleteCar = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from inventory?`)) {
      const updated = cars.filter((c) => c.id !== id);
      setCars(updated);
      saveStoredCars(updated);
      deleteCarFromSupabase(id);
      onDataChanged();
      onTriggerToast('Vehicle Removed', `Removed "${title}" from inventory.`);
    }
  };

  const handleToggleSold = (car: Car) => {
    const nextStatus = car.status === 'Sold' ? 'Available' : 'Sold';
    const updated = cars.map((c) => (c.id === car.id ? { ...c, status: nextStatus as any } : c));
    setCars(updated);
    saveStoredCars(updated);
    const updatedCar = updated.find((c) => c.id === car.id);
    if (updatedCar) syncCarToSupabase(updatedCar);
    onDataChanged();
    onTriggerToast('Status Updated', `Vehicle "${car.title}" marked as ${nextStatus}.`);
  };

  // Handlers for Inquiries
  const handleUpdateInquiryStatus = (id: string, newStatus: 'new' | 'in_contact' | 'resolved') => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq));
    setInquiries(updated);
    saveStoredInquiries(updated);
    const updatedInq = updated.find((i) => i.id === id);
    if (updatedInq) syncInquiryToSupabase(updatedInq);
    onDataChanged();
    onTriggerToast('Inquiry Updated', `Status changed to ${newStatus}.`);
  };

  // Handlers for Bookings & Notifications
  const handleUpdateBookingStatus = (id: string, newStatus: any) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
    setBookings(updated);
    saveStoredBookings(updated);
    const updatedB = updated.find((b) => b.id === id);
    if (updatedB) syncBookingToSupabase(updatedB);
    onDataChanged();
    onTriggerToast('Service Status Updated', `Bay status updated to ${newStatus}.`);
  };

  const handleTestConnection = async () => {
    setIsTestingDb(true);
    setDbStatus(null);
    const res = await testSupabaseConnection();
    setIsTestingDb(false);
    setDbStatus(res);
  };

  const handlePushAllToSupabase = async () => {
    setIsPushingAll(true);
    setPushStatus(null);
    const res = await pushAllDataToSupabase();
    setIsPushingAll(false);
    if (res.success) {
      setPushStatus(`Successfully synchronized ${res.count} records to Supabase.`);
      onTriggerToast('Cloud Synchronized', `Pushed ${res.count} records to Supabase.`);
    } else {
      setPushStatus(`Notice: ${res.error}. If tables are not created yet, copy and execute the SQL schema below.`);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    onTriggerToast('SQL Copied', 'Supabase SQL schema script copied to clipboard.');
  };

  const handleSendAutomatedReminder = (booking: ServiceBooking) => {
    onTriggerToast(
      'Automated Reminder Dispatched',
      `Sent automated 24-hr reminder SMS to ${booking.customerPhone} for ${booking.vehicleMake} ${booking.vehicleModel} (Ref: ${booking.bookingRef})`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Laye Autos Operations Console</h2>
                <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                  Live Management
                </span>
              </div>
              <p className="text-xs text-neutral-400">Inventory updates, inquiries triage & automated service alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-neutral-950/60 border-b border-neutral-800">
          <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/80">
            <div className="text-[11px] text-neutral-400">Available Inventory Value</div>
            <div className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
              {formatCurrencyNGN(totalInventoryValue)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/80">
            <div className="text-[11px] text-neutral-400">Vehicles in Showroom</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-1 tabular-nums">
              {availableCarsCount} Available <span className="text-xs text-neutral-500">({cars.length} Total)</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/80">
            <div className="text-[11px] text-neutral-400">Upcoming Service Bookings</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1 tabular-nums">
              {confirmedBookingsCount} Scheduled
            </div>
          </div>
          <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/80">
            <div className="text-[11px] text-neutral-400">New Inquiries to Contact</div>
            <div className="text-lg font-bold text-blue-400 font-mono mt-1 tabular-nums">
              {newInquiriesCount} Pending
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-6 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer relative ${
                activeTab === 'inventory'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Inventory Management ({cars.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer relative flex items-center gap-1.5 ${
                activeTab === 'inquiries'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Customer Inquiries ({inquiries.length})
              {newInquiriesCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer relative flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Service Bookings & Alerts ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`py-3.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer relative flex items-center gap-1.5 ${
                activeTab === 'cloud'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Database className="h-3.5 w-3.5 text-amber-500" />
              <span>Supabase & GitHub Cloud</span>
            </button>
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={handleOpenAddCar}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vehicle</span>
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Vehicle</th>
                      <th className="p-3">Condition</th>
                      <th className="p-3">Mileage</th>
                      <th className="p-3">Price (NGN)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 bg-neutral-900/40">
                    {cars.map((car) => (
                      <tr key={car.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={car.imageUrl}
                            alt=""
                            className="h-10 w-14 object-cover rounded bg-neutral-950 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-white">{car.title}</div>
                            <div className="text-[11px] text-neutral-500 font-mono">VIN: {car.vin}</div>
                          </div>
                        </td>
                        <td className="p-3">{car.condition}</td>
                        <td className="p-3 font-mono">{formatMileage(car.mileage)}</td>
                        <td className="p-3 font-mono font-semibold text-white tabular-nums">
                          {formatCurrencyNGN(car.priceNGN)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleSold(car)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              car.status === 'Available'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : car.status === 'Reserved'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {car.status} (Click to toggle)
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditCar(car)}
                            className="p-1 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
                            title="Edit Vehicle"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car.id, car.title)}
                            className="p-1 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES MANAGEMENT */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 text-xs">
                  No inquiries recorded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{inq.customerName}</span>
                            <span className="font-mono text-[10px] text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded">
                              {inq.inquiryType.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                            <a href={`tel:${inq.customerPhone}`} className="hover:text-amber-400 flex items-center gap-1 font-mono">
                              <Phone className="h-3 w-3" /> {inq.customerPhone}
                            </a>
                            {inq.customerEmail !== 'N/A' && (
                              <a href={`mailto:${inq.customerEmail}`} className="hover:text-amber-400 flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {inq.customerEmail}
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-neutral-500">Status:</span>
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                            className="rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="new">New (Uncontacted)</option>
                            <option value="in_contact">In Contact</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                      </div>

                      {inq.vehicleTitle && (
                        <div className="text-xs text-amber-400/90 font-medium">
                          Vehicle of Interest: <strong className="text-white">{inq.vehicleTitle}</strong>
                        </div>
                      )}

                      <p className="text-xs text-neutral-300 bg-neutral-900/60 p-3 rounded-lg border border-neutral-800/80">
                        "{inq.message}"
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                        <span>Submitted {new Date(inq.createdAt).toLocaleString()}</span>
                        <a
                          href={`https://wa.me/${inq.customerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(inq.customerName)},%20this%20is%20Laye%20Autos%20following%20up%20on%20your%20inquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Send className="h-3 w-3" />
                          Reply via WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SERVICE BOOKINGS & NOTIFICATIONS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Ref & Vehicle</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Appointment Slot</th>
                      <th className="p-3">Service Tier</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Bay Status</th>
                      <th className="p-3 text-right">Reminder Alert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 bg-neutral-900/40">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-3">
                          <div className="font-mono font-bold text-amber-400">{b.bookingRef}</div>
                          <div className="font-semibold text-white">{b.vehicleMake} {b.vehicleModel}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">Plate: {b.plateNumber}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-white">{b.customerName}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">{b.customerPhone}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{b.bookingDate}</div>
                          <div className="text-[10px] text-neutral-400">{b.timeSlot}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-white line-clamp-1">{b.serviceName}</div>
                          <div className="text-neutral-500 font-mono">{formatCurrencyNGN(b.servicePriceNGN)}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.paymentStatus === 'paid_full'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                            className="rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="in_service">In Bay Service</option>
                            <option value="ready_for_pickup">Ready for Pickup</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleSendAutomatedReminder(b)}
                            className="flex items-center gap-1 rounded bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 text-[11px] text-amber-400 ml-auto cursor-pointer border border-neutral-700"
                            title="Trigger automated SMS reminder"
                          >
                            <BellRing className="h-3 w-3" />
                            <span>Send SMS Alert</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SUPABASE & GITHUB CLOUD INTEGRATION */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              {/* Integration Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Supabase Card */}
                <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Supabase Cloud Database</div>
                        <div className="text-[11px] text-neutral-400 font-mono">PostgreSQL + Realtime Auth</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Configured
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-neutral-500">Project Endpoint:</div>
                    <div className="font-mono text-white bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 break-all select-all">
                      https://kwanuutfcppjjqkqdclh.supabase.co
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={handleTestConnection}
                      disabled={isTestingDb}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white hover:border-neutral-600 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 text-amber-500 ${isTestingDb ? 'animate-spin' : ''}`} />
                      <span>{isTestingDb ? 'Pinging Supabase...' : 'Test Connection'}</span>
                    </button>

                    <a
                      href="https://supabase.com/dashboard/project/kwanuutfcppjjqkqdclh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                    >
                      <span>Supabase Dashboard</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {dbStatus && (
                    <div className={`p-2.5 rounded text-xs border ${
                      dbStatus.success
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}>
                      {dbStatus.message}
                    </div>
                  )}
                </div>

                {/* GitHub Card */}
                <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white">
                        <GitBranch className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">GitHub Repository</div>
                        <div className="text-[11px] text-neutral-400 font-mono">Connected Remote Origin</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                      origin/main
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="text-neutral-500">Remote URL:</div>
                    <div className="font-mono text-white bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 break-all select-all">
                      https://github.com/layetsneh/Laye-Autos.git
                    </div>
                  </div>

                  <div className="pt-1">
                    <a
                      href="https://github.com/layetsneh/Laye-Autos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white transition-colors"
                    >
                      <span>View GitHub Repository</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Data Sync & Table Seeder */}
              <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Data Synchronization</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Synchronize all active inventory, service bookings, and customer inquiries with your Supabase cloud tables.
                    </p>
                  </div>

                  <button
                    onClick={handlePushAllToSupabase}
                    disabled={isPushingAll}
                    className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${isPushingAll ? 'animate-spin' : ''}`} />
                    <span>{isPushingAll ? 'Pushing Data...' : 'Push All Data to Supabase'}</span>
                  </button>
                </div>

                {pushStatus && (
                  <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900 text-xs text-neutral-200">
                    {pushStatus}
                  </div>
                )}

                {/* Schema Setup Helper */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-neutral-300">
                      Supabase SQL Schema Script (Tables: cars, service_bookings, customer_inquiries, customer_reviews)
                    </div>
                    <button
                      onClick={handleCopySql}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 cursor-pointer font-medium"
                    >
                      {copiedSql ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy SQL Schema</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <pre className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-[11px] font-mono text-neutral-300 max-h-56 overflow-y-auto leading-relaxed select-all">
                      {SQL_SCHEMA_SCRIPT}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Add / Edit Car */}
        {isCarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4 my-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-white">
                  {editingCar ? `Edit ${editingCar.title}` : 'Add New Vehicle to Inventory'}
                </h3>
                <button
                  onClick={() => setIsCarModalOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCar} className="space-y-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Vehicle Listing Title *</label>
                  <input
                    type="text"
                    required
                    value={carTitle}
                    onChange={(e) => setCarTitle(e.target.value)}
                    placeholder="e.g. 2024 Mercedes-Benz GLE 450 AMG Line"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Make</label>
                    <select
                      value={carMake}
                      onChange={(e) => setCarMake(e.target.value)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Land Rover">Land Rover</option>
                      <option value="Porsche">Porsche</option>
                      <option value="Audi">Audi</option>
                      <option value="BMW">BMW</option>
                      <option value="Lexus">Lexus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Year</label>
                    <input
                      type="number"
                      value={carYear}
                      onChange={(e) => setCarYear(e.target.value)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Condition</label>
                    <select
                      value={carCondition}
                      onChange={(e) => setCarCondition(e.target.value as any)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Price (NGN) *</label>
                    <input
                      type="number"
                      required
                      value={carPriceNGN}
                      onChange={(e) => setCarPriceNGN(e.target.value)}
                      placeholder="e.g. 85000000"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Mileage (km)</label>
                    <input
                      type="number"
                      value={carMileage}
                      onChange={(e) => setCarMileage(e.target.value)}
                      placeholder="e.g. 4500"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Body Type</label>
                    <select
                      value={carBodyType}
                      onChange={(e) => setCarBodyType(e.target.value as any)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Truck">Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Engine & HP</label>
                    <input
                      type="text"
                      value={carEngine}
                      onChange={(e) => setCarEngine(e.target.value)}
                      placeholder="3.0L V6 Turbo"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Status</label>
                    <select
                      value={carStatus}
                      onChange={(e) => setCarStatus(e.target.value as any)}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Image Showcase Preset</label>
                  <select
                    value={carImageUrl}
                    onChange={(e) => setCarImageUrl(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="/src/assets/images/laye_luxury_sedan_1790849513464.jpg">Midnight Luxury Sedan (Studio)</option>
                    <option value="/src/assets/images/laye_premium_suv_1790849524175.jpg">Pearl White Luxury SUV</option>
                    <option value="/src/assets/images/laye_sport_coupe_1790849536287.jpg">Blue Performance Sports Coupe</option>
                    <option value="/src/assets/images/laye_repair_bay_1790849502054.jpg">Workshop Certified SUV on Hydraulic Lift</option>
                    <option value="/src/assets/images/laye_autos_hero_1790849491050.jpg">Laye Autos Main Showroom</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCarModalOpen(false)}
                    className="rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 cursor-pointer"
                  >
                    {editingCar ? 'Save Changes' : 'Publish Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
