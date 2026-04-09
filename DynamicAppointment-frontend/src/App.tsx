import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import GuestView from './pages/GuestView';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface font-sans">
        <Routes>
          <Route path="/" element={<Booking />} />
          <Route path="/confirmacao" element={<Confirmation />} />
          <Route path="/meu-agendamento/:token" element={<GuestView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
