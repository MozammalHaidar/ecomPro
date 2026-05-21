import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiTag } from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const emptyForm = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  minimum_order: 0,
  maximum_discount: '',
  is_active: true,
  usage_limit: 0,
  valid_from: new Date().toISOString().slice(0, 16),
  valid_to: '',
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('coupons/admin/');
      setCoupons(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_order: coupon.minimum_order,
      maximum_discount: coupon.maximum_discount || '',
      is_active: coupon.is_active,
      usage_limit: coupon.usage_limit,
      valid_from: coupon.valid_from?.slice(0, 16) || '',
      valid_to: coupon.valid_to?.slice(0, 16) || '',
    });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase(),
        maximum_discount: form.maximum_discount || null,
        valid_to: form.valid_to || null,
      };

      if (editing) {
        await api.put(`coupons/admin/${editing.id}/`, payload);
        toast.success('Coupon updated');
      } else {
        await api.post('coupons/admin/', payload);
        toast.success('Coupon created');
      }
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.delete(`coupons/admin/${id}/`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Coupons</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition font-medium"
        >
          <FiPlus /> Add Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-500 text-left">
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Min Order</th>
                <th className="px-6 py-4 font-medium">Used</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Expires</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    No coupons yet. Create your first one!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon, i) => (
                  <motion.tr
                    key={coupon.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                          <FiTag size={14} className="text-primary-600" />
                        </div>
                        <span className="font-bold text-gray-800 tracking-wide">
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-500">
                      {coupon.discount_type}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary-600">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}%`
                        : `$${coupon.discount_value}`}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      ${coupon.minimum_order}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {coupon.used_count}
                      {coupon.usage_limit > 0 && ` / ${coupon.usage_limit}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {coupon.valid_to
                        ? new Date(coupon.valid_to).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(coupon)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? 'Edit Coupon' : 'Add New Coupon'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

                {/* Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code
                  </label>
                  <input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. WELCOME10"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 uppercase font-bold tracking-wider"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="e.g. 10% off your first order"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Discount Type + Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type
                    </label>
                    <select
                      name="discount_type"
                      value={form.discount_type}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value
                    </label>
                    <input
                      name="discount_value"
                      type="number"
                      step="0.01"
                      value={form.discount_value}
                      onChange={handleChange}
                      placeholder={form.discount_type === 'percentage' ? '10' : '15.00'}
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Min Order + Max Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Order ($)
                    </label>
                    <input
                      name="minimum_order"
                      type="number"
                      step="0.01"
                      value={form.minimum_order}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Discount ($)
                    </label>
                    <input
                      name="maximum_discount"
                      type="number"
                      step="0.01"
                      value={form.maximum_discount}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit (0 = unlimited)
                  </label>
                  <input
                    name="usage_limit"
                    type="number"
                    value={form.usage_limit}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Valid From + Valid To */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid From
                    </label>
                    <input
                      name="valid_from"
                      type="datetime-local"
                      value={form.valid_from}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid To (optional)
                    </label>
                    <input
                      name="valid_to"
                      type="datetime-local"
                      value={form.valid_to}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Active */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary-600"
                  />
                  <span className="text-sm text-gray-700 font-medium">Active</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 mt-2"
                >
                  <FiSave size={18} />
                  {saving ? 'Saving...' : editing ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;