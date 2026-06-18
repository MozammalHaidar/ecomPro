import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchFeatured, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/common/Spinner';
import Newsletter from '../components/common/Newsletter';
import TestimonialForm from '../components/common/TestimonialForm';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiStar, FiEdit } from 'react-icons/fi';
import api from '../services/api';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featured, categories, loading } = useSelector((state) => state.products);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchCategories());
    fetchTestimonials();
  }, [dispatch]);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('testimonials/');
      setTestimonials(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Shop the Best <br /> Products Online
            </h1>
            <p className="text-primary-100 mb-8 text-lg">
              Discover thousands of products at unbeatable prices. Fast delivery, easy returns.
            </p>
            <div className="flex gap-4">
              <Link
                to="/products"
                className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition flex items-center gap-2"
              >
                Shop Now <FiArrowRight />
              </Link>
              <Link
                to="/register"
                className="border border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition"
              >
                Join Free
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center"
          >
            <img
              src="/hero-1.jpg"
              alt="Shopping"
              className="w-120 h-120 object-contain drop-shadow-2xl rounded-md"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <FiTruck size={28} />, title: 'Free Delivery', desc: 'On orders over $50' },
            { icon: <FiShield size={28} />, title: 'Secure Payment', desc: '100% secure transactions' },
            { icon: <FiShoppingBag size={28} />, title: 'Easy Returns', desc: '30 day return policy' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-primary-50"
            >
              <div className="text-primary-600">{f.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-800">{f.title}</h4>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="block bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:border-primary-500 border border-transparent transition"
                >
                  <div className="text-3xl mb-2">🛍️</div>
                  <h3 className="font-semibold text-gray-700">{cat.name}</h3>
                  <p className="text-sm text-gray-400">{cat.product_count} products</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-primary-600 hover:underline flex items-center gap-1">
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-10">No featured products yet.</p>
        )}
      </section>

       {/* Newsletter */}
      <Newsletter />

             {/* Testimonials */}
     {/* Testimonials */}
<section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">

    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <span className="text-primary-600 font-semibold text-sm uppercase tracking-widest">
        Testimonials
      </span>
      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        What Our Customers Say
      </h2>
      <p className="text-gray-500 mt-3 max-w-xl mx-auto">
        Real reviews from real customers who love shopping with us.
      </p>
      <button
        onClick={() => setShowTestimonialForm(true)}
        className="mt-4 flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition font-medium mx-auto"
      >
        <FiEdit size={16} /> Share Your Experience
      </button>
    </motion.div>

    {/* Testimonial Form Modal */}
    <AnimatePresence>
      {showTestimonialForm && (
        <TestimonialForm onClose={() => setShowTestimonialForm(false)} />
      )}
    </AnimatePresence>

    {/* Cards */}
    {testimonialsLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-16 bg-gray-200 rounded mb-4" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : testimonials.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            {/* Quote Mark */}
            <div className="text-6xl font-bold text-primary-100 leading-none mb-2">
              "
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={14}
                  className={star <= t.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                  }
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {t.comment}
            </p>

            {/* User Info */}
            <div className="flex items-center gap-3 mt-auto">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {t.avatar_letter}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                {t.location && (
                  <p className="text-gray-400 text-xs">{t.location}</p>
                )}
              </div>
              <div className="ml-auto">
                <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
                  ✓ Verified
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
        <FiStar size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          No reviews yet
        </h3>
        <p className="text-gray-400 mb-6">
          Be the first to share your experience!
        </p>
        <button
          onClick={() => setShowTestimonialForm(true)}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition font-medium"
        >
          Write a Review
        </button>
      </div>
    )}

    {/* Stats */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
    >
      {[
        { value: '10,000+', label: 'Happy Customers' },
        { value: '500+',    label: 'Products' },
        { value: '99%',     label: 'Satisfaction Rate' },
        { value: '24/7',    label: 'Customer Support' },
      ].map((stat, i) => (
        <div
          key={i}
          className="text-center bg-white rounded-2xl p-5 shadow-sm"
        >
          <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
          <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  </div>
</section>
    </div>
  );
};

export default HomePage;