import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CONTACT_DETAILS, saveStoredInquiries, getStoredInquiries } from '../data/mockData';
import { CustomerInquiry } from '../types';
import { syncInquiryToSupabase } from '../services/supabaseService';

interface ContactSectionProps {
  onInquirySubmitted?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onInquirySubmitted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<'general' | 'sales_inquiry' | 'custom_car_order'>('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now()}`,
      customerName: name,
      customerEmail: email || 'N/A',
      customerPhone: phone,
      inquiryType,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const existing = getStoredInquiries();
    saveStoredInquiries([newInquiry, ...existing]);
    syncInquiryToSupabase(newInquiry);

    setSubmitted(true);
    if (onInquirySubmitted) onInquirySubmitted();
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-neutral-950 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Official Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-mono text-amber-500 uppercase tracking-wider">
                GET IN TOUCH
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Speak with Laye Autos
              </h2>
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                Whether you're looking to purchase a certified vehicle, schedule an urgent diagnostic scan, or arrange vehicle recovery, our team is ready to assist.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-2">
              {/* Phone */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-neutral-400">Direct Phone & WhatsApp Hotline</div>
                  <a
                    href={`tel:${CONTACT_DETAILS.phone}`}
                    className="font-mono text-base font-bold text-white hover:text-amber-400 transition-colors block"
                  >
                    {CONTACT_DETAILS.phoneDisplay}
                  </a>
                  <div className="text-[11px] text-neutral-500">Available 24/7 for Emergency Towing & Service Intake</div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-neutral-400">Official Inquiries & Documentation</div>
                  <a
                    href={`mailto:${CONTACT_DETAILS.email}`}
                    className="text-base font-semibold text-white hover:text-amber-400 transition-colors block font-mono"
                  >
                    {CONTACT_DETAILS.email}
                  </a>
                  <div className="text-[11px] text-neutral-500">Fast response within 30 minutes during business hours</div>
                </div>
              </div>

              {/* Location & Workshop Facility */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-neutral-400">Main Showroom & Workshop Facility</div>
                  <div className="text-xs font-semibold text-neutral-200">
                    {CONTACT_DETAILS.address}
                  </div>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-1">
                    <Clock className="h-3 w-3 text-amber-500" />
                    <span>{CONTACT_DETAILS.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <div className="pt-2">
              <a
                href={CONTACT_DETAILS.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/20"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat Directly on WhatsApp (+234 802 234 1342)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Received!</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Laye Autos. Our customer desk has received your inquiry and will respond to <strong className="text-neutral-200">{phone}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="text-xs text-amber-400 underline hover:text-amber-300 cursor-pointer pt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Send Us a Direct Message</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Fill out this form and a vehicle advisor or service manager will follow up with you.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Inquiry Purpose</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'general', label: 'General / Support' },
                        { id: 'sales_inquiry', label: 'Vehicle Purchase' },
                        { id: 'custom_car_order', label: 'Custom Import / Order' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setInquiryType(item.id as any)}
                          className={`py-2 px-2 text-[11px] rounded-lg border text-center transition-colors cursor-pointer ${
                            inquiryType === item.id
                              ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-semibold'
                              : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Oladapo Williams"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1">Telephone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 802 000 0000"
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@domain.com"
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Your Message or Vehicle Needs *</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you need—e.g. pricing on certified SUVs, timing belt replacement quote, or vehicle import from USA/Germany..."
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Message to Laye Autos</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
