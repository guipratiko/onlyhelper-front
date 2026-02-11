import { Navigate, useLocation } from 'react-router-dom';

export function hasToken() {
  return !!localStorage.getItem('onlyhelper_token');
}

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!hasToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
