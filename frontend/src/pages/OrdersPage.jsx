import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiPackage, FiArrowRight, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import { useState } from 'react';
import api from '../services/api';
import { OrderCardSkeleton } from '../components/common/Skeleton';
import { getImageUrl } from '../utils/imageUrl';

const statusConfig = {
  pending:    { color: 'bg-yellow-100 text-yellow-700', icon: <FiClock size={14} /> },
  processing: { color: 'bg-blue-100 text-blue-700',    icon: <FiPackage size={14} /> },
  shipped:    { color: 'bg-purple-100 text-purple-700', icon: <FiTruck size={14} /> },
  delivered:  { color: 'bg-green-100 text-green-700',  icon: <FiCheck size={14} /> },
  cancelled:  { color: 'bg-red-100 text-red-700',      icon: <FiX size={14} /> },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('orders/');
        setOrders(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="h-8 w-40 bg-gray-200 rounded-xl animate-pulse mb-8" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FiPackage size={80} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
          <p className="mb-6">Start shopping to see your orders here</p>
          <Link
            to="/products"
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[order.status]?.color}`}>
                    {statusConfig[order.status]?.icon}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-primary-600 hover:text-primary-700 transition"
                  >
                    <FiArrowRight size={20} />
                  </Link>
                </div>
              </div>

              {/* Items preview */}
              <div className="flex gap-2 flex-wrap">
                {order.items?.slice(0, 4).map((item) => (
                 <img
                    key={item.id}
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border"
                  />
                                  ))}
                {order.items?.length > 4 && (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">{order.items?.length} item(s)</p>
                <p className="font-bold text-gray-800">${order.total_price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;