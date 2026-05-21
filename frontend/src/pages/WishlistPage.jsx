import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWishlist, toggleWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { FiHeart, FiShoppingCart, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Spinner from '../components/common/Spinner';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (slug, name) => {
    await dispatch(toggleWishlist(slug));
    toast.info(`${name} removed from wishlist`);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <FiHeart size={28} className="text-red-500 fill-red-500" />
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
          {items.length} items
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FiHeart size={80} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Your wishlist is empty
          </h2>
          <p className="mb-6">Save products you love to your wishlist</p>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition flex items-center gap-2 w-fit mx-auto"
          >
            <FiArrowLeft /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center"
              >
                {/* Image */}
                <Link to={`/products/${item.product.slug}`}>
                  <img
                    src={
                      item.product.image
                        ? item.product.image.startsWith('http')
                          ? item.product.image
                          : `http://127.0.0.1:8000${item.product.image}`
                        : '/placeholder.png'
                    }
                    alt={item.product.name}
                    className="w-24 h-24 object-contain rounded-lg bg-gray-50 p-2 flex-shrink-0"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">
                    {item.product.category_name}
                  </p>
                  <Link to={`/products/${item.product.slug}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-primary-600 transition">
                      {item.product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    {item.product.discount_price ? (
                      <>
                        <span className="text-primary-600 font-bold">
                          ${item.product.discount_price}
                        </span>
                        <span className="text-gray-400 text-sm line-through">
                          ${item.product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-primary-600 font-bold">
                        ${item.product.price}
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  <p className={`text-xs mt-1 ${item.product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    disabled={item.product.stock === 0}
                    className="flex items-center gap-1 bg-primary-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-primary-700 transition disabled:opacity-50"
                  >
                    <FiShoppingCart size={14} />
                    Add
                  </button>
                  <button
                    onClick={() => handleRemove(item.product.slug, item.product.name)}
                    className="flex items-center gap-1 border border-red-200 text-red-400 px-3 py-2 rounded-lg text-sm hover:bg-red-50 transition"
                  >
                    <FiTrash2 size={14} />
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;