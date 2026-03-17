import feedReducer, { getFeeds } from './feed-slice';

describe('feedSlice', () => {
  const initialState = feedReducer(undefined, { type: '@@INIT' });

  it('должен устанавливать loading в true при pending', () => {
    const action = { type: getFeeds.pending.type };
    const state = feedReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять данные и устанавливать loading в false при fulfilled', () => {
    const mockFeed = {
      orders: [{ number: 12345 }],
      total: 100,
      totalToday: 10
    };
    const action = {
      type: getFeeds.fulfilled.type,
      payload: mockFeed
    };
    const state = feedReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockFeed.orders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.error).toBeNull();
  });

  it('должен сохранять ошибку и устанавливать loading в false при rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: getFeeds.rejected.type,
      payload: errorMessage
    };
    const state = feedReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
