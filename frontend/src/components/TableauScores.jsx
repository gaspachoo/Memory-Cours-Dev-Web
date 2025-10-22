import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const TableauScores = forwardRef((props, ref) => {
  const [scores, setScores] = useState([]);

  const fetchScores = async () => {
    try {
      const response = await fetch("http://localhost:8000/scores/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setScores(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des scores :", error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  useImperativeHandle(ref, () => ({
    refreshScores: fetchScores,
  }));

  return (
    <div>
      <h2>🏆 Tableau des Scores 🏆</h2>
      <table>
        <thead>
          <tr>
            <th>👤 Joueur</th>
            <th>🎯 Score</th>
            <th>⏱️ Temps (s)</th>
            <th>📅 Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  fontStyle: "italic",
                  color: "#666",
                }}
              >
                Aucun score enregistré pour le moment
              </td>
            </tr>
          ) : (
            scores
              .sort((a, b) => a.score - b.score)
              .map((score, index) => (
                <tr key={score.id} className={index === 0 ? "high-score" : ""}>
                  <td>
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {score.joueur}
                  </td>
                  <td>{score.score} cartes</td>
                  <td>{score.time}s</td>
                  <td>
                    {new Date(score.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
});

export { TableauScores };
