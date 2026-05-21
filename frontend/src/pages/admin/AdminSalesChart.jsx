import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { FiTrendingUp, FiShoppingBag, FiDollarSign, FiPackage } from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

const COLORS = ['#0d9488', '#14b8a6', '#f97316', '#3b82f6', '#8b5cf6'];

const STATUS_COLORS = {
  pending:    '#f59e0b',
  processing: '#3b82f6',
  shipped:    '#8b5cf6',
  delivered:  '#10b981',
  cancelled:  '#ef4444',
};

const AdminSalesChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchChartData();
  }, [period]);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`orders/chart/?period=${period}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  const totalRevenue = data?.sales_data?.reduce((sum, d) => sum + d.revenue, 0) || 0;
  const totalOrders = data?.sales_data?.reduce((sum, d) => sum + d.orders, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Sales Analytics</h1>

        {/* Period Toggle */}
        <div className="flex gap-2 bg-white rounded-xl shadow-sm p-1.5">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'daily'
                ? 'bg-primary-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              period === 'monthly'
                ? 'bg-primary-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Last 12 Months
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: 'Total Revenue',
            value: `$${totalRevenue.toFixed(2)}`,
            icon: <FiDollarSign size={22} />,
            color: 'bg-green-50 text-green-600',
          },
          {
            title: 'Total Orders',
            value: totalOrders,
            icon: <FiPackage size={22} />,
            color: 'bg-blue-50 text-blue-600',
          },
          {
            title: 'Top Product',
            value: data?.top_products?.[0]?.name || 'N/A',
            icon: <FiShoppingBag size={22} />,
            color: 'bg-purple-50 text-purple-600',
          },
          {
            title: 'Avg Order Value',
            value: totalOrders > 0
              ? `$${(totalRevenue / totalOrders).toFixed(2)}`
              : '$0',
            icon: <FiTrendingUp size={22} />,
            color: 'bg-orange-50 text-orange-600',
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-xl font-bold text-gray-800 truncate max-w-[120px]">
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm p-6 mb-6"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-6">Revenue Over Time</h2>
        {data?.sales_data?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.sales_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ fill: '#0d9488', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <FiTrendingUp size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No sales data available yet</p>
          </div>
        )}
      </motion.div>

      {/* Orders Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm p-6 mb-6"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-6">Orders Over Time</h2>
        {data?.sales_data?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.sales_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend />
              <Bar
                dataKey="orders"
                fill="#0d9488"
                radius={[6, 6, 0, 0]}
                name="Orders"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <FiPackage size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No orders data available yet</p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-6">Top Selling Products</h2>
          {data?.top_products?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {data.top_products.map((product, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full"
                          style={{
                            width: `${(product.total_sold / data.top_products[0].total_sold) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {product.total_sold} sold
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    ${product.total_revenue.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>No products sold yet</p>
            </div>
          )}
        </motion.div>

        {/* Order Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-6">Order Status Breakdown</h2>
          {data?.status_breakdown?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.status_breakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, percent }) =>
                      `${status} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {data.status_breakdown.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={STATUS_COLORS[entry.status] || COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {data.status_breakdown.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[entry.status] || COLORS[i] }}
                    />
                    <span className="text-xs text-gray-600 capitalize">
                      {entry.status} ({entry.count})
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p>No orders yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSalesChart;