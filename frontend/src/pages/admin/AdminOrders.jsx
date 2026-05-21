import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const statusColors = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await api.patch(`orders/${orderId}/status/`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o)
      );
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
        <button onClick={fetchOrders} className="flex items-center gap-2 text-primary-600 hover:underline text-sm">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-500 text-left">
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{order.full_name}</p>
                    <p className="text-gray-400 text-xs">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{order.items?.length} items</td>
                  <td className="px-6 py-4 font-bold text-gray-800">${order.total_price}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updating === order.id || order.status === 'cancelled'}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none ${statusColors[order.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-700">
                      <FiArrowRight size={18} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;