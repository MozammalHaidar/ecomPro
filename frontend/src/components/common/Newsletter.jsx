import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiSend, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../services/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await api.post('newsletter/subscribe/', { email });
      setSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed to newsletter!');
    } catch (err) {
      const errorMsg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.error ||
        'Failed to subscribe';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-primary-600 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiMail size={28} className="text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-white mb-3">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Get 10% off your first order and stay updated with the latest products and exclusive deals.
          </p>

          {/* Form */}
          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 bg-white bg-opacity-20 text-white px-8 py-4 rounded-2xl max-w-md mx-auto"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <FiCheck size={16} className="text-primary-600" />
              </div>
              <p className="font-semibold">
                You're subscribed! Check your inbox for your discount code.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="relative flex-1">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-gray-800 placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-white text-primary-600 px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? (
                  'Subscribing...'
                ) : (
                  <>
                    <FiSend size={16} />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-8 text-primary-100 text-sm">
            <span className="flex items-center gap-1">
              <FiCheck size={14} /> No spam ever
            </span>
            <span className="flex items-center gap-1">
              <FiCheck size={14} /> Unsubscribe anytime
            </span>
            <span className="flex items-center gap-1">
              <FiCheck size={14} /> 10% off first order
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;