import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../../store/slices/authSlice';

const AdminRoute = () => {
  const dispatch = useDispatch();
  const { access, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (access && !user) {
      dispatch(fetchProfile());
    }
  }, [access, user, dispatch]);

  if (!access) return <Navigate to="/login" />;
  if (!user) return null; // wait for profile to load
  if (!user.is_staff) return <Navigate to="/" />;

  return <Outlet />;
};

export default AdminRoute;