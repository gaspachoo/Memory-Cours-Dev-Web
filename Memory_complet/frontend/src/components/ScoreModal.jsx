import React, { useState } from "react";

export function ScoreModal({
  isVisible,
  gameTime,
  flippedCardsCount,
  onSave,
  onSkip,
}) {
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsLoading(true);

    const scoreData = {
      joueur: playerName.trim(),
      score: flippedCardsCount,
      time: gameTime,
    };

    console.log("Données envoyées au serveur:", scoreData);
    console.log("Type de gameTime:", typeof gameTime, "Valeur:", gameTime);
    console.log(
      "Type de flippedCardsCount:",
      typeof flippedCardsCount,
      "Valeur:",
      flippedCardsCount
    );

    try {
      const response = await fetch("http://localhost:8000/scores/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scoreData),
      });

      console.log("Status de la réponse:", response.status);

      if (response.ok) {
        const savedScore = await response.json();
        console.log("Score sauvegardé:", savedScore);
        alert(
          `Score sauvegardé ! Temps: ${formatTime(
            gameTime
          )}, Cartes retournées: ${flippedCardsCount}`
        );
        setPlayerName("");
        onSave(savedScore);
      } else {
        const errorText = await response.text();
        console.error(
          "Erreur lors de la sauvegarde:",
          response.statusText,
          "Body:",
          errorText
        );
        alert(
          `Erreur lors de la sauvegarde du score: ${response.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Erreur de connexion à la base de données");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    setPlayerName("");
    onSkip();
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🎉 Félicitations !</h2>
        <p>
          Vous avez terminé en <strong>{formatTime(gameTime)}</strong>
        </p>
        <p>
          Avec <strong>{flippedCardsCount}</strong> cartes retournées
        </p>

        <form onSubmit={handleSubmit} className="name-form">
          <label htmlFor="playerName">
            Entrez votre nom pour sauvegarder votre score :
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Votre nom..."
            maxLength={50}
            autoFocus
            disabled={isLoading}
          />
          <div className="modal-buttons">
            <button
              type="submit"
              className="save-btn"
              disabled={!playerName.trim() || isLoading}
            >
              {isLoading ? "⏳ Sauvegarde..." : "💾 Sauvegarder"}
            </button>
            <button
              type="button"
              className="skip-btn"
              onClick={handleSkip}
              disabled={isLoading}
            >
              ⏭️ Passer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
