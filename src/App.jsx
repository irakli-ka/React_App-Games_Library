import { HashRouter as Router, Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tracker from './pages/Tracker';
import Settings from './pages/Settings';
import ErrorPage from './pages/ErrorPage';
import { DarkModeProvider } from './context/DarkModeContext';
import './App.css';

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </Router>
    </DarkModeProvider>
  );
}

export default App;