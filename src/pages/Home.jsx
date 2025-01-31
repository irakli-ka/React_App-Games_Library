import { useState, useEffect } from "react";
import GameService from "../services/GameService";
import GameCard from "../components/GameCard";
import { motion } from "framer-motion";
import styles from "../styles/Home.module.css";
//TODO maybe make second page specific to the game details instead
const Home = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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

    loadGames();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className={styles.container} style={{ paddingTop: '80px' }}>
      {games.map((game, index) => (
        <motion.div key={`${game.id}-${index}`} className={styles["game-card"]}>
          <GameCard game={game} />
        </motion.div>
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Home;