import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Atendimentos from './pages/Atendimentos';
import Fila from './pages/Fila';
import Widget from './pages/Widget';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import MonitorarConversas from './pages/MonitorarConversas';
import AdminRoute from './components/AdminRoute';
import Privacidade from './pages/Privacidade';
import Termos from './pages/Termos';
import Documentacao from './pages/Documentacao';

function App() {
  return (
    <Routes>
      <Route path="/widget" element={<Widget />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="/documentacao" element={<Documentacao />} />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="atendimentos" element={<Atendimentos />} />
        <Route path="atendimentos/:ticketId" element={<Chat />} />
        <Route path="fila" element={<Fila />} />
        <Route path="monitorar" element={<AdminRoute><MonitorarConversas /></AdminRoute>} />
        <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
