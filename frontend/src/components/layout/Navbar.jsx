import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiPackage, FiSettings, FiShield, FiTrendingUp, FiHeart } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../common/Avatar';



const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, access } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary-600">
          ShopZone
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-primary-600 transition">Home</Link>
          <Link to="/products" className="text-gray-600 hover:text-primary-600 transition">Products</Link>
          {access && (
            <Link to="/orders" className="text-gray-600 hover:text-primary-600 transition">Orders</Link>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-600 hover:text-primary-600 transition">
            <FiShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {access ? (
            // Profile Dropdown
            <div className="relative hidden md:block" ref={dropdownRef}>
             <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-xl transition"
              >
                {/* Avatar */}
                <Avatar user={user} size="sm" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.first_name || 'Account'}
                </span>
                <motion.span
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 text-xs"
                >
                  ▼
                </motion.span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {/* User Info Header */}
                  <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} size="lg" className="border-2 border-white" />
                      <div>
                        <p className="text-white font-semibold">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-primary-100 text-xs truncate">
                          {user?.email}
                        </p>
                        {user?.is_staff && (
                          <span className="flex items-center gap-1 text-xs bg-white text-primary-600 px-2 py-0.5 rounded-full mt-1 w-fit font-medium">
                            <FiShield size={10} /> Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 text-sm font-medium"
                      >
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <FiUser size={15} className="text-blue-500" />
                        </div>
                        My Profile
                      </Link>

                     <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 text-sm font-medium"
                      >
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                          <FiPackage size={15} className="text-green-500" />
                        </div>
                        My Orders
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 text-sm font-medium"
                      >
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                          <FiHeart size={15} className="text-red-500" />
                        </div>
                        My Wishlist
                      </Link>

                      {user?.is_staff && (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 text-sm font-medium"
                            >
                              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                <FiShield size={15} className="text-purple-500" />
                              </div>
                              Admin Dashboard
                            </Link>
                            <Link
                              to="/admin/charts"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 text-sm font-medium"
                            >
                              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                                <FiTrendingUp size={15} className="text-teal-500" />
                              </div>
                              Sales Analytics
                            </Link>
                          </>
                        )}

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 text-sm font-medium"
                      >
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                          <FiSettings size={15} className="text-gray-500" />
                        </div>
                        Settings
                      </Link>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-2" />

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition text-red-500 text-sm font-medium"
                      >
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                          <FiLogOut size={15} className="text-red-500" />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-gray-600 hover:text-primary-600 transition text-sm font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-primary-700 transition font-medium"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white px-4 pb-4 flex flex-col gap-1"
          >
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700"
            >
              Products
            </Link>

            {access ? (
              <>
                {/* Mobile User Info */}
                <div className="flex items-center gap-3 px-3 py-3 bg-primary-50 rounded-xl my-1">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.first_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700"
                >
                  <FiUser size={16} /> My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700"
                >
                  <FiPackage size={16} /> My Orders
                </Link>
                {user?.is_staff && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700"
                  >
                    <FiShield size={16} /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-500 w-full text-left"
                >
                  <FiLogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700"
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;