import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import ProductCard from './ProductCard';

const RelatedProducts = ({ categorySlug, currentSlug }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        console.log('Fetching related for category:', categorySlug);
        const res = await api.get('products/', {
          params: { category: categorySlug },
        });
        console.log('API response:', res.data);
        const allProducts = res.data.results || res.data;
        const filtered = allProducts
          .filter((p) => p.slug !== currentSlug)
          .slice(0, 4);
        console.log('Filtered related:', filtered);
        setRelated(filtered);
      } catch (err) {
        console.error('Related products error:', err);
      }
    };

    if (categorySlug) fetchRelated();
  }, [categorySlug, currentSlug]);

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {related.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;