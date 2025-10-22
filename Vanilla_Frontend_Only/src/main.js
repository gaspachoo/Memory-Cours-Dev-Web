import JSConfetti from 'js-confetti'

let visibleCards = [];

function changeCardState(card) {
  if (!visibleCards.includes(card)) {
    visibleCards.push(card);
    card.style.contentVisibility = "visible";
    const compt = visibleCards.length;

    if (compt === 2) {
      let cardA = visibleCards[0];
      let cardB = visibleCards[1];
      if (cardA.innerHTML === cardB.innerHTML) {
        console.log("This is a pair !!");
        setTimeout(() => {
          cardA.style.visibility = 'hidden';
          cardB.style.visibility = 'hidden';

          const remainingCards = getRemainingCards();
          console.log("Cartes restantes après la paire:", remainingCards.length);
          if (remainingCards.length === 0) {
            console.log("Félicitations ! Toutes les paires trouvées !");
            const jsConfetti = new JSConfetti();
            jsConfetti.addConfetti();
          }
        }, 100);
        visibleCards = [];
        return;
      }
    }
    if (compt === 3) {
      visibleCards[0].style.contentVisibility = 'hidden';
      visibleCards[1].style.contentVisibility = 'hidden';
      visibleCards = [visibleCards[2]];

    }
    if (compt > 3) {
      console.error('Problème, 3 cartes sont visibles!');
    }
  }
}
window.changeCardState = changeCardState;
window.getRemainingCards = getRemainingCards;

function getRemainingCards() {
  const allCards = document.querySelectorAll('.card');
  const remaining = [];

  allCards.forEach(card => {
    if (card.style.visibility !== 'hidden') {
      remaining.push(card);
    }
  });

  return remaining;
}