import { ForgotPasswordUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { forgotPassword } from '../../services/user/userSlice';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch(() => {
        // Ошибка обрабатывается в Redux
      });
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
