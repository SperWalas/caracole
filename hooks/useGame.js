import { createContext, useContext, useState, useMemo } from 'react';

import useSocket from './useSocket';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [game, setGame] = useState(null);
  const [selfId, setSelfId] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]); // [card]
  const [unfoldedCards, setUnfoldedCards] = useState([]); // [card]
  const [discoveredCards, setDiscoveredCards] = useState([]); // [card]

  // Number of cards discovered by current user
  const discoveredCardsCount = useMemo(() => discoveredCards.length, [discoveredCards]);

  // Number of cards currently selected
  const selectedCardsCount = useMemo(() => selectedCards.length, [selectedCards]);

  // Number of cards currently unfolded
  const unfoldedCardsCount = useMemo(() => unfoldedCards.length, [unfoldedCards]);

  const socket = useSocket('game.update', game => {
    console.log({ game });
    setGame(game);
  });

  useSocket('game.you', playerId => {
    setSelfId(playerId);
  });
  const handlePlayerHasDiscoveredHisCards = () => {
    socket.emit('game.playerHasDiscoveredHisCards', { gameId: game.id, playerId: selfId });
  };

  const handlePlayerIsReady = () => {
    socket.emit('game.playerIsReady', { gameId: game.id, playerId: selfId });
    resetCards();
  };

  const handlePlayerTriggerCaracole = player => {
    socket.emit('game.playerTriggerCaracole', { gameId: game.id, playerId: player.id });
  };

  const hideCard = card => {
    setUnfoldedCards(unfoldedCards.filter(({ id }) => id !== card.id));
  };

  const resetCards = () => {
    setSelectedCards([]);
    setUnfoldedCards([]);
    setDiscoveredCards([]);
  };

  const revealCard = card => {
    if (card.belongsTo === selfId && !game.isStarted) {
      setDiscoveredCards([...discoveredCards, card]);
    }
    setUnfoldedCards([...new Set([...unfoldedCards, card])]);
  };

  const selectCard = (card, action) => {
    const { id: cardId, belongsTo } = card;

    // Cannot select his own cards on joker action
    if (action === 'swap' && belongsTo === selfId) {
      return;
    }

    // Remove card if already selected
    const isExist = !!selectedCards.find(selectedCard => selectedCard.id === cardId);
    if (isExist) {
      return setSelectedCards(selectedCards.filter(selectedCard => selectedCard.id !== cardId));
    }

    // If player click on a players card, replace the last selected from that player if exists
    const cardOfPlayerAlreadySelected = selectedCards.find(
      selectedCard => selectedCard.belongsTo === belongsTo
    );
    if (cardOfPlayerAlreadySelected) {
      return setSelectedCards(
        selectedCards.map(selectedCard =>
          selectedCard.id === cardOfPlayerAlreadySelected.id ? card : selectedCard
        )
      );
    }

    // If player must select one of his card in exchange action
    if (
      action === 'exchange' &&
      selectedCards.length &&
      !selectedCards.find(c => c.belongsTo === selfId) &&
      belongsTo !== selfId
    ) {
      return;
    }
    // Add
    return setSelectedCards([...selectedCards, card]);
  };

  const value = {
    discoveredCardsCount,
    game,
    handlePlayerHasDiscoveredHisCards,
    handlePlayerIsReady,
    handlePlayerTriggerCaracole,
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

const useGame = () => {
  const gameContext = useContext(GameContext);
  if (!gameContext) {
    throw Error('You should not use useGame outside a <GameProvider>');
  }

  return gameContext;
};

export default useGame;
