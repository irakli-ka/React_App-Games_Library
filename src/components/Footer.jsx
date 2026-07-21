import styles from '../styles/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      &copy; {new Date().getFullYear()} API used: 
      <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer" className={styles.link}>
        RAWG
      </a>
    </footer>
  );
}

export default Footer;