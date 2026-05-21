import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMail, FiCalendar, FiShield } from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('accounts/users/');
        setUsers(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
        <span className="bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium">
          {users.length} total users
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl shadow-sm p-5"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUsers size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {user.first_name} {user.last_name}
                </p>
                {user.is_staff && (
                  <span className="flex items-center gap-1 text-xs text-primary-600 font-medium">
                    <FiShield size={10} /> Admin
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiMail size={14} className="text-gray-400" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📞</span>
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;