import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { fetchIngredients } from '../../services/ingredients/ingredientsSlice';
import { useDispatch } from '../../services/store';
import { getUser, setAuthChecked } from '../../services/user/userSlice';
import { getCookie } from '../../utils/cookie';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Жестко типизируем state, чтобы линтер не ругался на any
  const background = (location.state as { background?: Location })?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());

    const hasToken = getCookie('accessToken') ?? localStorage.getItem('refreshToken');

    if (hasToken) {
      void dispatch(getUser());
    } else {
      void dispatch(setAuthChecked());
    }
  }, [dispatch]);

  const handleCloseModal = (): void => {
    void navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ingredients/:id"
          element={
            <div className={styles.detailPageWrap}>
              <h3 className={`${styles.detailHeader} text text_type_main-large`}>
                Детали ингредиента
              </h3>
              <IngredientDetails />
            </div>
          }
        />

        <Route
          path="/feed/:number"
          element={
            <div className={styles.detailPageWrap}>
              <OrderInfo />
            </div>
          }
        />

        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <div className={styles.detailPageWrap}>
                <OrderInfo />
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title="Информация о заказе" onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
