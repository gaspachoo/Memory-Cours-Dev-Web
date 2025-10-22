import React, { useState, useImperativeHandle, forwardRef } from "react";
import JSConfetti from "js-confetti";

const GameGrid = forwardRef(
  ({ cards, onCardFlip, onGameStart, onGameEnd }, ref) => {
    const [visibleCards, setVisibleCards] = useState([]);

    const getRemainingCards = () => {
      const allCards = document.querySelectorAll(".card");
      const remaining = [];

      allCards.forEach((card) => {
        if (!card.classList.contains("hidden")) {
          remaining.push(card);
        }
      });

      return remaining;
    };

    const resetCards = () => {
      setVisibleCards([]);
      setTimeout(() => {
        const allCards = document.querySelectorAll(".card");
        allCards.forEach((card) => {
          card.classList.remove(
            "flipped",
            "flipping",
            "hidden",
            "animate__animated",
            "animate__pulse"
          );
        });
      }, 10);
    };

    useImperativeHandle(ref, () => ({
      resetCards,
    }));

    const changeCardState = (event) => {
      let card = event.target;
      if (card.classList.contains("card-image")) {
        card = card.parentElement;
      }

      if (!visibleCards.includes(card)) {
        if (onGameStart) {
          onGameStart();
        }

        if (onCardFlip) {
          onCardFlip();
        }

        const newVisibleCards = [...visibleCards, card];
        setVisibleCards(newVisibleCards);

        card.classList.add("flipped", "flipping");

        setTimeout(() => {
          card.classList.remove("flipping");
        }, 600);

        const compt = newVisibleCards.length;

        if (compt === 2) {
          let cardA = newVisibleCards[0];
          let cardB = newVisibleCards[1];
          if (cardA.dataset.imageId === cardB.dataset.imageId) {
            console.log("This is a pair !!");

            cardA.classList.add("animate__animated", "animate__pulse");
            cardB.classList.add("animate__animated", "animate__pulse");

            setTimeout(() => {
              cardA.classList.add("hidden");
              cardB.classList.add("hidden");

              const remainingCards = getRemainingCards();
              console.log(
                "Cartes restantes après la paire:",
                remainingCards.length
              );
              if (remainingCards.length === 0) {
                console.log("Félicitations ! Toutes les paires trouvées !");
                if (onGameEnd) {
                  onGameEnd();
                }
                const jsConfetti = new JSConfetti();
                jsConfetti.addConfetti();
              }
            }, 1000);
            setVisibleCards([]);
            return;
          }
        }
        if (compt === 3) {
          newVisibleCards[0].classList.remove("flipped");
          newVisibleCards[1].classList.remove("flipped");
          newVisibleCards[0].classList.add("flipping");
          newVisibleCards[1].classList.add("flipping");

          setTimeout(() => {
            newVisibleCards[0].classList.remove("flipping");
            newVisibleCards[1].classList.remove("flipping");
          }, 600);

          setVisibleCards([newVisibleCards[2]]);
        }
        if (compt > 3) {
          console.error("Problème, 3 cartes sont visibles!");
        }
      }
    };

    return (
      <div className="game-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={changeCardState}
            id={card.id}
            className="card"
            data-image-id={card.imageId}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
          >
            <img
              src={card.imageUrl}
              alt={`Card ${card.imageId}`}
              className="card-image"
            />
          </div>
        ))}
      </div>
    );
  }
);

GameGrid.displayName = "GameGrid";

export { GameGrid };
