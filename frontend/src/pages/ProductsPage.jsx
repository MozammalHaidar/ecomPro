import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import {
  FiSearch, FiFilter, FiX,
  FiChevronLeft, FiChevronRight,
  FiGrid, FiList, FiSliders
} from 'react-icons/fi';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { items, categories, loading, totalPages } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [ordering, setOrdering] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (ordering) params.ordering = ordering;
    params.page = page;
    dispatch(fetchProducts(params));
  }, [dispatch, search, category, minPrice, maxPrice, ordering, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setOrdering('');
    setPage(1);
  };

  const hasActiveFilters = search || category || minPrice || maxPrice || ordering;

  // Pagination helpers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
              <p className="text-gray-500 text-sm mt-1">
                {loading ? 'Loading...' : `Showing page ${page} of ${totalPages || 1}`}
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary-500 transition bg-gray-50"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => { setSearch(''); setPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2.5 rounded-xl hover:bg-primary-700 transition"
              >
                <FiSearch size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Sidebar Filters — Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FiSliders size={16} className="text-primary-600" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-red-400 hover:text-red-600 transition font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setCategory(''); setPage(1); }}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition ${
                      !category
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setCategory(cat.slug); setPage(1); }}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition flex items-center justify-between ${
                        category === cat.slug
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {cat.product_count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { value: '', label: 'Default' },
                    { value: 'price', label: 'Price: Low to High' },
                    { value: '-price', label: 'Price: High to Low' },
                    { value: '-created_at', label: 'Newest First' },
                    { value: 'name', label: 'Name A-Z' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setOrdering(opt.value); setPage(1); }}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition ${
                        ordering === opt.value
                          ? 'bg-primary-50 text-primary-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-xl shadow-sm px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition"
                >
                  <FiFilter size={16} />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-primary-600 rounded-full" />
                  )}
                </button>

                {/* Active filter tags */}
                <div className="hidden md:flex items-center gap-2 flex-wrap">
                  {category && (
                    <span className="flex items-center gap-1 bg-primary-50 text-primary-600 text-xs px-3 py-1 rounded-full font-medium">
                      {categories.find(c => c.slug === category)?.name}
                      <button onClick={() => { setCategory(''); setPage(1); }}>
                        <FiX size={12} />
                      </button>
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className="flex items-center gap-1 bg-primary-50 text-primary-600 text-xs px-3 py-1 rounded-full font-medium">
                      ${minPrice || 0} - ${maxPrice || '∞'}
                      <button onClick={() => { setMinPrice(''); setMaxPrice(''); setPage(1); }}>
                        <FiX size={12} />
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white rounded-2xl shadow-sm p-5 mb-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    >
                      <option value="">All</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      value={ordering}
                      onChange={(e) => { setOrdering(e.target.value); setPage(1); }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    >
                      <option value="">Default</option>
                      <option value="price">Price: Low to High</option>
                      <option value="-price">Price: High to Low</option>
                      <option value="-created_at">Newest First</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                    <input
                      type="number"
                      placeholder="Any"
                      value={maxPrice}
                      onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-3 text-sm text-red-400 hover:text-red-600 transition"
                  >
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : items.length > 0 ? (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'flex flex-col gap-4'
                }>
                  {items.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {viewMode === 'list' ? (
                        // List View
                        <div className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center hover:shadow-md transition">
                          <img
                            src={
                              product.image
                                ? product.image.startsWith('http')
                                  ? product.image
                                  : `http://127.0.0.1:8000${product.image}`
                                : '/placeholder.png'
                            }
                            alt={product.name}
                            className="w-24 h-24 object-contain rounded-xl bg-gray-50 p-2 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1">{product.category_name}</p>
                            <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                            <div className="flex items-center gap-1 mb-2">
                              <FiFilter size={12} className="text-yellow-400" />
                              <span className="text-xs text-gray-500">{product.average_rating || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-primary-600 font-bold">${product.final_price}</span>
                              {product.discount_price && (
                                <span className="text-gray-400 text-sm line-through">${product.price}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              product.stock > 0
                                ? 'bg-green-100 text-green-600'
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        // Grid View
                        <ProductCard product={product} />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {/* Prev */}
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed bg-white text-sm font-medium"
                    >
                      <FiChevronLeft size={16} /> Prev
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((p, i) => (
                        p === '...' ? (
                          <span key={i} className="w-10 h-10 flex items-center justify-center text-gray-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={i}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-xl font-semibold transition text-sm ${
                              page === p
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      ))}
                    </div>

                    {/* Next */}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed bg-white text-sm font-medium"
                    >
                      Next <FiChevronRight size={16} />
                    </button>
                  </div>
                )}

                {/* Page info */}
                {totalPages > 1 && (
                  <p className="text-center text-sm text-gray-400 mt-3">
                    Page {page} of {totalPages}
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <FiFilter size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-semibold text-gray-600">No products found</p>
                <p className="text-sm text-gray-400 mt-2 mb-6">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;