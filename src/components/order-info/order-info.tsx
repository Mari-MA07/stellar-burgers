import { OrderInfoUI, Preloader } from '@ui';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  fetchOrderByNumber,
  selectCurrentOrder,
  clearCurrentOrder,
} from '../../services/feed/feedSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const order = useSelector(selectCurrentOrder);
  const { items: ingredients } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (number) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }

    return (): void => {
      void dispatch(clearCurrentOrder());
    };
  }, [dispatch, number]);

  if (!order) {
    return <Preloader />;
  }

  const ingredientsInfo = order.ingredients.reduce(
    (acc, id) => {
      const ingredient = ingredients.find((item: TIngredient) => item._id === id);

      if (ingredient) {
        if (!acc[id]) {
          acc[id] = { ...ingredient, count: 0 };
        }
        acc[id].count += 1;
      }

      return acc;
    },
    {} as Record<string, TIngredient & { count: number }>
  );

  const total = Object.values(ingredientsInfo).reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const orderInfo = {
    ...order,
    date: new Date(order.createdAt),
    total,
    ingredientsInfo,
  };

  return <OrderInfoUI orderInfo={orderInfo} />;
};
