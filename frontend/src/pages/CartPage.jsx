import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUrl';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { access } = useSelector((state) => state.auth);

  const total = items.reduce((sum, item) => sum + item.final_price * item.quantity, 0);

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.info(`${name} removed from cart`);
  };

  const handleCheckout = () => {
    if (!access) {
      toast.info('Please login to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <FiShoppingBag size={80} className="mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some products to get started</p>
        <Link
          to="/products"
          className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition flex items-center gap-2"
        >
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
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
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-primary-600 font-bold mt-1">${item.final_price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition"
                    >
                      −
                    </button>
                    <span className="font-semibold text-gray-800 w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal + Remove */}
                <div className="flex flex-col items-end gap-3">
                  <p className="font-bold text-gray-800">
                    ${(item.final_price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Clear Cart */}
          <button
            onClick={() => { dispatch(clearCart()); toast.info('Cart cleared'); }}
            className="self-start text-sm text-red-400 hover:text-red-600 transition flex items-center gap-1 mt-2"
          >
            <FiTrash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

          <div className="flex flex-col gap-3 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.final_price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Shipping</span>
              <span className="text-green-500">Free</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 text-lg mt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
          >
            Proceed to Checkout <FiArrowRight />
          </button>

          <Link
            to="/products"
            className="w-full mt-3 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;