import styles from '../styles/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      &copy; {new Date().getFullYear()} Made For Front-End React Final Project. API used: 
      <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer" className={styles.link}>
        RAWG
      </a>
    </footer>
  );
}

export default Footer;