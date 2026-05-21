import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShoppingBag, FiUsers, FiPackage,
  FiDollarSign, FiClock, FiArrowRight,
  FiTrendingUp, FiTrendingDown, FiTag
} from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import { useSelector } from 'react-redux';



const statusColors = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('orders/stats/');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.total_revenue?.toFixed(2)}`,
      icon: <FiDollarSign size={22} />,
      color: 'bg-green-500',
      light: 'bg-green-50 text-green-600',
      link: '/admin/charts',
      trend: '+12%',
      up: true,
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders,
      icon: <FiPackage size={22} />,
      color: 'bg-blue-500',
      light: 'bg-blue-50 text-blue-600',
      link: '/admin/orders',
      trend: '+8%',
      up: true,
    },
    {
      title: 'Total Products',
      value: stats?.total_products,
      icon: <FiShoppingBag size={22} />,
      color: 'bg-purple-500',
      light: 'bg-purple-50 text-purple-600',
      link: '/admin/products',
      trend: '+3%',
      up: true,
    },
    {
      title: 'Total Users',
      value: stats?.total_users,
      icon: <FiUsers size={22} />,
      color: 'bg-orange-500',
      light: 'bg-orange-50 text-orange-600',
      link: '/admin/users',
      trend: '+5%',
      up: true,
    },
  ];

  return (
    <div className="p-6">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome back! 👋</h2>
            <p className="text-primary-100">
              Here's what's happening with your store today.
            </p>
            {stats?.pending_orders > 0 && (
              <div className="flex items-center gap-2 mt-3 bg-white bg-opacity-20 px-4 py-2 rounded-xl w-fit">
                <FiClock size={14} />
                <span className="text-sm font-medium">
                  {stats.pending_orders} orders waiting for processing
                </span>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="flex flex-col items-center gap-2">
              <Avatar user={user} size="xxl" className="border-4 border-white border-opacity-30" />
              <p className="text-primary-100 text-xs font-medium">
                {user?.is_staff ? '👑 Administrator' : '👤 User'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={card.link}
              className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${card.light}`}>
                  {card.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  card.up ? 'text-green-500' : 'text-red-500'
                }`}>
                  {card.up
                    ? <FiTrendingUp size={14} />
                    : <FiTrendingDown size={14} />
                  }
                  {card.trend}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-0.5">
                  {card.value}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-primary-600 hover:underline flex items-center gap-1 text-sm"
            >
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-500 text-left">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_orders?.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3 font-medium text-primary-600">
                      #{order.id}
                    </td>
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-800">{order.full_name}</p>
                      <p className="text-gray-400 text-xs">{order.email}</p>
                    </td>
                    <td className="px-6 py-3 font-bold text-gray-800">
                      ${order.total_price}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              {[
                { title: 'Add New Product',  icon: <FiShoppingBag size={16} />, link: '/admin/products', color: 'text-purple-600 bg-purple-50' },
                { title: 'Manage Orders',    icon: <FiPackage size={16} />,     link: '/admin/orders',   color: 'text-blue-600 bg-blue-50' },
                { title: 'Create Coupon',    icon: <FiTag size={16} />,         link: '/admin/coupons',  color: 'text-green-600 bg-green-50' },
                { title: 'View Analytics',   icon: <FiTrendingUp size={16} />,  link: '/admin/charts',   color: 'text-orange-600 bg-orange-50' },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.link}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.title}</span>
                  <FiArrowRight size={14} className="ml-auto text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Order Status Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-gray-800 mb-4">Order Status</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Pending',    value: stats?.pending_orders || 0,  color: 'bg-yellow-400' },
                { label: 'Delivered',  value: stats?.recent_orders?.filter(o => o.status === 'delivered').length || 0,  color: 'bg-green-400' },
                { label: 'Cancelled',  value: stats?.recent_orders?.filter(o => o.status === 'cancelled').length || 0,  color: 'bg-red-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                  <span className="text-sm font-bold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;