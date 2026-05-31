export const getImageUrl = (url) => {
  if (!url) return '/placeholder.png';

  // Already correct Cloudinary URL
  if (url.includes('res.cloudinary.com')) {
    if (url.includes('/image/upload/')) return url;
    return url.replace(
      /res\.cloudinary\.com\/([^/]+)\//,
      'res.cloudinary.com/$1/image/upload/'
    );
  }

  // Full Render URL with /media/
  if (url.includes('onrender.com')) {
    // Extract just the filename path
    const path = url.split('/media/')[1];
    if (path) {
      return `https://res.cloudinary.com/ddiouxm0f/image/upload/${path}`;
    }
  }

  // Full http URL
  if (url.startsWith('http')) return url;

  // Local /media/ path
  if (url.startsWith('/media/')) {
    return `https://res.cloudinary.com/ddiouxm0f/image/upload/${url.replace('/media/', '')}`;
  }

  // Just filename like products/laptop.jpg
  return `https://res.cloudinary.com/ddiouxm0f/image/upload/${url}`;
};