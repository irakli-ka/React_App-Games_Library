import { useState, useEffect } from "react";
import GameService from "../services/GameService";
import GameCard from "../components/GameCard";
import { motion } from "framer-motion";
import styles from "../styles/Home.module.css";
import SearchBar from "../components/seachbar";

const Home = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const gameIds = new Set(games.map(game => game.id));

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const response = await GameService.getGames({ page, page_size: 15 });
        const newGames = response.results.filter(
          (newGame) => !gameIds.has(newGame.id)
        );
        setGames((prevGames) => [...prevGames, ...newGames]);
        newGames.forEach(game => gameIds.add(game.id));
      } catch (error) {
        console.error("Failed to load games:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!debouncedSearch) {
      loadGames();
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    const searchForGames = async () => {
      setLoading(true);
      try {
        const response = await GameService.searchGames(debouncedSearch);
        setGames(response.results);
      } catch (error) {
        console.error("Failed to search games:", error);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearch) {
      searchForGames();
    } else {
      setGames([]);
      setPage(1);
    }
  }, [debouncedSearch]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <SearchBar search={search} setSearch={setSearch} />
        {games.map((game) => (
          <motion.div key={`${game.id}`} className={styles["game-card"]}>
            <GameCard game={game} />
          </motion.div>
        ))}
        {loading && <p>Loading...</p>}
        {showScrollButton && (
          <button className={styles.scrollToTop} onClick={scrollToTop}>
          ↑
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;