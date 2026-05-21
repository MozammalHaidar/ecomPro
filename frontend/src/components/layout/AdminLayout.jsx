import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  FiGrid, FiShoppingBag, FiPackage, FiUsers,
  FiTrendingUp, FiTag, FiLogOut, FiMenu,
  FiX, FiChevronRight, FiBell, FiSettings, FiStar
} from 'react-icons/fi';
import Avatar from '../common/Avatar';

const menuItems = [
  { path: '/admin',               label: 'Dashboard',    icon: <FiGrid size={18} />,        exact: true },
  { path: '/admin/products',      label: 'Products',     icon: <FiShoppingBag size={18} />, exact: false },
  { path: '/admin/orders',        label: 'Orders',       icon: <FiPackage size={18} />,     exact: false },
  { path: '/admin/users',         label: 'Users',        icon: <FiUsers size={18} />,       exact: false },
  { path: '/admin/charts',        label: 'Analytics',    icon: <FiTrendingUp size={18} />,  exact: false },
  { path: '/admin/coupons',       label: 'Coupons',      icon: <FiTag size={18} />,         exact: false },
  { path: '/admin/testimonials',  label: 'Testimonials', icon: <FiStar size={18} />,        exact: false },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <FiShoppingBag size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">ShopZone</p>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
        <div className="flex items-center gap-3 bg-gray-700 rounded-xl p-3">
          <Avatar user={user} size="lg" className="border-2 border-white border-opacity-30" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium ${
                isActive(item)
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
              {isActive(item) && (
                <FiChevronRight size={14} className="ml-auto" />
              )}
            </Link>
          ))}
        </div>

        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 mb-3 mt-6">
          Account
        </p>
        <div className="flex flex-col gap-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
          >
            <FiSettings size={18} /> Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium text-gray-400 hover:bg-red-900 hover:text-red-300 w-full text-left"
          >
            <FiLogOut size={18} /> Sign Out
          </button>
        </div>
      </nav>

      {/* Back to Store */}
      <div className="px-4 py-4 border-t border-gray-700">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white py-2.5 rounded-xl transition text-sm font-medium"
        >
          ← Back to Store
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-gray-800 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-gray-800 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiMenu size={24} />
            </button>

            {/* Page title */}
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                {menuItems.find(item => isActive(item))?.label || 'Admin'}
              </h1>
              <p className="text-xs text-gray-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
              {user?.first_name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;