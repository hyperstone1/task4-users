import { useAppSelector } from './redux-hooks';

export function useAuth() {
  const { email, token, id, name } = useAppSelector((state) => state.user);
  return {
    isAuth: !!email || !!localStorage.getItem('token'),
    email,
    token,
    id,
    name,
  };
}
