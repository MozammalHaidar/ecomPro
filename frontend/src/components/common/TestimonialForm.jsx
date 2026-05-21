import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiSend, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../services/api';

const TestimonialForm = ({ onClose }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    email: '',
    comment: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) {
      toast.error('Name and comment are required');
      return;
    }
    setLoading(true);
    try {
      await api.post('testimonials/submit/', { ...form, rating });
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Share Your Experience</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Thank You! 🎉
            </h3>
            <p className="text-gray-500 text-sm">
              Your review has been submitted and is pending approval. We appreciate your feedback!
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition font-medium"
            >
              Close
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

            {/* Name + Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="New York, USA"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition"
              />
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition transform hover:scale-110"
                  >
                    <FiStar
                      size={28}
                      className={`transition ${
                        star <= (hover || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hover || rating]}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review *
              </label>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Share your experience with ShopZone..."
                rows={4}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              <FiSend size={16} />
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Your review will be visible after approval by our team.
            </p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TestimonialForm;