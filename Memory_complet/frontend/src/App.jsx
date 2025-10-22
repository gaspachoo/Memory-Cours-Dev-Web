import { useState, useRef } from "react";
import "./App.css";
import "animate.css";
import { TableauScores } from "./components/TableauScores";
import { GameGrid } from "./components/GameGrid";
import { Timer } from "./components/Timer";
import { ScoreModal } from "./components/ScoreModal";
import { useCards } from "./hooks/useCards";

function App() {
  const [showScores, setShowScores] = useState(false);
  const [flippedCardsCount, setFlippedCardsCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const gameGridRef = useRef(null);
  const timerRef = useRef(null);
  const tableauScoresRef = useRef(null);

  const { cards, regenerateCards } = useCards();

  const startNewGame = () => {
    regenerateCards();
    setFlippedCardsCount(0);
    setGameStarted(false);
    setGameEnded(false);
    setShowScoreModal(false);

    if (gameGridRef.current) {
      gameGridRef.current.resetCards();
    }

    if (timerRef.current) {
      timerRef.current.resetTimer();
    }
  };

  const handleGameStart = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  const handleCardFlip = () => {
    setFlippedCardsCount((prev) => prev + 1);
  };

  const handleGameEnd = () => {
    setGameEnded(true);

    setTimeout(() => {
      setShowScoreModal(true);
    }, 2000);
  };

  const handleScoreSaved = (savedScore) => {
    setShowScoreModal(false);

    if (showScores && tableauScoresRef.current) {
      tableauScoresRef.current.refreshScores();
    }
    console.log("Score sauvegardé dans App:", savedScore);
  };

  const handleScoreSkipped = () => {
    setShowScoreModal(false);
  };

  const displayScores = () => {
    setShowScores((prev) => {
      const newShow = !prev;

      if (!prev && tableauScoresRef.current) {
        tableauScoresRef.current.refreshScores();
      }
      return newShow;
    });
  };

  return (
    <>
      <div id="app">
        <h1>Memory !</h1>

        <div className="game-stats">
          <Timer
            ref={timerRef}
            gameStarted={gameStarted}
            gameEnded={gameEnded}
          />
          <div className="stat-item">
            <span className="stat-label">🃏 Cartes retournées :</span>
            <span className="stat-value">{flippedCardsCount}</span>
          </div>
        </div>

        <button onClick={startNewGame} className="new-game-btn">
          Nouvelle Partie
        </button>
        <GameGrid
          ref={gameGridRef}
          cards={cards}
          onGameStart={handleGameStart}
          onCardFlip={handleCardFlip}
          onGameEnd={handleGameEnd}
        />
        <button onClick={displayScores} className="scores-btn">
          {showScores ? "Masquer les Scores" : "Voir les Scores"}
        </button>

        <ScoreModal
          isVisible={showScoreModal}
          gameTime={timerRef.current?.getTime() || 0}
          flippedCardsCount={flippedCardsCount}
          onSave={handleScoreSaved}
          onSkip={handleScoreSkipped}
        />

        {showScores && (
          <div id="scores-table">
            <TableauScores ref={tableauScoresRef} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
