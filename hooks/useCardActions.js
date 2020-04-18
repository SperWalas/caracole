import { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';

import useGame from './useGame';

const socket = io();

const DISCOVERY_CARDS_COUNT = 2;

const CardActionsContext = createContext(null);

export const CardActionsProvider = ({ children }) => {
  const {
    discoveredCardsCount,
    game,
    handlePlayerHasDiscoveredHisCards,
    hideCard,
    resetCards,
    revealCard,
    selfId,
    selectCard,
    selectedCards,
    selectedCardsCount,
    unfoldedCards,
    unfoldedCardsCount
  } = useGame();
  const { id: gameId, nextActions = [], isStarted } = game || {};

  const nextActionObject = nextActions && nextActions.length && nextActions[0];
  const { action: nextAction, player: nextPlayer } = nextActionObject || {};
  const isSelfToPlay = nextPlayer && nextPlayer.id === selfId;

  // Swap cards when 2 are selected
  useEffect(() => {
    const handleSwapCards = cards => {
      console.log('handleSwapCards');
      socket.emit('game.swapCardBetweenPlayer', {
        gameId,
        cards: cards.map(card => card.id)
      });
    };

    if (selectedCardsCount === 2) {
      handleSwapCards(selectedCards);
      resetCards();
    }
  }, [gameId, resetCards, selectedCards, selectedCardsCount]);

  const handleCardClick = card => {
    console.log('handleCardClick');
    const isSelf = card.belongsTo === selfId;

    if (!isStarted) {
      // Player can only watch their own cards at the beginning
      if (isSelf) {
        const isCardRevealed = !!unfoldedCards.find(unfoldedCard => unfoldedCard.id === card.id);
        if (isCardRevealed) {
          if (unfoldedCardsCount === 1 && discoveredCardsCount === DISCOVERY_CARDS_COUNT) {
            handlePlayerHasDiscoveredHisCards();
          }
          return hideCard(card);
        }

        // Discover his own card
        if (discoveredCardsCount < DISCOVERY_CARDS_COUNT) {
          return revealCard(card);
        }
      }
      // Don't do anything else
      return;
    }

    // Game started it's player turn
    if (isSelfToPlay) {
      if (nextAction === 'give' && isSelf) {
        return handleGiveCard(card);
      }
      // If player has to pick
      if (nextAction === 'pick' && card.spot === 'draw-pile') {
        return handlePickDrawCard();
      }

      if (nextAction === 'pick' && card.spot === 'discard-pile') {
        return handlePickDiscardCard();
      }

      if (nextAction === 'pickFailed' && card.spot === 'failed-card') {
        return handlePickFailedCard();
      }

      if (nextAction === 'pickDrawAfterFail' && card.spot === 'draw-pile') {
        return handlePickDrawCardAfterFail();
      }

      if (nextAction === 'exchange' || nextAction === 'swap') {
        return selectCard(card, nextAction);
      }

      if (nextAction === 'throw' && card.spot === 'picked-card') {
        return handleThrowPickedCard();
      }

      if (nextAction === 'watch') {
        console.log({ unfoldedCardsCount });
        return !unfoldedCardsCount ? handleWatchCard(card) : handleHasWatchedCard(card);
      }
    }
    // No action? the player want to throw the card then
    return handleThrowCard(card);
  };

  const handleGiveCard = ({ id: cardId }) => {
    console.log('handleGiveCard');
    socket.emit('game.playerGiveCard', {
      gameId: game.id,
      playerId: selfId,
      cardId
    });
  };

  const handleHasWatchedCard = card => {
    console.log('handleHasWatchedCard');
    socket.emit('game.playerHasWatchedCard', { gameId, playerId: selfId });
    hideCard(card);
  };

  const handlePickDiscardCard = () => {
    console.log('handlePickDiscardCard');
    socket.emit('game.playerPickDiscardCard', {
      gameId,
      playerId: selfId
    });
  };

  const handlePickDrawCard = () => {
    console.log('handlePickDrawCard');
    socket.emit('game.playerPickDrawCard', {
      gameId,
      playerId: selfId
    });
  };

  const handlePickDrawCardAfterFail = () => {
    console.log('handlePickDrawCardAfterFail');
    socket.emit('game.playerPickDrawCardAfterFail', {
      gameId,
      playerId: selfId
    });
  };

  const handlePickFailedCard = () => {
    console.log('handlePickFailedCard');
    socket.emit('game.playerPickFailedCard', {
      gameId,
      playerId: selfId
    });
  };

  const handleThrowCard = ({ id: cardId }) => {
    console.log('handleThrowCard');
    socket.emit('game.playerThrowCard', {
      gameId,
      playerId: selfId,
      cardId
    });
  };

  const handleThrowPickedCard = () => {
    console.log('handleThrowPickedCard');
    socket.emit('game.playerThrowPickedCard', {
      gameId,
      playerId: selfId
    });
  };

  const handleWatchCard = card => {
    console.log('handleWatchCard');
    socket.emit('game.playerWatchCard', {
      gameId,
      playerId: selfId,
      cardId: card.id
    });
    revealCard(card);
  };

  return (
    <CardActionsContext.Provider
      value={{
        handleCardClick,
        isSelfToPlay,
        nextAction,
        nextPlayer
      }}
    >
      {children}
    </CardActionsContext.Provider>
  );
};

const useCardActions = () => {
  const cardActionsContext = useContext(CardActionsContext);
  if (!cardActionsContext) {
    throw Error('You should not use useCardActions outside a CardActionsContext');
  }

  return cardActionsContext;
};

export default useCardActions;
