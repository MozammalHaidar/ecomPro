import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiGrid } from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('products/categories/');
      setCategories(res.data.results || res.data);
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

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
        await api.patch(`products/categories/${editing.slug}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category updated');
      } else {
        await api.post('products/categories/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Category created');
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Delete "${name}"? This will affect all products in this category.`)) return;
    try {
      await api.delete(`products/categories/${slug}/`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">
            {categories.length} total categories
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition font-medium"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm text-gray-400">
          <FiGrid size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No categories yet</p>
          <p className="text-sm mt-1">Create your first category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-sm p-5"
            >
              <div className="flex items-center gap-4 mb-3">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-14 h-14 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center">
                    <FiGrid size={24} className="text-primary-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{cat.name}</h3>
                  <p className="text-xs text-gray-400">{cat.slug}</p>
                  <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                    {cat.product_count} products
                  </span>
                </div>
              </div>

              {cat.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {cat.description}
                </p>
              )}

              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                >
                  <FiEdit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.slug, cat.name)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100 transition"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Electronics"
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Category description"
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                >
                  <FiSave size={18} />
                  {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;