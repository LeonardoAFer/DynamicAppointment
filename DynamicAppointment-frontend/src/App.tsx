import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import GuestView from './pages/GuestView';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Professionals from './pages/admin/Professionals';
import Services from './pages/admin/Services';
import Appointments from './pages/admin/Appointments';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<div className="min-h-screen bg-surface font-sans"><Booking /></div>} />
            <Route path="/confirmacao" element={<div className="min-h-screen bg-surface font-sans"><Confirmation /></div>} />
            <Route path="/meu-agendamento/:token" element={<div className="min-h-screen bg-surface font-sans"><GuestView /></div>} />

            <Route path="/admin">
              <Route path="login" element={<Login />} />
              <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="profissionais" element={<Professionals />} />
                <Route path="servicos" element={<Services />} />
                <Route path="agendamentos" element={<Appointments />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
