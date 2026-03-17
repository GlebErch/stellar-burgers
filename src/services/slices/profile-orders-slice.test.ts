import profileOrdersReducer, { getUserOrders } from './profile-orders-slice';

describe('profileOrdersSlice', () => {
  const initialState = profileOrdersReducer(undefined, { type: '@@INIT' });

  it('должен устанавливать loading в true при pending', () => {
    const action = { type: getUserOrders.pending.type };
    const state = profileOrdersReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять заказы и устанавливать loading в false при fulfilled', () => {
    const mockOrders = [{ number: 12345 }];
    const action = {
      type: getUserOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = profileOrdersReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  it('должен сохранять ошибку и устанавливать loading в false при rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: getUserOrders.rejected.type,
      payload: errorMessage
    };
    const state = profileOrdersReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
