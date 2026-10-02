import React from 'react';
import { ArrowRight, Wrench, ShieldCheck, Clock, Award, Phone } from 'lucide-react';
import { CONTACT_DETAILS } from '../data/mockData';

interface HeroProps {
  onExploreInventory: () => void;
  onBookService: () => void;
  onOpenTracker: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreInventory,
  onBookService,
  onOpenTracker
}) => {
  return (
    <section className="relative overflow-hidden bg-neutral-950 pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-800">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Value Propositions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-amber-400 uppercase">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Certified Automobile Dealership & Master Service Center</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
              Premium Vehicle Sales, Precision Repair & Maintenance.
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl">
              Welcome to <strong className="text-neutral-200">Laye Autos</strong>. We deliver curated luxury & high-performance vehicles, backed by factory-grade diagnostics, preventive maintenance, and full warranty support across Nigeria.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreInventory}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                <span>Browse Inventory</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onBookService}
                className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900/90 px-6 py-3.5 text-sm font-semibold text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800 transition-all cursor-pointer active:scale-95"
              >
                <Wrench className="h-4 w-4 text-amber-500" />
                <span>Schedule Service</span>
              </button>

              <a
                href={`tel:${CONTACT_DETAILS.phone}`}
                className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-amber-400 transition-colors py-2 px-2"
              >
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span>Direct Line: <strong className="text-neutral-200 font-mono">{CONTACT_DETAILS.phoneDisplay}</strong></span>
              </a>
            </div>

            {/* Proof Metric Row */}
            <div className="pt-8 border-t border-neutral-900 grid grid-cols-3 gap-6">
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white tabular-nums">1,450+</div>
                <div className="text-xs text-neutral-500 mt-1">Vehicles Delivered</div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums">99.4%</div>
                <div className="text-xs text-neutral-500 mt-1">First-Time Fix Rate</div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white tabular-nums">15+</div>
                <div className="text-xs text-neutral-500 mt-1">Master Techs & Bays</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <img
                src="/src/assets/images/laye_autos_hero_1790849491050.jpg"
                alt="Laye Autos Showroom & Facility"
                className="w-full h-[380px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

              {/* Float badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-amber-400 font-medium">SHOWROOM & WORKSHOP</div>
                  <div className="text-sm font-semibold text-white">Full-Spectrum Auto Care</div>
                </div>
                <button
                  onClick={onOpenTracker}
                  className="text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-md transition-colors cursor-pointer border border-neutral-700"
                >
                  Track Vehicle
                </button>
              </div>
            </div>

            {/* Floating verification card */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 rounded-xl border border-neutral-800 bg-neutral-900/95 backdrop-blur-md p-3.5 shadow-xl items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">150-Point Pre-Sale Inspection</div>
                <div className="text-[11px] text-neutral-400">Customs Cleared & Warranty Certified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
