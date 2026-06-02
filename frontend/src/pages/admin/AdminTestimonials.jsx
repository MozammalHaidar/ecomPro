import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiTrash2, FiStar, FiRefreshCw } from 'react-icons/fi';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('testimonials/admin/');
      setTestimonials(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const handleApprove = async (id) => {
  //   try {
  //     const res = await api.patch(`testimonials/admin/${id}/approve/`);
  //     setTestimonials((prev) =>
  //       prev.map((t) =>
  //         t.id === id ? { ...t, is_approved: res.data.is_approved } : t
  //       )
  //     );
  //     toast.success(res.data.message);
  //   } catch (err) {
  //     toast.error('Failed to update testimonial');
  //   }
  // };
  
  const handleApprove = async (id) => {
  try {
    const res = await api.patch(`testimonials/admin/${id}/approve/`);
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, is_approved: res.data.is_approved } : t
      )
    );
    toast.success(res.data.message);
    // Refresh list after approval
    fetchTestimonials();
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.error || 'Failed to update testimonial');
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`testimonials/admin/${id}/delete/`);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success('Testimonial deleted');
    } catch (err) {
      toast.error('Failed to delete testimonial');
    }
  };

  const filtered = testimonials.filter((t) => {
    if (filter === 'approved') return t.is_approved;
    if (filter === 'pending') return !t.is_approved;
    return true;
  });

  if (loading) return <Spinner />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">
            {testimonials.filter(t => !t.is_approved).length} pending approval
          </p>
        </div>
        <button
          onClick={fetchTestimonials}
          className="flex items-center gap-2 text-primary-600 hover:underline text-sm"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-xl shadow-sm p-1.5 w-fit">
        {[
          { key: 'all',      label: `All (${testimonials.length})` },
          { key: 'pending',  label: `Pending (${testimonials.filter(t => !t.is_approved).length})` },
          { key: 'approved', label: `Approved (${testimonials.filter(t => t.is_approved).length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === tab.key
                ? 'bg-primary-600 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Testimonials Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm text-gray-400">
          <FiStar size={48} className="mx-auto mb-3 text-gray-300" />
          <p>No testimonials found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl shadow-sm p-5 border-2 ${
                t.is_approved
                  ? 'border-green-100'
                  : 'border-yellow-100'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                    {t.avatar_letter}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    {t.location && (
                      <p className="text-gray-400 text-xs">{t.location}</p>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  t.is_approved
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {t.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={12}
                    className={star <= t.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                    }
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {t.comment}
              </p>

              {/* Date */}
              <p className="text-xs text-gray-400 mb-4">
                {new Date(t.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(t.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition ${
                    t.is_approved
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  <FiCheck size={14} />
                  {t.is_approved ? 'Unapprove' : 'Approve'}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100 transition"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;