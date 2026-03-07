import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  selectOrders,
  selectTotal,
  selectTotalToday
} from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectOrders);
  const total = useSelector(selectTotal);
  const totalToday = useSelector(selectTotalToday);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  const readyOrders = orders
    .filter((order) => order.status === 'done')
    .slice(0, 10);
  const pendingOrders = orders
    .filter((order) => order.status === 'pending')
    .slice(0, 10);

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(getFeeds())}
      total={total}
      totalToday={totalToday}
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};
