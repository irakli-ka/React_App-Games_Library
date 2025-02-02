import React, { useContext, useState, useEffect } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import styles from '../styles/Searchbar.module.css';
import sunIcon from "../assets/sun.svg";
import moonIcon from "../assets/moon.svg";
import searchIconLight from "../assets/search-light.svg";
import searchIconDark from "../assets/search-dark.svg";
import { motion } from 'framer-motion';

const SearchBar = ({ search, setSearch }) => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleThemeSwitch = () => {
    setIsSpinning(true);
    toggleDarkMode();
    setTimeout(() => setIsSpinning(false), 500); 
  };

  useEffect(() => {
    if (showEasterEgg) {
      const timer = setTimeout(() => {
        setShowEasterEgg(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showEasterEgg]);

  const handleGifClick = () => {
    if (!darkMode) {
      setShowEasterEgg(true);
    }
  };

  return (
    <div className={`${styles['search-bar-container']} ${darkMode ? styles['dark-mode'] : ''}`}>
      <div className={styles['search-bar']}>
        <input
          type="text"
          placeholder="Search Games"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={darkMode ? styles['dark-input'] : styles['light-input']}
        />
        <img src={darkMode ? searchIconDark : searchIconLight} alt="Search" className={styles['search-icon']} />
      </div>
      <motion.button
        className={styles['theme-switch']}
        onClick={handleThemeSwitch}
      >
        <motion.img
          src={darkMode ? sunIcon : moonIcon}
          alt="Toggle Dark Mode"
          animate={isSpinning ? { rotate: [0, 360] } : { rotate: 360 }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>
      <img
        src={darkMode ? "https://media.tenor.com/giNrzT0tQGsAAAAj/bonfire-dark-souls.gif" : "https://media.tenor.com/QTbcrC893SIAAAAi/solaire.gif"}
        alt="Bonfire"
        className={styles['gif']}
        onClick={handleGifClick}
      />
      {showEasterEgg && (
        <div className={styles['easter-egg']}>
          Praise the Sun!
        </div>
      )}
    </div>
  );
};

export default SearchBar;