import { Outlet, useNavigate } from 'react-router-dom';
import { WsProvider } from '../contexts/WsContext';
import MenuHeader from './MenuHeader';
import Footer from './Footer';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('onlyhelper_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function AppLayout() {
  const navigate = useNavigate();
  const user = getStoredUser();

  function handleLogout() {
    localStorage.removeItem('onlyhelper_token');
    localStorage.removeItem('onlyhelper_user');
    navigate('/login', { replace: true });
  }

  const footerLinks = [
    { label: 'Início', to: '/' },
    { label: 'Atendimentos', to: '/atendimentos' },
    { label: 'Fila', to: '/fila' },
    ...(user?.role === 'admin' ? [{ label: 'Monitorar conversas', to: '/monitorar' }, { label: 'Admin', to: '/admin' }] : []),
  ];

  return (
    <>
      <MenuHeader
        logoSrc="/Onlyhelper-claro.png"
        user={{ name: user?.name }}
        onLogout={handleLogout}
        menuItems={footerLinks}
      />
      <WsProvider>
        <div className="layoutWrap">
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </WsProvider>
    </>
  );
}
