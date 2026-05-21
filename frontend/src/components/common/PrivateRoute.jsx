import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { access } = useSelector((state) => state.auth);
  return access ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;