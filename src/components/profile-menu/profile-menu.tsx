import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/user/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => {
        void navigate('/login');
      })
      .catch(() => {
        // Ошибка обрабатывается в Redux
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
