import styles from '../styles/Navbar.module.css';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navLink}>Home</Link>
      <Link to="/Tracker" className={styles.navLink}>Tracker</Link>
      <Link to="/Settings" className={styles.navLink}>Settings</Link>
    </nav>
  );
};

export default Navbar;
