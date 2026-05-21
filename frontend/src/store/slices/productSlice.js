import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('products/', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchProductDetail = createAsyncThunk('products/fetchOne', async (slug, { rejectWithValue }) => {
  try {
    const res = await api.get(`products/${slug}/`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchFeatured = createAsyncThunk('products/featured/', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('products/featured/');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const fetchCategories = createAsyncThunk('products/categories', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('products/categories/');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    featured: [],
    categories: [],
    detail: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
  },
  reducers: {
    clearDetail: (state) => { state.detail = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results;
        state.totalPages = Math.ceil(action.payload.count / 12);
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProductDetail.pending, (state) => { state.loading = true; })
      .addCase(fetchProductDetail.fulfilled, (state, action) => { state.loading = false; state.detail = action.payload; })
      .addCase(fetchProductDetail.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload.results || action.payload; })
  },
});

export const { clearDetail } = productSlice.actions;
export default productSlice.reducer;