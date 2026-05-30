export const getImageUrl = (url) => {
  if (!url) return '/placeholder.png';
  
  // Already correct Cloudinary URL
  if (url.includes('/image/upload/')) return url;
  
  // Fix missing /image/upload/ in Cloudinary URL
  if (url.includes('res.cloudinary.com')) {
    return url.replace(
      /res\.cloudinary\.com\/([^/]+)\//,
      'res.cloudinary.com/$1/image/upload/'
    );
  }
  
  // Local URL
  if (url.startsWith('/media')) {
    return `http://127.0.0.1:8000${url}`;
  }
  
  return url;
};