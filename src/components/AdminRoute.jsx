import { Navigate } from 'react-router-dom';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('onlyhelper_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function AdminRoute({ children }) {
  const user = getStoredUser();
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}
