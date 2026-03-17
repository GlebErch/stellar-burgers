import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  selectBun,
  selectIngredients,
  clearConstructor
} from '../../services/slices/burger-slice';
import {
  createOrder,
  closeOrderModal
} from '../../services/slices/order-slice';
import { selectUser } from '../../services/slices/user-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(selectBun);
  const ingredients = useSelector(selectIngredients);
  const user = useSelector(selectUser);
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);

  const constructorItems = {
    bun,
    ingredients
  };

  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const orderData = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(orderData));
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
