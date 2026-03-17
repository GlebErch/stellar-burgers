import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки ленты заказов';
      return rejectWithValue(message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectFeed = (state: { feed: TFeedState }) => state.feed;
export const selectOrders = (state: { feed: TFeedState }) => state.feed.orders;
export const selectTotal = (state: { feed: TFeedState }) => state.feed.total;
export const selectTotalToday = (state: { feed: TFeedState }) =>
  state.feed.totalToday;
export const selectFeedLoading = (state: { feed: TFeedState }) =>
  state.feed.loading;

export default feedSlice.reducer;
