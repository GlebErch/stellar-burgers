import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredients-slice';
import userReducer from './slices/user-slice';
import burgerReducer from './slices/burger-slice';
import orderReducer from './slices/order-slice';
import feedReducer from './slices/feed-slice';
import profileOrdersReducer from './slices/profile-orders-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burger: burgerReducer,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
});
