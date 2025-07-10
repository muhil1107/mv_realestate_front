import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AddProperty from './pages/AddProperty';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/agent/add-property" element={<AddProperty />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
