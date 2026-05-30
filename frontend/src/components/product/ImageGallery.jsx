import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZoomIn, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getImageUrl } from '../../utils/imageUrl';

const ImageGallery = ({ mainImage, images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Build full image list
  const allImages = [];

  // Add main image first if exists
  if (mainImage) {
  allImages.push({
    id: 'main',
    image: getImageUrl(mainImage),
    alt_text: productName,
  });
}

// Add gallery images
if (images && images.length > 0) {
  images.forEach((img) => {
    allImages.push({
      id: img.id,
      image: getImageUrl(img.image),
      alt_text: img.alt_text || productName,
    });
  });
}

  const currentImage = selectedImage || allImages[0];

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = () => {
    setLightboxIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setLightboxIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') closeLightbox();
  };

  if (allImages.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">

      {/* Main Image */}
      <div className="relative group bg-white rounded-2xl overflow-hidden shadow-sm">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage?.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            src={currentImage?.image || '/placeholder.png'}
            alt={currentImage?.alt_text || productName}
            className="w-full h-96 object-contain p-4 bg-gray-50"
          />
        </AnimatePresence>

        {/* Zoom Button */}
        <button
          onClick={() => openLightbox(allImages.indexOf(currentImage))}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-primary-600 transition opacity-0 group-hover:opacity-100"
        >
          <FiZoomIn size={18} />
        </button>

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            {allImages.indexOf(currentImage) + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                currentImage?.image === img.image
                  ? 'border-primary-500 shadow-md'
                  : 'border-transparent hover:border-primary-300'
              }`}
            >
              <img
                src={img.image}
                alt={img.alt_text}
                className="w-full h-full object-contain p-1 bg-gray-50"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
            >
              <FiX size={32} />
            </button>

            {/* Prev Button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 text-white hover:text-gray-300 transition z-10 bg-black bg-opacity-50 rounded-full p-2"
              >
                <FiChevronLeft size={32} />
              </button>
            )}

            {/* Main Lightbox Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={allImages[lightboxIndex]?.image}
              alt={allImages[lightboxIndex]?.alt_text}
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 text-white hover:text-gray-300 transition z-10 bg-black bg-opacity-50 rounded-full p-2"
              >
                <FiChevronRight size={32} />
              </button>
            )}

            {/* Lightbox Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-1 rounded-full">
              {lightboxIndex + 1} / {allImages.length}
            </div>

            {/* Lightbox Thumbnails */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                    lightboxIndex === i
                      ? 'border-primary-400'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.image}
                    alt={img.alt_text}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery;