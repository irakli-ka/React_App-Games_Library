import { useState, useEffect } from "react";
import GameService from "../services/GameService";
import GameCard from "../components/GameCard";
import styles from "../styles/Home.module.css";
import SearchBar from "../components/searchbar";

function Home() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const gameIds = new Set(games.map(game => game.id));

  const loadGames = async (options = { reset: false }) => {
    const { reset } = options;
    setLoading(true);
    try {
      const fetchPage = reset ? 1 : page;
      const response = await GameService.getGames({ page: fetchPage, page_size: 15 });
      if (response && response.results) {
        if (reset) {
          setGames(response.results);
        } else {
          const newGames = response.results.filter((newGame) => !gameIds.has(newGame.id));
          setGames((prevGames) => [...prevGames, ...newGames]);
          newGames.forEach(game => gameIds.add(game.id));
        }
      } else {
        console.error("Failed to load games: Invalid response format");
      }
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      // if search is empty or whitespace, return to default listing
      // when resetting, fetch the first page of default games
      setPage(1);
      loadGames({ reset: true });
    } else {
      // when searching, do not auto-load default pages
      // keep behavior controlled by handleSearch
    }
  }, [search]);

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed && page > 1) {
      loadGames({ reset: false });
    }
  }, [page]);

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

  const handleSearch = async () => {
    const term = search.trim();
    if (!term) {
      setGames([]);
      setPage(1);
      await loadGames({ reset: true });
      return;
    }

    setLoading(true);
    try {
      const response = await GameService.searchGames(term);
      if (response && response.results) {
        setGames(response.results);
      } else {
        console.error("Failed to search games: Invalid response format");
      }
    } catch (error) {
      console.error("Failed to search games:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <SearchBar search={search} setSearch={setSearch} onSearch={handleSearch} />
        {games.map((game) => (
          <div key={`${game.id}`} className={styles["game-card"]}>
            <GameCard game={game} />
          </div>
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