import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import Orders from './pages/orders';
import SignUpPage from './pages/signUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/signUp" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
