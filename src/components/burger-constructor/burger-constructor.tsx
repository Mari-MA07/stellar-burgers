import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearConstructor } from '../../services/constructor/constructorSlice';
import { fetchFeeds } from '../../services/feed/feedSlice';
import { createOrder, selectOrder, clearOrder } from '../../services/order/orderSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burgerConstructor);
  const bun = constructorItems?.bun ?? null;
  const ingredients = constructorItems?.ingredients ?? [];

  const isAuth = useSelector((state) => state.user.isAuth);
  const orderRequest = useSelector((state) => state.order?.isLoading) ?? false;
  const orderModalData = useSelector(selectOrder);

  const onOrderClick = (): void => {
    if (!isAuth) {
      void navigate('/login');
      return;
    }

    if (!bun || orderRequest) {
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item: TConstructorIngredient) => item._id),
      bun._id,
    ];

    void dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        void dispatch(clearConstructor());
        void dispatch(fetchFeeds());
      })
      .catch(() => {
        // Ошибка обрабатывается в Redux
      });
  };

  const closeOrderModal = (): void => {
    void dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
