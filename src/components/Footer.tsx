import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowUp } from 'lucide-react';
import { CONTACT_DETAILS } from '../data/mockData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenTracker
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="font-display text-2xl font-extrabold tracking-wider text-white inline-block"
            >
              LAYE <span className="text-amber-500">AUTOS</span>
            </a>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Nigeria's premier automobile company specializing in luxury and certified vehicle sales, advanced computer diagnostics, mechanical repairs, and scheduled fleet maintenance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Certified Automobile Dealership & Service Facility</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Explore</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Vehicle Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Repair & Diagnostics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('maintenance-tips')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Car Care Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Client Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Client Services */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Customer Hub</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenBooking}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer text-left"
                >
                  Schedule Workshop Service
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Track Service & Notifications
                </button>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_DETAILS.phone}`}
                  className="hover:text-amber-400 transition-colors block"
                >
                  24/7 Breakdown Recovery Line
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_DETAILS.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors block"
                >
                  Chat with Sales on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Workshop Details */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Contact Laye Autos</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <a href={`tel:${CONTACT_DETAILS.phone}`} className="hover:text-white font-mono">
                  {CONTACT_DETAILS.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <a href={`mailto:${CONTACT_DETAILS.email}`} className="hover:text-white font-mono">
                  {CONTACT_DETAILS.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{CONTACT_DETAILS.address}</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-neutral-500 pt-1">
                <Clock className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                <span>{CONTACT_DETAILS.hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Laye Autos Nigeria Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Genuine Parts Guaranteed</span>
            <span>·</span>
            <span>Secure SSL Encrypted Checkout</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-800"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
