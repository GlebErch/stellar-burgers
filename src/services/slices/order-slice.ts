import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api'; // Добавляем импорт
import { TOrder } from '../../utils/types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderByNumber: TOrder | null; // Добавляем поле для заказа по номеру
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
  error: null
};

// Существующий createOrder
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return {
      ...response.order,
      ingredients: data
    } as TOrder;
  }
);

// Новый thunk для получения заказа по номеру
export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue('Ошибка загрузки заказа');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Существующие редьюсеры для createOrder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })
      // Новые редьюсеры для getOrderByNumber
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
