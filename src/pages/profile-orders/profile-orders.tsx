import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchProfileOrders } from '../../services/feed/feedSlice';
import { useSelector, useDispatch } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
