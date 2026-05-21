import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiStar, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const ReviewForm = ({ productSlug, onReviewAdded }) => {
  const { access } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`products/${productSlug}/review/`, {
        rating,
        comment,
      });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      onReviewAdded(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!access) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-gray-500 mb-3">Please login to leave a review</p>
        <Link
          to="/login"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-5">Write a Review</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 transition resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 w-full md:w-auto md:px-8"
        >
          <FiSend size={16} />
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;