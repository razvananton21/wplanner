import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Rsvp from './pages/Rsvp';
import Admin from './pages/admin/Dashboard';
import InvitationPage from './pages/InvitationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Rsvp />} />
        <Route path="/rsvp" element={<Rsvp />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/invitation/:uuid" element={<InvitationPage />} />
      </Routes>
    </Router>
  );
}

export default App; 