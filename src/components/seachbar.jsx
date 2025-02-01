import React, { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import styles from '../styles/Searchbar.module.css';
import sunIcon from "../assets/sun.svg";
import moonIcon from "../assets/moon.svg";
import searchIconLight from "../assets/search-light.svg";
import searchIconDark from "../assets/search-dark.svg";

const SearchBar = ({ search, setSearch }) => {
  const { darkMode, toggleDarkMode, showEasterEgg } = useContext(DarkModeContext);

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
      <button className={styles['theme-switch']} onClick={toggleDarkMode}>
        <img src={darkMode ? sunIcon : moonIcon} alt="Toggle Dark Mode" />
      </button>
      <img
        src={darkMode ? "https://media.tenor.com/giNrzT0tQGsAAAAj/bonfire-dark-souls.gif" : "https://media.tenor.com/QTbcrC893SIAAAAi/solaire.gif"}
        alt="Bonfire"
        className={styles['bonfire-gif']}
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