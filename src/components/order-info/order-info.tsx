import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { getOrderByNumber } from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  /** TODO: взять переменные orderData и ingredients из стора */
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.items
  );

  const feedOrder = useSelector((state) =>
    state.feed?.orders?.find((order) => order.number === Number(number))
  );

  const profileOrder = useSelector((state) =>
    state.profileOrders?.orders?.find(
      (order) => order.number === Number(number)
    )
  );

  const orderByNumber = useSelector((state) => state.order?.orderByNumber);

  const orderData = feedOrder ||
    profileOrder ||
    orderByNumber || {
      createdAt: '',
      ingredients: [],
      _id: '',
      status: '',
      name: '',
      updatedAt: 'string',
      number: 0
    };

  useEffect(() => {
    if (!feedOrder && !profileOrder && !orderByNumber && number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, feedOrder, profileOrder, orderByNumber, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
