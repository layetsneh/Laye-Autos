import React, { useState } from 'react';
import { Star, CheckCircle, Plus, X } from 'lucide-react';
import { CustomerReview } from '../types';
import { getStoredReviews, saveStoredReviews } from '../data/mockData';
import { syncReviewToSupabase } from '../services/supabaseService';

interface ReviewsSectionProps {
  onReviewAdded?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onReviewAdded }) => {
  const [reviews, setReviews] = useState<CustomerReview[]>(getStoredReviews());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [serviceOrCar, setServiceOrCar] = useState('Vehicle Service & Diagnostics');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      customerName: name,
      location,
      serviceOrCar,
      rating,
      date: 'Just now',
      comment,
      verified: true
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    saveStoredReviews(updated);
    syncReviewToSupabase(newRev);
    setIsModalOpen(false);
    setName('');
    setComment('');
    if (onReviewAdded) onReviewAdded();
  };

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-neutral-950 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800">
          <div>
            <div className="text-xs font-mono text-amber-500 uppercase tracking-wider">
              CLIENT TESTIMONIALS & TRUST
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Verified Experiences at Laye Autos
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-white font-mono">4.9 / 5.0</span>
              <span className="text-xs text-neutral-400">· Over 280+ vehicle owners across Nigeria</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-neutral-200 hover:border-amber-500 hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4 text-amber-500" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-800/80">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-white text-xs">{rev.customerName}</div>
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <CheckCircle className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">{rev.location}</div>
                <div className="text-[10px] text-amber-500/90 font-mono mt-1 line-clamp-1">
                  {rev.serviceOrCar}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white">Share Your Laye Autos Experience</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Kemi Adeleke"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ikoyi, Lagos"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Car or Service</label>
                  <input
                    type="text"
                    value={serviceOrCar}
                    onChange={(e) => setServiceOrCar(e.target.value)}
                    placeholder="e.g. Bought Audi Q7 / Brake Overhaul"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Feedback & Comments *</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the vehicle quality, diagnostic accuracy, or customer service..."
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-amber-500 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Post Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
