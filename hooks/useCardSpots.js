import { useCallback, useContext, createContext, useRef, useState, useEffect } from 'react';
import useGame from './useGame';

export const DISCARD_PILE_SPOT_ID = 'discard-pile';
export const DRAW_PILE_SPOT_ID = 'draw-pile';
export const FAILED_CARD_SPOT_ID = 'failed-card';
export const PICKED_CARD_SPOT_ID = 'picked-card';

export const getPlayerCardSpotId = (playerId, spotIndex) => `player${playerId}_${spotIndex}`;

const CardSpotsContext = createContext(null);

export const CardSpotsProvider = ({ children }) => {
  const { game } = useGame();
  const [cardSpots, setCardSpots] = useState({}); // { [cardId]: spotId }
  const cardSpotsRef = useRef({}); // { [spotId]: HTLMElement }

  const getSpotNode = useCallback(spotId => cardSpotsRef.current[spotId], [cardSpotsRef]);

  const setCardSpotRef = useCallback(
    spotId => node => {
      cardSpotsRef.current[spotId] = node;
    },
    [cardSpotsRef]
  );

  const { cards } = game || {};

  useEffect(() => {
    if (cards) {
      setCardSpots(
        cards.reduce(
          (cardSpots, card) => ({
            ...cardSpots,
            [card.id]: card.spot
          }),
          {}
        )
      );
    }
  }, [cards]);

  const value = {
    cardSpots,
    getSpotNode,
    setCardSpotRef
  };

  return <CardSpotsContext.Provider value={value}>{children}</CardSpotsContext.Provider>;
};

const useCardSpots = () => {
  const cardSpotsContext = useContext(CardSpotsContext);
  if (!cardSpotsContext) {
    throw Error('You should not use useGame outside a CardSpotsProvider');
  }

  return cardSpotsContext;
};

export default useCardSpots;
