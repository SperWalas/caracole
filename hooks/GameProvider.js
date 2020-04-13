import { createContext, useState, useMemo } from 'react';

import useSocket from './useSocket';

export const GameContext = createContext(null);

const GameProvider = ({ children }) => {
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
    console.log('hideCard', { card });
    setUnfoldedCards(unfoldedCards.filter(({ id }) => id !== card.id));
  };

  const resetCards = () => {
    setSelectedCards([]);
    setUnfoldedCards([]);
    setDiscoveredCards([]);
  };

  const revealCard = card => {
    console.log('revealCard', { card });
    if (card.belongsTo === selfId && !game.isStarted) {
      setDiscoveredCards([...discoveredCards, card]);
    }
    setUnfoldedCards([...new Set([...unfoldedCards, card])]);
  };

  const selectCard = (card, action) => {
    console.log('selectCard', { card });
    const { id: cardId, belongsTo } = card;
    // Cannot select his own cards on joker action
    if (action.action === 'swap' && belongsTo === selfId) {
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

export default GameProvider;
