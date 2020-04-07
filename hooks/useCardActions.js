import { useEffect } from 'react';
import io from 'socket.io-client';

import useGame from './useGame';

const socket = io();

const DISCOVERY_CARDS_COUNT = 2;

const useCardActions = () => {
  const {
    discoveredCardsCount,
    game,
    hideCard,
    resetCards,
    revealCard,
    selfId,
    selectCard,
    selectedCards,
    selectedCardsCount,
    unfoldedCardsCount
  } = useGame();
  const { id: gameId, nextActions, isStarted } = game;

  const nextAction = nextActions.length && nextActions[0] && nextActions[0].action;
  const nextPlayer = nextActions.length && nextActions[0] && nextActions[0].player;
  const isSelfToPlay = nextPlayer && nextPlayer.id === selfId;

  // Swap cards when 2 are selected
  useEffect(() => {
    if (selectedCardsCount === 2) {
      handleSwapCard();
      resetCards({});
    }
  }, [selectedCardsCount]);

  const handleGiveCard = (cardIndex, cardPlayerId) => {
    console.log('handleGiveCard');
    const card = { index: cardIndex, playerId: cardPlayerId };
    socket.emit('game.giveCard', { gameId: game.id, playerId: selfId, card });
  };

  const handleSwapCard = () => {
    const cardPlayerIds = Object.keys(selectedCards);
    if (cardPlayerIds.length === 2) {
      const cards = cardPlayerIds.map(cardPlayerId => ({
        index: selectedCards[cardPlayerId],
        playerId: cardPlayerId
      }));
      socket.emit('game.swapCard', { gameId, cards });
    }
  };

  const handleHideCard = (cardIndex, cardPlayerId) => {
    console.log('handleHideCard');

    // Tell the world the card has been watched
    if (isStarted) {
      socket.emit('game.hasWatchedCard', { gameId, playerId: selfId });
    }

    // Tell if the player has discovered his 2 cards
    if (!isStarted && unfoldedCardsCount === 1 && discoveredCardsCount === DISCOVERY_CARDS_COUNT) {
      socket.emit('game.hasDiscoveredHisCards', { gameId, playerId: selfId });
    }

    hideCard(cardIndex, cardPlayerId);
  };

  const handlePlayerReady = () => {
    console.log({ gameId, selfId });
    // Ready to start/reboot the game reset data
    socket.emit('game.setPlayerReady', { gameId, playerId: selfId });
    resetCards();
  };

  const handlePickDrawCard = () => {
    console.log('handlePickDrawCard');
    socket.emit('game.pickDrawCard', { gameId, playerId: selfId });
  };

  const handlePickDrawCardAfterFail = () => {
    console.log('pickDrawCardAfterFail');
    socket.emit('game.pickDrawCardAfterFail', { gameId, playerId: selfId });
  };

  const handlePickDiscardedCard = () => {
    console.log('handlePickDiscardedCard');
    socket.emit('game.pickDiscardedCard', { gameId, playerId: selfId });
  };

  const handlePickFailedCard = () => {
    console.log('handlePickFailedCard');
    socket.emit('game.pickFailedCard', { gameId, playerId: selfId });
  };

  const handleThrowTmpCard = () => {
    socket.emit('game.throwTmpCard', { gameId, playerId: selfId });
  };

  const handleThrowHandCard = (cardIndex, cardPlayerId) => {
    console.log('handleThrowHandCard', { cardIndex, cardPlayerId });
    const card = { index: cardIndex, playerId: cardPlayerId };
    socket.emit('game.throwCard', { gameId, playerId: selfId, card });
  };

  const handleWatchCard = (cardIndex, cardPlayerId) => {
    console.log('handleWatchCard');

    // Send to back that player is looking a card
    if (isStarted) {
      socket.emit('game.watchCard', {
        gameId,
        playerId: selfId,
        card: { index: cardIndex, playerId: cardPlayerId }
      });
    }

    revealCard(cardIndex, cardPlayerId);
  };

  const handlePlayerCardClick = (cardIndex, cardPlayerId) => {
    const isSelf = cardPlayerId === selfId;

    // Game hasn't start
    if (!isStarted) {
      // Player can only watch their own cards
      if (isSelf && discoveredCardsCount < DISCOVERY_CARDS_COUNT) {
        return handleWatchCard(cardIndex, cardPlayerId);
      }
      // Don't do anything
      return;
    }

    // Game started it's player turn
    if (isSelfToPlay) {
      // Can only watch one card at a time
      if (nextAction === 'watch' && !unfoldedCardsCount) {
        return handleWatchCard(cardIndex, cardPlayerId);
      }
      if (nextAction === 'give' && cardPlayerId === selfId) {
        return handleGiveCard(cardIndex, cardPlayerId);
      }
      if (nextAction === 'exchange' || nextAction === 'swap') {
        return selectCard(cardIndex, cardPlayerId, nextAction);
      }
    }
    // No action? the player want to throw the card then
    return handleThrowHandCard(cardIndex, cardPlayerId);
  };

  return {
    handleHideCard,
    handlePickDrawCard,
    handlePickDrawCardAfterFail,
    handlePickDiscardedCard,
    handlePickFailedCard,
    handlePlayerCardClick,
    handlePlayerReady,
    handleThrowTmpCard,
    isSelfToPlay,
    nextAction,
    nextPlayer
  };
};

export default useCardActions;
