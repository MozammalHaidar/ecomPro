import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiClock, FiCheck, FiTruck, FiX, FiMapPin } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';
import api from '../services/api';
import { toast } from 'react-toastify';

const statusConfig = {
  pending:    { color: 'bg-yellow-100 text-yellow-700', icon: <FiClock /> },
  processing: { color: 'bg-blue-100 text-blue-700',    icon: <FiPackage /> },
  shipped:    { color: 'bg-purple-100 text-purple-700', icon: <FiTruck /> },
  delivered:  { color: 'bg-green-100 text-green-700',  icon: <FiCheck /> },
  cancelled:  { color: 'bg-red-100 text-red-700',      icon: <FiX /> },
};

const steps = ['pending', 'processing', 'shipped', 'delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`orders/${id}/`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.patch(`orders/${id}/cancel/`);
      setOrder((prev) => ({ ...prev, status: 'cancelled' }));
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Spinner />;
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>;

  const currentStep = steps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <Link to="/orders" className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition">
        <FiArrowLeft /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order #{order.id}</h1>
          <p className="text-gray-500 mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig[order.status]?.color}`}>
          {statusConfig[order.status]?.icon}
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Progress Tracker */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-6">Order Progress</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 z-0">
              <div
                className="h-full bg-primary-500 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition ${
                  i <= currentStep
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {i < currentStep ? <FiCheck size={14} /> : i + 1}
                </div>
                <p className={`text-xs mt-2 font-medium capitalize ${i <= currentStep ? 'text-primary-600' : 'text-gray-400'}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Shipping Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiMapPin className="text-primary-600" /> Shipping Info
          </h2>
          <div className="text-sm text-gray-600 flex flex-col gap-1">
            <p className="font-medium text-gray-800">{order.full_name}</p>
            <p>{order.email}</p>
            <p>{order.phone}</p>
            <p className="mt-2">{order.address}</p>
            <p>{order.city}, {order.postal_code}</p>
            <p>{order.country}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Payment Info</h2>
          <div className="text-sm text-gray-600 flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Method</span>
              <span className="capitalize font-medium text-gray-800">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className={`font-medium ${order.is_paid ? 'text-green-500' : 'text-yellow-500'}`}>
                {order.is_paid ? 'Paid' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 mt-2">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-primary-600 text-lg">${order.total_price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Items Ordered</h2>
        <div className="flex flex-col gap-4">
          {order.items?.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 items-center py-3 border-b last:border-0"
            >
              <img
                src={item.image ? `http://127.0.0.1:8000/media/${item.image}` : '/placeholder.png'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-400">× {item.quantity}</p>
              </div>
              <p className="font-bold text-gray-800">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cancel Button */}
      {order.status === 'pending' && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full border-2 border-red-400 text-red-400 py-3 rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
        >
          {cancelling ? 'Cancelling...' : 'Cancel Order'}
        </button>
      )}
    </div>
  );
};

export default OrderDetailPage;