import orderReducer, { createOrder, closeOrderModal } from './order-slice';

describe('orderSlice', () => {
  const initialState = orderReducer(undefined, { type: '@@INIT' });

  it('должен устанавливать orderRequest в true при pending', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять заказ и устанавливать orderRequest в false при fulfilled', () => {
    const mockOrder = { number: 12345 };
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('должен сохранять ошибку и устанавливать orderRequest в false при rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Ошибка заказа' }
    };
    const state = orderReducer(initialState, action);

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка заказа');
  });
});
