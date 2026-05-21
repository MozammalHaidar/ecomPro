import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchProductDetail, clearDetail } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { ProductDetailSkeleton } from '../components/common/Skeleton';
import ImageGallery from '../components/product/ImageGallery';
import ReviewForm from '../components/product/ReviewForm';
import RelatedProducts from '../components/product/RelatedProducts';
import {
  FiShoppingCart, FiStar, FiPackage,
  FiArrowLeft, FiHeart, FiShare2,
  FiTruck, FiShield, FiRefreshCw
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { detail: product, loading } = useSelector((state) => state.products);
  const { access } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [activeTab, setActiveTab] = useState('reviews');
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = wishlistItems.some(
    (item) => item.product?.slug === slug
  );

  useEffect(() => {
    dispatch(fetchProductDetail(slug));
    return () => dispatch(clearDetail());
  }, [dispatch, slug]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = async () => {
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-xl">Product not found</p>
      <Link to="/products" className="text-primary-600 hover:underline mt-4 inline-block">
        Back to Products
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600 transition">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600 transition">Products</Link>
            <span>/</span>
            <Link
              to={`/products?category=${product.category_name?.toLowerCase()}`}
              className="hover:text-primary-600 transition"
            >
              {product.category_name}
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Left — Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ImageGallery
              mainImage={product.image}
              images={product.images}
              productName={product.name}
            />
          </motion.div>

          {/* Right — Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            {/* Category + Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full font-medium uppercase tracking-wide">
                {product.category_name}
              </span>
              {product.featured && (
                <span className="text-xs bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full font-medium">
                  ⭐ Featured
                </span>
              )}
              {product.discount_price && (
                <span className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium">
                  🔥 On Sale
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={18}
                    className={star <= product.average_rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {product.average_rating || 0}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                {product.reviews?.length || 0} reviews
              </span>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-primary-600">
                  ${product.final_price}
                </span>
                {product.discount_price && (
                  <>
                    <span className="text-xl text-gray-400 line-through mb-1">
                      ${product.price}
                    </span>
                    <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-lg font-medium mb-1">
                      Save ${(product.price - product.final_price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <FiPackage
                className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}
                size={18}
              />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center gap-3 bg-white rounded-xl shadow-sm px-3 py-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition"
                  >
                    −
                  </button>
                  <span className="font-semibold text-gray-800 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart size={20} />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button
                onClick={handleWishlist}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition border-2 ${
                  isWishlisted
                    ? 'bg-red-50 border-red-300 text-red-500'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'
                }`}
              >
                <FiHeart
                  size={20}
                  className={isWishlisted ? 'fill-red-500' : ''}
                />
              </button>

              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border-2 border-gray-200 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition"
              >
                <FiShare2 size={20} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <FiTruck size={18} />, text: 'Free Delivery' },
                { icon: <FiShield size={18} />, text: 'Secure Payment' },
                { icon: <FiRefreshCw size={18} />, text: 'Easy Returns' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1 bg-white rounded-xl p-3 shadow-sm text-center">
                  <div className="text-primary-600">{item.icon}</div>
                  <span className="text-xs text-gray-500 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs Section — Reviews + Description */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">

          {/* Tab Headers */}
          <div className="flex border-b">
            {[
              { key: 'reviews', label: `Reviews (${product.reviews?.length || 0})` },
              { key: 'description', label: 'Description' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm font-medium transition border-b-2 ${
                  activeTab === tab.key
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Review Form */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Write a Review
                  </h3>
                  <ReviewForm
                    productSlug={product.slug}
                    onReviewAdded={() => dispatch(fetchProductDetail(product.slug))}
                  />
                </div>

                {/* Reviews List */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Customer Reviews
                  </h3>
                  {product.reviews?.length > 0 ? (
                    <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
                      {product.reviews.map((review) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-gray-50 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-bold text-sm">
                                  {review.user_email?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <p className="font-semibold text-gray-700 text-sm">
                                {review.user_email}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FiStar
                                  key={star}
                                  size={12}
                                  className={star <= review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {review.comment}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(review.created_at).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl">
                      <FiStar size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No reviews yet</p>
                      <p className="text-sm mt-1">Be the first to review!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Description Tab */}
            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl"
              >
                <p className="text-gray-600 leading-relaxed text-base">
                  {product.description || 'No description available.'}
                </p>

                {/* Product Details Table */}
                <div className="mt-6 border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { label: 'Category', value: product.category_name },
                        { label: 'Stock', value: `${product.stock} units` },
                        { label: 'Price', value: `$${product.price}` },
                        product.discount_price && {
                          label: 'Sale Price',
                          value: `$${product.discount_price}`
                        },
                        { label: 'Rating', value: `${product.average_rating || 0} / 5` },
                      ].filter(Boolean).map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3 font-medium text-gray-600 w-1/3">
                            {row.label}
                          </td>
                          <td className="px-4 py-3 text-gray-800">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          categorySlug={product.category_name?.toLowerCase()}
          currentSlug={product.slug}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;