import React, { useState } from 'react';
import { Phone, Mail, Calendar, Wrench, Menu, X, Shield, Search } from 'lucide-react';
import { CONTACT_DETAILS } from '../data/mockData';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenBooking: () => void;
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  onOpenBooking,
  onOpenTracker,
  onOpenAdmin,
  isAdminOpen
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'inventory', label: 'Inventory' },
    { id: 'services', label: 'Services & Repair' },
    { id: 'maintenance-tips', label: 'Car Care Blog' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      {/* Top micro announcement / direct hotline bar */}
      <div className="border-b border-neutral-800/80 bg-neutral-900/60 px-4 py-1.5 text-xs text-neutral-400">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href={`tel:${CONTACT_DETAILS.phone}`}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="h-3 w-3 text-amber-500" />
              <span className="font-mono">{CONTACT_DETAILS.phoneDisplay}</span>
            </a>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <a
              href={`mailto:${CONTACT_DETAILS.email}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Mail className="h-3 w-3 text-amber-500" />
              <span>{CONTACT_DETAILS.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTracker}
              className="flex items-center gap-1 text-neutral-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Search className="h-3 w-3 text-amber-400" />
              <span>Track Service Order</span>
            </button>
            <span className="text-neutral-700">|</span>
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 transition-colors cursor-pointer ${
                isAdminOpen ? 'text-amber-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Shield className="h-3 w-3 text-amber-500" />
              <span>{isAdminOpen ? 'Exit Admin' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar: Strictly 3 Zones */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-2xl font-extrabold tracking-wider text-white hover:text-amber-400 transition-colors"
        >
          LAYE <span className="text-amber-500">AUTOS</span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`transition-colors hover:text-white cursor-pointer relative py-1 ${
                activeSection === link.id
                  ? 'text-amber-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500'
                  : 'text-neutral-300'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/10 cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Service</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-800 bg-neutral-950 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === link.id
                    ? 'bg-neutral-900 text-amber-400'
                    : 'text-neutral-300 hover:bg-neutral-900/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="flex items-center justify-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-200"
            >
              <Search className="h-4 w-4 text-amber-500" />
              Track Service Appointment
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-400"
            >
              <Shield className="h-4 w-4 text-amber-500" />
              {isAdminOpen ? 'Exit Admin Dashboard' : 'Open Admin Dashboard'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
