// export const getImageUrl = (url) => {
//   if (!url) return '/placeholder.png';

//   // Already correct Cloudinary URL
//   if (url.includes('res.cloudinary.com')) {
//     if (url.includes('/image/upload/')) return url;
//     return url.replace(
//       /res\.cloudinary\.com\/([^/]+)\//,
//       'res.cloudinary.com/$1/image/upload/'
//     );
//   }

//   // Full Render URL with /media/
//   if (url.includes('onrender.com')) {
//     // Extract just the filename path
//     const path = url.split('/media/')[1];
//     if (path) {
//       return `https://res.cloudinary.com/ddiouxm0f/image/upload/${path}`;
//     }
//   }

//   // Full http URL
//   if (url.startsWith('http')) return url;

//   // Local /media/ path
//   if (url.startsWith('/media/')) {
//     return `https://res.cloudinary.com/ddiouxm0f/image/upload/${url.replace('/media/', '')}`;
//   }

//   // Just filename like products/laptop.jpg
//   return `https://res.cloudinary.com/ddiouxm0f/image/upload/${url}`;
// };

// Cloudinary optimization params — change w_200 if you need a different size
const CL_OPT = 'f_auto,q_auto,w_200';
const CL_BASE = `https://res.cloudinary.com/ddiouxm0f/image/upload/${CL_OPT}`;

export const getImageUrl = (url) => {
  if (!url) return '/placeholder.png';

  // Already a Cloudinary URL — inject optimization params if not already present
  if (url.includes('res.cloudinary.com')) {
    if (url.includes(CL_OPT)) return url; // already optimized, skip

    // If it has /image/upload/ already, inject params right after it
    if (url.includes('/image/upload/')) {
      return url.replace('/image/upload/', `/image/upload/${CL_OPT}/`);
    }

    // Missing /image/upload/ entirely — fix and add params
    return url.replace(
      /res\.cloudinary\.com\/([^/]+)\//,
      `res.cloudinary.com/$1/image/upload/${CL_OPT}/`
    );
  }

  // Render URL with /media/ — extract path and build optimized Cloudinary URL
  if (url.includes('onrender.com')) {
    const path = url.split('/media/')[1];
    if (path) return `${CL_BASE}/${path}`;
  }

  // Full external URL (not Cloudinary) — return as-is
  if (url.startsWith('http')) return url;

  // Local /media/ path
  if (url.startsWith('/media/')) {
    return `${CL_BASE}/${url.replace('/media/', '')}`;
  }

  // Just a filename like products/laptop.jpg
  return `${CL_BASE}/${url}`;
};