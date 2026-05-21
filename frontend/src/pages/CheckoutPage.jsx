import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { clearCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FiMapPin, FiUser, FiPhone, FiMail } from 'react-icons/fi';

const schema = yup.object({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postal_code: yup.string().required('Postal code is required'),
  country: yup.string().required('Country is required'),
});

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');

  const total = items.reduce((sum, item) => sum + item.final_price * item.quantity, 0);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: user ? `${user.first_name} ${user.last_name}` : '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  const handleCouponApply = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await api.post('coupons/validate/', {
        code: couponCode,
        order_total: total,
      });
      setCouponData(res.data);
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Invalid coupon code');
      setCouponData(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponData(null);
    setCouponCode('');
    setCouponError('');
  };

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        ...data,
        coupon_code: couponData ? couponCode : '',
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };
      const res = await api.post('orders/create/', orderData);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiMapPin className="text-primary-600" /> Shipping Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('full_name')}
                    placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 transition"
                  />
                </div>
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 transition"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('phone')}
                      placeholder="+1 234 567 890"
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 transition"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    {...register('address')}
                    placeholder="123 Main Street, Apt 4B"
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 transition resize-none"
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              {/* City + Postal + Country */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    {...register('city')}
                    placeholder="New York"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    {...register('postal_code')}
                    placeholder="10001"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition"
                  />
                  {errors.postal_code && <p className="text-red-500 text-xs mt-1">{errors.postal_code.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    {...register('country')}
                    placeholder="United States"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 transition"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 mt-2"
              >
                {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-24">
  <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

  <div className="flex flex-col gap-3 mb-6">
    {items.map((item) => (
      <div key={item.id} className="flex gap-3 items-center">
        <img
          src={item.image ? item.image : '/placeholder.png'}
          alt={item.name}
          className="w-12 h-12 object-cover rounded-lg"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 truncate">{item.name}</p>
          <p className="text-xs text-gray-400">× {item.quantity}</p>
        </div>
        <p className="text-sm font-bold text-gray-800">
          ${(item.final_price * item.quantity).toFixed(2)}
        </p>
      </div>
    ))}
  </div>

  {/* Coupon Code */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Coupon Code
    </label>
    {couponData ? (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <div>
          <p className="text-green-700 font-semibold text-sm">{couponData.code}</p>
          <p className="text-green-600 text-xs">{couponData.description}</p>
        </div>
        <button
          onClick={handleRemoveCoupon}
          className="text-red-400 hover:text-red-600 transition text-xs font-medium"
        >
          Remove
        </button>
      </div>
    ) : (
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition uppercase"
        />
        <button
          onClick={handleCouponApply}
          disabled={couponLoading || !couponCode}
          className="bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50"
        >
          {couponLoading ? '...' : 'Apply'}
        </button>
      </div>
    )}
    {couponError && (
      <p className="text-red-500 text-xs mt-1">{couponError}</p>
    )}
  </div>

  <div className="border-t pt-4">
    <div className="flex justify-between text-sm text-gray-600 mb-2">
      <span>Subtotal</span>
      <span>${total.toFixed(2)}</span>
    </div>
    {couponData && (
      <div className="flex justify-between text-sm text-green-600 mb-2">
        <span>
          Discount ({couponData.discount_type === 'percentage'
            ? `${couponData.discount_value}%`
            : `$${couponData.discount_value}`})
        </span>
        <span>-${couponData.discount_amount.toFixed(2)}</span>
      </div>
    )}
    <div className="flex justify-between text-sm text-gray-600 mb-2">
      <span>Shipping</span>
      <span className="text-green-500">Free</span>
    </div>
    <div className="flex justify-between font-bold text-gray-800 text-lg mt-3">
      <span>Total</span>
      <span>
        ${couponData ? couponData.final_total.toFixed(2) : total.toFixed(2)}
      </span>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default CheckoutPage;