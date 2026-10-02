import React from 'react';
import { Wrench, CheckCircle, Clock, ShieldCheck, ArrowRight, Activity, Cpu, Sparkles } from 'lucide-react';
import { SERVICE_PACKAGES } from '../data/mockData';
import { formatCurrencyNGN, formatCurrencyUSD } from '../utils/formatters';

interface ServicesSectionProps {
  onBookServicePackage: (packageId: string) => void;
  currency: 'NGN' | 'USD';
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onBookServicePackage,
  currency
}) => {
  return (
    <section id="services" className="py-16 sm:py-20 bg-neutral-950 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-neutral-800">
          <div>
            <div className="text-xs font-mono text-amber-500 uppercase tracking-wider">
              PRECISION WORKSHOP & MECHANICAL REPAIR
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Factory-Grade Automotive Care & Maintenance
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
              From complex ECU programming and tropical AC overhauls to suspension restorations and routine synthetic servicing, our master technicians use certified OEM tooling and transparent digital inspection reports.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 text-xs text-neutral-300">
              <span className="text-amber-400 font-bold">12-Month / 20,000km</span> Warranty on all repairs & parts
            </div>
          </div>
        </div>

        {/* Workshop Feature Spotlight inspired by uploaded images */}
        <div className="my-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
          <div className="lg:col-span-6 relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
            <img
              src="/src/assets/images/laye_repair_bay_1790849502054.jpg"
              alt="Laye Autos High-Tech Service Bay"
              className="w-full h-[320px] sm:h-[380px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-neutral-200">
              <span className="font-mono text-amber-400">Bay 04 · High-Capacity Hydraulic Lift</span>
              <span className="bg-neutral-950/80 px-2 py-0.5 rounded text-[11px] border border-neutral-800">Cleanroom Standards</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-mono text-amber-500 uppercase">THE LAYE AUTOS REPAIR STANDARD</div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              No Guesswork. Only Precision Diagnostics.
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Modern vehicles are sophisticated computers on wheels. We invest in official OEM scan tools for Mercedes-Benz (XENTRY), BMW (ISTA), Land Rover (Pathfinder), Porsche (PIWIS), and Toyota (Techstream). We diagnose the root cause before replacing a single component.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-amber-400" />
                  OEM Star Diagnostics
                </div>
                <div className="text-neutral-500">Live CAN-Bus telemetry and module adaptation</div>
              </div>
              <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  100% Genuine Parts
                </div>
                <div className="text-neutral-500">Direct factory supply chain with manufacturer seals</div>
              </div>
              <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                  Same-Day Turnaround
                </div>
                <div className="text-neutral-500">Over 90% of routine services done within 3 hours</div>
              </div>
              <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-amber-400" />
                  Automated SMS Alerts
                </div>
                <div className="text-neutral-500">Real-time alerts when vehicle enters & exits bays</div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {SERVICE_PACKAGES.map((pkg) => {
            const priceDisplay =
              currency === 'NGN' ? formatCurrencyNGN(pkg.priceNGN) : formatCurrencyUSD(pkg.priceUSD);

            return (
              <div
                key={pkg.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col justify-between hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="font-mono">{pkg.category}</span>
                    <span className="text-neutral-500">{pkg.estimatedDuration}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {pkg.name}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Inclusions */}
                  <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-2">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Includes:
                    </div>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {pkg.inclusions.slice(0, 4).map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase">Starting At</div>
                    <div className="text-lg font-bold text-white font-mono tabular-nums">
                      {priceDisplay}
                    </div>
                  </div>

                  <button
                    onClick={() => onBookServicePackage(pkg.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-all cursor-pointer active:scale-95 shadow-md shadow-amber-500/10"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
