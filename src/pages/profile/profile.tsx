import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/user-slice';
import { selectUser } from '../../services/slices/user-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /** TODO: взять переменную из стора */
  const user = useSelector(selectUser) || { name: '', email: '' };

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    const updatedData: { name?: string; email?: string; password?: string } =
      {};
    if (formValue.name !== user?.name) updatedData.name = formValue.name;
    if (formValue.email !== user?.email) updatedData.email = formValue.email;
    if (formValue.password) updatedData.password = formValue.password;

    if (Object.keys(updatedData).length > 0) {
      dispatch(updateUser(updatedData))
        .unwrap()
        .catch((err) => {
          setError(err.message || 'Ошибка обновления профиля');
        });
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
