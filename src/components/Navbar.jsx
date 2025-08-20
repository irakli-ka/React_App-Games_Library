import { useContext } from 'react';
import styles from '../styles/Navbar.module.css';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext'; // Use useAuth hook

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link to="/" className={styles.navLink}>Home</Link>
        <Link to="/list" className={styles.navLink}>My List</Link>
      </div>
      <div className={styles.authLinks}>
        {isAuthenticated ? (
          <>
            <span className={styles.navLink}>Welcome, {user?.username || user?.Username}!</span>
            <button onClick={handleLogout} className={styles.navLink}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.navLink}>Login</Link>
            <Link to="/signup" className={styles.navLink}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;