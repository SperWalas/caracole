import { createContext, useState, useMemo } from 'react';

import useSocket from './useSocket';

export const GameContext = createContext(null);

const GameProvider = ({ children }) => {
  const [game, setGame] = useState(null);
  const [selfId, setSelfId] = useState(null);
  const [selectedCards, setSelectedCards] = useState({}); // { [playerId]: cardIndex }
  const [unfoldedCards, setUnfoldedCards] = useState({}); // { [playerId]: { [cardIndex]: boolean }}

  // Number of cards discovered by current user
  const discoveredCardsCount = useMemo(() => Object.keys(unfoldedCards[selfId] || {}).length, [
    selfId,
    unfoldedCards
  ]);

  // Number of cards currently selected
  const selectedCardsCount = useMemo(() => Object.keys(selectedCards || {}).length, [
    selectedCards,
    selfId
  ]);

  // Number of cards currently unfolded
  const unfoldedCardsCount = useMemo(
    () =>
      Object.values(unfoldedCards).reduce((sum, cardIndexes) => {
        return sum + Object.values(cardIndexes).filter(val => !!val).length;
      }, 0),
    [unfoldedCards]
  );

  const socket = useSocket('game.update', game => {
    console.log({ game });
    setGame(game);
  });

  useSocket('game.you', playerId => {
    setSelfId(playerId);
  });

  const handleTriggerCaracole = player => {
    socket.emit('game.triggerCaracole', { gameId: game.id, playerId: player.id });
  };

  const hideCard = (cardIndex, cardPlayerId) => {
    setUnfoldedCards({
      ...unfoldedCards,
      [cardPlayerId]: {
        ...unfoldedCards[cardPlayerId],
        [cardIndex]: false
      }
    });
  };

  const resetCards = () => {
    setSelectedCards({});
    setUnfoldedCards({});
  };

  const revealCard = (cardIndex, cardPlayerId) => {
    setUnfoldedCards({
      ...unfoldedCards,
      [cardPlayerId]: {
        ...unfoldedCards[cardPlayerId],
        [cardIndex]: true
      }
    });
  };

  const selectCard = (cardIndex, cardPlayerId) => {
    setSelectedCards({
      ...selectedCards,
      [cardPlayerId]: selectedCards[cardPlayerId] ? null : cardIndex
    });
  };

  const value = {
    discoveredCardsCount,
    game,
    handleTriggerCaracole,
    hideCard,
    resetCards,
    revealCard,
    selectCard,
    selectedCards,
    selectedCardsCount,
    selfId,
    unfoldedCards,
    unfoldedCardsCount
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameProvider;
