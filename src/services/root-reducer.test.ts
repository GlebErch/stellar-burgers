import { rootReducer } from './root-reducer';
import ingredientsReducer from './slices/ingredients-slice';
import userReducer from './slices/user-slice';
import burgerReducer from './slices/burger-slice';
import orderReducer from './slices/order-slice';
import feedReducer from './slices/feed-slice';
import profileOrdersReducer from './slices/profile-orders-slice';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      user: userReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      burger: burgerReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      order: orderReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      feed: feedReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      profileOrders: profileOrdersReducer(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });
});
