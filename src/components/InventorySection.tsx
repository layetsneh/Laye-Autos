import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, ChevronRight, Gauge, Zap, Check } from 'lucide-react';
import { Car } from '../types';
import { formatCurrencyNGN, formatCurrencyUSD, formatMileage } from '../utils/formatters';

interface InventorySectionProps {
  cars: Car[];
  onSelectCar: (car: Car) => void;
  currency: 'NGN' | 'USD';
  onToggleCurrency: () => void;
}

export const InventorySection: React.FC<InventorySectionProps> = ({
  cars,
  onSelectCar,
  currency,
  onToggleCurrency
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<'All' | 'Brand New' | 'Certified Pre-Owned'>('All');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('All');
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'year-desc'>('featured');

  // Extract unique makes and body types
  const makes = useMemo(() => {
    const list = Array.from(new Set(cars.map((c) => c.make)));
    return ['All', ...list];
  }, [cars]);

  const bodyTypes = ['All', 'SUV', 'Sedan', 'Coupe'];

  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        const matchesSearch =
          car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCondition =
          selectedCondition === 'All' || car.condition === selectedCondition;

        const matchesBody =
          selectedBodyType === 'All' || car.bodyType === selectedBodyType;

        const matchesMake =
          selectedMake === 'All' || car.make === selectedMake;

        return matchesSearch && matchesCondition && matchesBody && matchesMake;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceNGN - b.priceNGN;
        if (sortBy === 'price-desc') return b.priceNGN - a.priceNGN;
        if (sortBy === 'year-desc') return b.year - a.year;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [cars, searchTerm, selectedCondition, selectedBodyType, selectedMake, sortBy]);

  return (
    <section id="inventory" className="py-16 sm:py-20 bg-neutral-950 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-800">
          <div>
            <div className="text-xs font-mono text-amber-500 uppercase tracking-wider">
              SHOWROOM & INVENTORY
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Curated Luxury & Certified Vehicles
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Every vehicle in our showroom undergoes a meticulous 150-point mechanical & electronic certification. Complete customs documentation and road-readiness guaranteed.
            </p>
          </div>

          {/* Currency Toggle & Quick Counts */}
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-400">
              Showing <span className="font-mono text-white font-semibold">{filteredCars.length}</span> of {cars.length} cars
            </div>
            <div className="flex items-center rounded-lg border border-neutral-700 bg-neutral-900 p-1 text-xs">
              <button
                onClick={() => currency !== 'NGN' && onToggleCurrency()}
                className={`px-3 py-1 rounded font-mono font-medium transition-colors cursor-pointer ${
                  currency === 'NGN' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                NGN (₦)
              </button>
              <button
                onClick={() => currency !== 'USD' && onToggleCurrency()}
                className={`px-3 py-1 rounded font-mono font-medium transition-colors cursor-pointer ${
                  currency === 'USD' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="py-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search make, model, or year..."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/90 pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Condition Filter */}
            <div className="lg:col-span-3 flex rounded-lg border border-neutral-800 bg-neutral-900/90 p-1 text-xs">
              {(['All', 'Brand New', 'Certified Pre-Owned'] as const).map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`flex-1 py-1.5 px-2 text-center rounded transition-colors whitespace-nowrap cursor-pointer text-[11px] font-medium ${
                    selectedCondition === cond
                      ? 'bg-neutral-800 text-white font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cond === 'Certified Pre-Owned' ? 'Pre-Owned' : cond}
                </button>
              ))}
            </div>

            {/* Make Dropdown */}
            <div className="lg:col-span-2">
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-2.5 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {makes.map((m) => (
                  <option key={m} value={m}>
                    Make: {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Type Dropdown */}
            <div className="lg:col-span-2">
              <select
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/90 px-3 py-2.5 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {bodyTypes.map((b) => (
                  <option key={b} value={b}>
                    Body: {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/90 px-2 py-2.5 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort</option>
                <option value="price-asc">Price: Low-High</option>
                <option value="price-desc">Price: High-Low</option>
                <option value="year-desc">Year: Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredCars.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center my-6">
            <p className="text-neutral-400 text-sm">No vehicles found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCondition('All');
                setSelectedBodyType('All');
                setSelectedMake('All');
              }}
              className="mt-3 text-xs text-amber-400 underline hover:text-amber-300 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredCars.map((car) => {
              const displayPrice =
                currency === 'NGN' ? formatCurrencyNGN(car.priceNGN) : formatCurrencyUSD(car.priceUSD);

              return (
                <div
                  key={car.id}
                  onClick={() => onSelectCar(car)}
                  className="group rounded-2xl border border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-black/50"
                >
                  {/* Image Container with zero-pill metadata */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                    <img
                      src={car.imageUrl}
                      alt={car.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient scrim for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />

                    {/* Unboxed subtle metadata top bar */}
                    <div className="absolute top-3 left-3 text-[11px] font-mono text-neutral-300 bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 rounded">
                      {car.condition}
                    </div>

                    {/* Status badge if not available */}
                    {car.status !== 'Available' && (
                      <div className="absolute top-3 right-3 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-neutral-950/90 px-2.5 py-1 rounded border border-amber-500/40">
                        {car.status}
                      </div>
                    )}

                    {/* Unboxed bottom vehicle line */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-300">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span>{car.year}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatMileage(car.mileage)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{car.fuelType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[11px] font-mono text-amber-500 uppercase tracking-wider">
                        {car.make}
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mt-0.5">
                        {car.title}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-1 font-sans">
                        {car.engine} · {car.horsepower} HP
                      </p>
                    </div>

                    {/* Key feature highlights */}
                    <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-amber-400" />
                        {car.acceleration}
                      </span>
                      <span>{car.transmission}</span>
                    </div>

                    {/* Pricing & Call to Action Footer */}
                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-neutral-500 uppercase">Offer Price</div>
                        <div className="text-lg font-bold text-white font-mono tabular-nums">
                          {displayPrice}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
