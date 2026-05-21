import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('products/wishlist/');
    return res.data.results || res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (slug, { rejectWithValue }) => {
  try {
    const res = await api.post(`products/${slug}/wishlist/`);
    return { slug, wishlisted: res.data.wishlisted };
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => { state.loading = false; })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { slug, wishlisted } = action.payload;
        if (!wishlisted) {
          state.items = state.items.filter(
            (item) => item.product.slug !== slug
          );
        }
      });
  },
});

export default wishlistSlice.reducer;