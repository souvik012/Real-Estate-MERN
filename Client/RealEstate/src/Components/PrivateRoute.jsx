import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentuser } = useSelector((state) => state.user);
  console.log("PrivateRoute - Current User:", currentuser); // Debugging line

  return currentuser ? <Outlet /> : <Navigate to='/SignIn' />;
}
 // <div>PrivateRoute</div>