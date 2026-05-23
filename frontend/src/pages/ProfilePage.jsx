import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { fetchProfile } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import api from '../services/api';
import Avatar from '../components/common/Avatar';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiLock, FiEye, FiEyeOff, FiCamera } from 'react-icons/fi';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Profile form
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  // Password form
  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) reset(user);
  }, [user, reset]);

  const onProfileSubmit = async (data) => {
  setLoading(true);
  try
  {
    // Only send text fields not avatar
    const { avatar, avatar_url, ...textData } = data;
    await api.patch('accounts/profile/', textData);
    dispatch(fetchProfile());
    toast.success('Profile updated successfully!');
  } catch (err) {
    toast.error('Failed to update profile');
  } finally {
    setLoading(false);
  }
};

  const onPasswordSubmit = async (data) => {
  if (data.new_password !== data.confirm_password) {
    toast.error('New passwords do not match');
    return;
  }
  setPasswordLoading(true);
  try {
    await api.post('accounts/change-password/', data);
    toast.success('Password changed successfully!');
    resetPwd();
  } catch (err) {
    const errorMsg = err.response?.data?.error || 'Failed to change password';
    toast.error(errorMsg);
  } finally {
    setPasswordLoading(false);
  }
};

const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    await api.patch('accounts/profile/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch(fetchProfile());
    toast.success('Profile photo updated!');
  } catch (err) {
    toast.error('Failed to update photo');
  }
};

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      {/* Avatar Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar user={user} size="xxl" />
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition shadow-md">
                  <FiCamera size={14} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                {user?.is_staff && (
                  <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                    Admin
                  </span>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Click the camera icon to update your photo
                </p>
              </div>
            </div>
          </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-sm p-1.5">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'profile'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiUser size={16} /> Edit Profile
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'password'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiLock size={16} /> Change Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <form onSubmit={handleSubmit(onProfileSubmit)} className="flex flex-col gap-5">

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('first_name')}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('last_name')}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={user?.email || ''}
                  disabled
                  className="w-full border border-gray-100 rounded-lg pl-10 pr-4 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
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
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  {...register('address')}
                  placeholder="Your full address"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 transition resize-none"
                />
              </div>
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              <FiSave size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <form onSubmit={handleSubmitPwd(onPasswordSubmit)} className="flex flex-col gap-5">

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...registerPwd('current_password', { required: true })}
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-primary-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {pwdErrors.current_password && (
                <p className="text-red-500 text-xs mt-1">Current password is required</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...registerPwd('new_password', { required: true, minLength: 6 })}
                  type={showNew ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-primary-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {pwdErrors.new_password && (
                <p className="text-red-500 text-xs mt-1">Minimum 6 characters required</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...registerPwd('confirm_password', { required: true })}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-primary-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {pwdErrors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">Please confirm your password</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
              <p className="font-medium text-gray-700 mb-2">Password requirements:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-primary-500">✓</span> Minimum 6 characters
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary-500">✓</span> Must be different from current password
                </li>
              </ul>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={passwordLoading}
              className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              <FiLock size={18} />
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;