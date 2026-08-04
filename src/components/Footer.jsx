import styles from '../styles/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      &copy; {new Date().getFullYear()} API used: 
    </footer>
  );
}

export default Footer;