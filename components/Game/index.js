import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import { Row, Column } from '../layout';
import { Subheading } from '../text';

import DiscardPile from './DiscardPile';
import PickedCard from './PickedCard';
import PlayerCards from './PlayerCards';

const socket = io();
const DISCOVERY_CARDS_COUNT = 2;

const Game = ({ game, playerId }) => {
  // Selected cards: { [playerId]: cardIndex }
  const [selectedCards, setSelectedCards] = useState({});
  // Unfolded cards: { [playerId]: { [cardIndex]: boolean }}
  const [unfoldedCards, setUnfoldedCards] = useState({});
  const { discardPile, id: gameId, name, nextActions, players, isReady, isStarted } = game;

  const { tmpCard } = players[playerId];
  const nextAction = nextActions.length && nextActions[0];
  const isSelfToPlay = nextAction && nextAction.playerId === playerId;
  const selfAction = isSelfToPlay && nextAction ? nextAction.action : null;

  // Number of cards currently unfolded
  const unfoldedCardsCount = Object.values(unfoldedCards).reduce((sum, cardIndexes) => {
    return sum + Object.values(cardIndexes).filter(val => !!val).length;
  }, 0);

  useEffect(() => {
    const cardPlayerIds = Object.keys(selectedCards);
    if (cardPlayerIds.length === 2) {
      const cards = cardPlayerIds.map(cardPlayerId => ({
        index: selectedCards[cardPlayerId],
        playerId: cardPlayerId
      }));
      socket.emit('game.swapCard', { gameId, cards });
      // Reset selection
      setSelectedCards({});
    }
  }, [selectedCards]);

  const revealCard = (cardIndex, cardPlayerId) => {
    setUnfoldedCards({
      ...unfoldedCards,
      [cardPlayerId]: {
        ...unfoldedCards[cardPlayerId],
        [cardIndex]: true
      }
    });
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

  const selectCard = (cardIndex, cardPlayerId) => {
    // Player can't select his cards for a joker action
    if (selfAction === 'swap' && cardPlayerId === playerId) {
      return;
    }

    // Player has already selected one card
    if (Object.keys(selectedCards).length) {
      // Should have a least one of the card that is yours
      if (nextAction === 'exchange' && !selectedCards[playerId] && cardPlayerId !== playerId) {
        return;
      }
    }

    // Toggle the card if card exists, use playerId to avoid two card for the same player
    setSelectedCards({
      ...selectedCards,
      [cardPlayerId]: selectedCards[cardPlayerId] ? null : cardIndex
    });
  };

  const handleGiveCard = (cardIndex, cardPlayerId) => {
    console.log('handleGiveCard');
    const card = { index: cardIndex, playerId: cardPlayerId };
    socket.emit('game.giveCard', { gameId, playerId, card });
  };

  const handleHideCard = (cardIndex, cardPlayerId) => {
    console.log('handleHideCard');

    // Tell the world the card has been watched
    if (isStarted) {
      socket.emit('game.hasWatchedCard', { gameId, playerId });
    }

    // Tell if the player has discovered his 2 cards
    if (
      !isStarted &&
      unfoldedCardsCount === 1 &&
      Object.keys(unfoldedCards[playerId] || {}).length === DISCOVERY_CARDS_COUNT
    ) {
      socket.emit('game.setPlayerhasDiscoveredHisCards', { gameId, playerId });
    }

    hideCard(cardIndex, cardPlayerId);
  };

  const handleSetPlayerReady = () => {
    // Ready to start/reboot the game reset data
    socket.emit('game.setPlayerReady', { gameId, playerId });
    setSelectedCards({});
    setUnfoldedCards({});
  };

  const handlePickDrawCard = () => {
    console.log('handlePickDrawCard');
    socket.emit('game.pickDrawCard', { gameId, playerId });
  };

  const handlePickDiscardCard = () => {
    console.log('handlePickDiscardCard');
    socket.emit('game.pickDiscardCard', { gameId, playerId });
  };

  const handleThrowTmpCard = () => {
    socket.emit('game.throwTmpCard', { gameId, playerId });
  };

  const handleThrowHandCard = (cardIndex, cardPlayerId) => {
    console.log('handleThrowHandCard', { cardIndex, cardPlayerId });
    const card = { index: cardIndex, playerId: cardPlayerId };
    socket.emit('game.throwCard', { gameId, playerId, card });
  };

  const handleWatchCard = (cardIndex, cardPlayerId) => {
    console.log('handleWatchCard');

    // TODO: Send to back that player is looking card
    // if (isStarted) {
    //   socket.emit('game.setPlayerhasDiscoveredHisCards', { gameId, playerId });
    // }

    revealCard(cardIndex, cardPlayerId);
  };

  const renderPlayerCard = ({ cards, id: cardPlayerId }) => {
    const isSelf = cardPlayerId === playerId;

    const handleCardClick = cardIndex => {
      // Game hasn't start
      if (!isStarted) {
        // Player can only watch their own cards
        if (isSelf && Object.keys(unfoldedCards[playerId] || {}).length < DISCOVERY_CARDS_COUNT) {
          return handleWatchCard(cardIndex, cardPlayerId);
        }
        // Don't do anything
        return;
      }

      // Game started it's player turn
      if (isSelfToPlay) {
        // Can only watch one card at a time
        if (selfAction === 'watch' && !unfoldedCardsCount) {
          return handleWatchCard(cardIndex, cardPlayerId);
        }
        if (selfAction === 'give' && cardPlayerId === playerId) {
          return handleGiveCard(cardIndex, cardPlayerId);
        }
        if (selfAction === 'exchange' || selfAction === 'swap') {
          return selectCard(cardIndex, cardPlayerId, selfAction);
        }
      }
      // No action? the player want to throw the card then
      return handleThrowHandCard(cardIndex, cardPlayerId);
    };

    return (
      <PlayerCards
        cardPlayerId={cardPlayerId}
        cards={cards}
        onCardHide={handleHideCard}
        onCardPick={handleCardClick}
        selectedCards={selectedCards}
        unfoldedCards={unfoldedCards}
      />
    );
  };

  return (
    <div>
      <h1>Game name : {name}</h1>
      <p>You are : {playerId}</p>
      <p>
        Turn of {nextAction.playerId} to {nextAction.action}
      </p>

      <div>
        <Subheading>Scores</Subheading>
        {Object.keys(players).map(pid => {
          const { name, scores } = players[pid];
          return (
            <p key={pid}>
              {name}: {scores.reduce((sum, score) => sum + score, 0)}
            </p>
          );
        })}
      </div>

      {isReady && (
        <Row spacing="s8">
          <DiscardPile
            discardPile={isStarted ? discardPile : undefined}
            {...(selfAction === 'pick' && {
              onDrawDiscarded: handlePickDiscardCard,
              onDrawNew: handlePickDrawCard
            })}
          />
          <PickedCard card={tmpCard} onClick={handleThrowTmpCard} />
        </Row>
      )}

      <Column spacing="s1">
        {Object.keys(players).map(pid => {
          const player = players[pid];
          const { name, isReady } = player;
          const isSelf = pid === playerId;
          return (
            <div key={`game${pid}`}>
              <span>{isSelf ? 'you' : name}</span>
              {!isReady
                ? isSelf && <button onClick={handleSetPlayerReady}>Set as isReady</button>
                : ' is ready'}
              {renderPlayerCard(player)}
            </div>
          );
        })}
      </Column>
    </div>
  );
};

export default Game;
