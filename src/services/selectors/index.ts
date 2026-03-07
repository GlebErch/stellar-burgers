import { RootState } from '../store';

export const ingredientsSelector = (state: RootState) =>
  state.ingredients?.items || [];
export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients?.loading;

export const burgerBunSelector = (state: RootState) =>
  state.burger?.constructorItems?.bun;
export const burgerIngredientsSelector = (state: RootState) =>
  state.burger?.constructorItems?.ingredients || [];

export const userSelector = (state: RootState) => state.user?.user;
export const isAuthCheckedSelector = (state: RootState) =>
  state.user?.isAuthChecked;

export const orderRequestSelector = (state: RootState) =>
  state.order?.orderRequest;
export const orderModalDataSelector = (state: RootState) =>
  state.order?.orderModalData;

export const feedOrdersSelector = (state: RootState) =>
  state.feed?.orders || [];
export const feedTotalSelector = (state: RootState) => state.feed?.total || 0;
export const feedTotalTodaySelector = (state: RootState) =>
  state.feed?.totalToday || 0;

export const profileOrdersSelector = (state: RootState) =>
  state.profileOrders?.orders || [];
