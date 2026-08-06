import { HashRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tracker from './pages/Tracker';
import ErrorPage from './pages/ErrorPage';
import Game from './pages/Game';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import UserTracker from './pages/UserTracker';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/list" element={<Tracker />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/list/:username" element={<UserTracker />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;