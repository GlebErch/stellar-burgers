import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '@api';

type TProfileOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const getUserOrders = createAsyncThunk(
  'profileOrders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки истории заказов';
      return rejectWithValue(message);
    }
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectProfileOrders = (state: {
  profileOrders: TProfileOrdersState;
}) => state.profileOrders.orders;

export default profileOrdersSlice.reducer;
