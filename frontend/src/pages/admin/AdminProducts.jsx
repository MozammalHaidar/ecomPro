import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const emptyForm = {
  name: '', slug: '', description: '', price: '',
  discount_price: '', stock: '', category: '',
  is_active: true, featured: false,
};

const AdminProducts = () => {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('products/'),
        api.get('products/categories/'),
      ]);
      setProducts(pRes.data.results || pRes.data);
      setCategories(cRes.data.results || cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discount_price: product.discount_price || '',
      stock: product.stock,
      category: product.category,
      is_active: product.is_active,
      featured: product.featured,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Auto generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== '') formData.append(key, val);
      });
      if (imageFile) formData.append('image', imageFile);

      if (editing) {
        await api.patch(`products/${editing.slug}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated');
      } else {
        await api.post('products/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created');
      }

      setShowForm(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`products/${slug}/`);
      toast.success('Product deleted');
      fetchAll();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition font-medium"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-500 text-left">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-gray-400 text-xs">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category_name}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">${product.price}</p>
                    {product.discount_price && (
                      <p className="text-xs text-green-500">Sale: ${product.discount_price}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.slug, product.name)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleNameChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 bg-gray-50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Price + Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price ($)</label>
                    <input
                      name="discount_price"
                      type="number"
                      step="0.01"
                      value={form.discount_price}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Stock + Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary-600"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 mt-2"
                >
                  <FiSave size={18} />
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;