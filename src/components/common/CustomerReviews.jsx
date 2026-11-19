import React, { useState, useEffect } from 'react';
import { Star, User, MapPin, Send } from 'lucide-react';

const LAPTOP_OPTIONS = [
  'Dell Latitude 7420 Aluminium',
  'Dell Latitude 5430 12th Gen',
  'Dell Latitude 5520 15.6"',
  'HP ProBook 630-G8 Touch',
  'Dell Latitude 5420',
];

const SEED_REVIEWS = [
  {
    id: 'seed-1',
    name: 'Rajesh Patil',
    city: 'Pune',
    rating: 5,
    text: 'Bought the Dell Latitude 7420 Aluminium from RS Refurbished and it looks brand new! The aluminium body feels premium and the battery lasts a full workday. Absolutely worth every rupee — better than buying a new budget laptop.',
    laptopModel: 'Dell Latitude 7420 Aluminium',
    date: '2026-09-15T10:30:00.000Z',
    approved: true,
  },
  {
    id: 'seed-2',
    name: 'Priya Nair',
    city: 'Mumbai',
    rating: 5,
    text: 'I was skeptical about refurbished laptops but the Dell Latitude 5430 12th Gen exceeded all my expectations. 10-core i7 performance is blazing fast for my development work. The 32-point inspection report gave me total confidence.',
    laptopModel: 'Dell Latitude 5430 12th Gen',
    date: '2026-09-22T14:15:00.000Z',
    approved: true,
  },
  {
    id: 'seed-3',
    name: 'Amit Deshmukh',
    city: 'Nagpur',
    rating: 4,
    text: 'HP ProBook 630-G8 Touch is perfect for presentations and client meetings. Touchscreen works flawlessly and the slim build makes it easy to carry everywhere. Doorstep delivery was on time and well-packed.',
    laptopModel: 'HP ProBook 630-G8 Touch',
    date: '2026-10-01T09:45:00.000Z',
    approved: true,
  },
  {
    id: 'seed-4',
    name: 'Sneha Kulkarni',
    city: 'Bangalore',
    rating: 5,
    text: 'Got the Dell Latitude 5420 for my accounting work. The numeric keypad on the 5520 model was tempting but I needed portability. A++ condition as promised — couldn\'t find a single scratch. Will definitely recommend RS Refurbished to colleagues!',
    laptopModel: 'Dell Latitude 5420',
    date: '2026-10-10T16:20:00.000Z',
    approved: true,
  },
];

function StarRating({ rating, onRate, interactive = false, size = 'w-4 h-4' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          onClick={interactive ? () => onRate(star) : undefined}
          className={interactive ? 'cursor-pointer focus:outline-none transition-transform hover:scale-110' : 'cursor-default'}
          tabIndex={interactive ? 0 : -1}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
        >
          <Star
            className={`${size} ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-none text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const formattedDate = new Date(review.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Name & City */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm leading-tight">{review.name}</h4>
              {review.city && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] text-slate-500 font-medium">{review.city}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={review.rating} />
        </div>

        {/* Review Text */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
          "{review.text}"
        </p>
      </div>

      {/* Footer: Laptop Model & Date */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {review.laptopModel ? (
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
            {review.laptopModel}
          </span>
        ) : (
          <span />
        )}
        <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">{formattedDate}</span>
      </div>
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    rating: 0,
    text: '',
    laptopModel: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Fetch reviews from API on mount
  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          // Merge API reviews with seeds, deduplicate by id
          const apiIds = new Set(data.reviews.map((r) => r.id));
          const uniqueSeeds = SEED_REVIEWS.filter((s) => !apiIds.has(s.id));
          setReviews([...data.reviews, ...uniqueSeeds]);
        }
      })
      .catch(() => {
        // Keep seed reviews on error
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSubmitted(false);
  };

  const handleRating = (star) => {
    setFormData((prev) => ({ ...prev, rating: star }));
    setError('');
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (formData.rating < 1 || formData.rating > 5) {
      setError('Please select a rating.');
      return;
    }
    if (!formData.text.trim()) {
      setError('Please write your review.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          city: formData.city.trim(),
          rating: formData.rating,
          text: formData.text.trim(),
          laptopModel: formData.laptopModel || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', city: '', rating: 0, text: '', laptopModel: '' });
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-slate-50 bg-dot-pattern">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-3 border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> What Our Customers Say
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Real reviews from real customers
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Review Submission Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Send className="w-5 h-5 text-brand-600" />
              Share Your Experience
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Bought a laptop from us? We'd love to hear your feedback.
            </p>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                ✅ Thank you! Your review will be published after verification.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & City Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="review-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>
                <div>
                  <label htmlFor="review-city" className="block text-xs font-bold text-slate-700 mb-1.5">
                    City
                  </label>
                  <input
                    id="review-city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Pune"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rating <span className="text-red-400">*</span>
                </label>
                <StarRating
                  rating={formData.rating}
                  onRate={handleRating}
                  interactive
                  size="w-6 h-6"
                />
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="review-text" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Your Review <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="review-text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Tell us about your experience with the laptop..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition resize-none"
                />
              </div>

              {/* Laptop Model (Optional) */}
              <div>
                <label htmlFor="review-laptop" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Laptop Model <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <select
                  id="review-laptop"
                  name="laptopModel"
                  value={formData.laptopModel}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                >
                  <option value="">Select a laptop model...</option>
                  {LAPTOP_OPTIONS.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
