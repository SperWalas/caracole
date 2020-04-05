import { useCallback, useContext, createContext, useRef, useState, useEffect } from 'react';
import useGame from './useGame';

export const DISCARD_PILE_SPOT_ID = 'discard-pile';
export const DRAW_PILE_SPOT_ID = 'draw-pile';
export const FAILED_CARD_SPOT_ID = 'failed-card';
export const PICKED_CARD_SPOT_ID = 'picked-card';

export const getPlayerCardSpotId = (playerId, spotIndex) => `player${playerId}_${spotIndex}`;

const CardSpotsContext = createContext(null);

export const CardSpotsProvider = ({ children }) => {
  const { game, selfId } = useGame();
  const [cardSpots, setCardSpots] = useState({}); // { [cardId]: spotId }
  const cardSpotsRef = useRef({}); // { [spotId]: HTLMElement }

  const getSpotNode = useCallback(spotId => cardSpotsRef.current[spotId], [cardSpotsRef]);

  const setCardSpotRef = useCallback(
    spotId => node => {
      cardSpotsRef.current[spotId] = node;
    },
    [cardSpotsRef]
  );

  const { cards, discardPile, failedCard, players } = game || {};

  useEffect(() => {
    if (cards) {
      // Flatten player cards in a object { [cardId]: spotId }
      const playerCardSpots = Object.values(players).reduce(
        (playersAcc, { cards, id: playerID }) => {
          const singlePlayerCardSpots = cards.reduce((cardsAcc, card, spotIndex) => {
            return {
              ...cardsAcc,
              ...(card && { [card.id]: getPlayerCardSpotId(playerID, spotIndex) })
            };
          }, {});

          return {
            ...playersAcc,
            ...singlePlayerCardSpots
          };
        },
        {}
      );

      const discardedCard = discardPile && [...discardPile].pop();
      const { tmpCard: pickedCard } = Object.values(players).find(p => p.id === selfId) || {};

      const drawPileCards = Object.values(cards || []).reduce(
        (acc, { id }) => ({ ...acc, [id]: DRAW_PILE_SPOT_ID }),
        {}
      );

      const newCardSpots = {
        ...drawPileCards,
        ...playerCardSpots,
        ...(discardedCard && { [discardedCard.id]: DISCARD_PILE_SPOT_ID }),
        ...(failedCard && { [failedCard.id]: FAILED_CARD_SPOT_ID }),
        ...(pickedCard && { [pickedCard.id]: PICKED_CARD_SPOT_ID })
      };
      setCardSpots(newCardSpots);
    }
  }, [discardPile, players]);

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
