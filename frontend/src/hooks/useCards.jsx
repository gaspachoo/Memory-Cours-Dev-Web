import { useState } from "react";

export const useCards = () => {
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateCards = () => {
    const imageIds = [];
    while (imageIds.length < 6) {
      const randomId = Math.floor(Math.random() * 1000) + 1;
      if (!imageIds.includes(randomId)) {
        imageIds.push(randomId);
      }
    }

    const pairs = [...imageIds, ...imageIds];
    const shuffledImages = shuffleArray(pairs);

    return shuffledImages.map((imageId, index) => ({
      id: `card${index + 1}`,
      imageId: imageId,
      imageUrl: `https://picsum.photos/200?random=${imageId}`,
    }));
  };

  const [cards, setCards] = useState(() => generateCards());

  const regenerateCards = () => {
    setCards(generateCards());
  };

  return {
    cards,
    regenerateCards,
  };
};
