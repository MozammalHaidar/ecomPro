// src/utils/keepAlive.js
export const pingBackend = () => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/?limit=1`)
    .catch(() => {});
};