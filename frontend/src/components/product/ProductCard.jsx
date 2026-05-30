import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { getImageUrl } from '../../utils/imageUrl';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { access } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some(
    (item) => item.product?.slug === product.slug
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!access) {
      toast.info('Please login to add to wishlist');
      return;
    }
    const result = await dispatch(toggleWishlist(product.slug));
    if (toggleWishlist.fulfilled.match(result)) {
      if (result.payload.wishlisted) {
        toast.success('Added to wishlist!');
      } else {
        toast.info('Removed from wishlist');
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="relative">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-52 object-contain p-3 bg-gray-50"
          />

          {/* Badges */}
          {product.discount_price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Sale
            </span>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white text-red-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <FiHeart
              size={15}
              className={isWishlisted ? 'fill-white' : ''}
            />
          </button>
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">{product.category_name}</p>
          <h3 className="font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
            <span className="text-sm text-gray-500">{product.average_rating || 0}</span>
          </div>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <div>
              {product.discount_price ? (
                <div className="flex items-center gap-2">
                  <span className="text-primary-600 font-bold">${product.discount_price}</span>
                  <span className="text-gray-400 text-sm line-through">${product.price}</span>
                </div>
              ) : (
                <span className="text-primary-600 font-bold">${product.price}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition"
            >
              <FiShoppingCart size={16} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;