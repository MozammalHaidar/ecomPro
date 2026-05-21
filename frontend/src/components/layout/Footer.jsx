import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('newsletter/subscribe/', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
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
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="md:col-span-1">
          <h2 className="text-white text-xl font-bold mb-3">ShopZone</h2>
          <p className="text-sm text-gray-400 mb-4">
            Your one-stop shop for everything you need. Quality products, fast delivery.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary-400 transition"><FiGithub size={20} /></a>
            <a href="#" className="hover:text-primary-400 transition"><FiTwitter size={20} /></a>
            <a href="#" className="hover:text-primary-400 transition"><FiInstagram size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary-400 transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-primary-400 transition">Products</Link></li>
            <li><Link to="/cart" className="hover:text-primary-400 transition">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-primary-400 transition">Orders</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-white font-semibold mb-3">Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-primary-400 transition">Login</Link></li>
            <li><Link to="/register" className="hover:text-primary-400 transition">Register</Link></li>
            <li><Link to="/profile" className="hover:text-primary-400 transition">Profile</Link></li>
            <li><Link to="/orders" className="hover:text-primary-400 transition">My Orders</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-3">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-3">
            Subscribe for deals and updates.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © 2026 ShopZone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;