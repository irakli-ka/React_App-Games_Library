import styles from '../styles/Footer.module.css';

function Footer() {
  return <footer className={styles.footer}>&copy; {new Date().getFullYear()} Made For Front-End React Final Project</footer>;
};

export default Footer;