import React, { useState } from 'react';
import { BookOpen, Check, ArrowRight, X, Clock, Calendar, User, ShieldCheck } from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data/mockData';

export const MaintenanceBlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Engine Care', 'Brake System', 'Air Conditioning', 'Tires & Suspension'];

  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="maintenance-tips" className="py-16 sm:py-20 bg-neutral-950 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800">
          <div>
            <div className="text-xs font-mono text-amber-500 uppercase tracking-wider">
              CAR CARE KNOWLEDGE BASE
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Automotive Engineering & Maintenance Insights
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
              Practical guides written by Laye Autos master technicians to safeguard your vehicle against tropical climate heat, rough roads, and mechanical wear.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-lg border border-neutral-800 bg-neutral-900/60 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer text-xs font-medium ${
                  selectedCategory === cat
                    ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-950">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 text-[11px] font-mono text-neutral-300 bg-neutral-950/80 px-2.5 py-1 rounded border border-neutral-800">
                  {post.category}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-300 font-mono">
                  <span>{post.publishedDate}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-2 leading-relaxed font-sans">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 font-medium">By {post.author}</span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6">
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-neutral-950">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 rounded-full bg-neutral-950/80 p-2 text-neutral-300 hover:text-white transition-colors cursor-pointer border border-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="text-xs font-mono text-amber-400 uppercase">{selectedPost.category}</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-snug">{selectedPost.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-4 text-xs text-neutral-400 pb-3 border-b border-neutral-800">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-amber-500" />{selectedPost.author}</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-neutral-400" />{selectedPost.publishedDate}</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-neutral-400" />{selectedPost.readTime}</span>
              </div>

              {/* Prose paragraphs */}
              <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-sans">
                {selectedPost.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Actionable Maintenance Checklist */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Master Technician's Action Checklist</span>
                </div>
                <ul className="space-y-2">
                  {selectedPost.tipsChecklist.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <Check className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="rounded-lg bg-neutral-800 px-5 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
