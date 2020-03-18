import React, { useState } from 'react';

import useSocket from '../../hooks/useSocket';
import Card from '../Card';
import { Row, Column } from '../layout';
import { Subheading } from '../text';

const DISCOVERY_CARDS_COUNT = 2;

const Game = ({ game, playerId }) => {
  // Keep track of unfolded cards using their indexes
  const [unfoldedCards, setUnfoldedCards] = useState({});
  const [tmpCard, setTmpCard] = useState(null);
  const { discardPile, id: gameId, name, nextActions, players, isStarted } = game;

  const nextAction = nextActions.length && nextActions[0];
  const isToPlayerToPlay = nextAction && nextAction.playerId === playerId;
  const playerAction = isToPlayerToPlay ? nextAction : null;

  // Number of cards currently unfolded
  const unfoldedCardsCount = Object.keys(unfoldedCards).filter(key => !!unfoldedCards[key]).length;

  // Listen to message when user pick from drawPile or discardPile
  const socket = useSocket('game.pickedCard', card => {
    console.log('pickedCard', { card });
    setTmpCard(card);
  });

  const revealCard = (cardIndex, card) => {
    setUnfoldedCards({ ...unfoldedCards, [cardIndex]: card });
  };

  const hideCard = cardIndex => {
    setUnfoldedCards({ ...unfoldedCards, [cardIndex]: null });
  };

  const handleGiveCard = (cardIndex, cardPlayerId) => {
    console.log('handleGiveCard');
    const card = { index: cardIndex, playerId: cardPlayerId };
    socket.emit('game.giveCard', { gameId, playerId, card });
  };

  const handleHideCard = (idx, card) => {
    console.log('handleHideCard');

    // Tell the world the card has been watched
    if (isStarted) {
      socket.emit('game.hasWatchedCard', { gameId, playerId });
    }

    // Tell if the player has discovered his 2 cards
    if (
      !isStarted &&
      unfoldedCardsCount === 1 &&
      Object.keys(unfoldedCards).length === DISCOVERY_CARDS_COUNT
    ) {
      socket.emit('game.setPlayerhasDiscoveredHisCards', { gameId, playerId });
    }

    hideCard(idx, card);
  };

  const handleSetPlayerReady = () => {
    socket.emit('game.setPlayerReady', { gameId, playerId });
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
    setTmpCard(null);
  };

  const handleThrowHandCard = (cardIndex, cardPlayerId) => {
    console.log('handleThrowHandCard', { cardIndex, cardPlayerId });
    const card = { index: cardIndex, playerId: cardPlayerId };
    socket.emit('game.throwCard', { gameId, playerId, card });
    setTmpCard(null);
  };

  const handleWatchCard = (idx, card) => {
    console.log('handleWatchCard');

    // TODO: Send to back that player is looking card
    // if (isStarted) {
    //   socket.emit('game.setPlayerhasDiscoveredHisCards', { gameId, playerId });
    // }

    revealCard(idx, card);
  };

  const renderPlayerCard = ({ cards, id: cardPlayerId }) => {
    const isSelf = cardPlayerId === playerId;

    const handleCardClick = (idx, card) => {
      // Game hasn't start
      if (!isStarted) {
        // Player can only watch their own cards
        if (isSelf && Object.keys(unfoldedCards).length < DISCOVERY_CARDS_COUNT) {
          return handleWatchCard(idx, card);
        }
        // Don't do anything
        return;
      }

      // Game started it's player turn
      if (isToPlayerToPlay) {
        // Can only watch one card at a time
        if (playerAction.action === 'watch' && !unfoldedCardsCount) {
          return handleWatchCard(idx, card);
        }
        if (playerAction.action === 'give' && cardPlayerId === playerId) {
          return handleGiveCard(idx, cardPlayerId);
        }
      }
      // No action? the player want to throw the card then
      return handleThrowHandCard(idx, cardPlayerId);
    };

    return (
      <Row>
        {cards.map((card, idx) => (
          <div key={idx}>
            {card && (
              <>
                {isSelf && !!unfoldedCards[idx] ? (
                  <Card
                    key={idx}
                    card={unfoldedCards[idx]}
                    onClick={() => handleHideCard(idx, card)}
                  />
                ) : (
                  <Card key={idx} isHidden onClick={() => handleCardClick(idx, card)} />
                )}
              </>
            )}
          </div>
        ))}
      </Row>
    );
  };

  const renderDiscardPile = () => (
    <Column spacing="s2">
      <Subheading>Discard Pile</Subheading>
      <Row>
        <Card
          isHidden
          {...(playerAction && playerAction.action === 'pick' && { onClick: handlePickDrawCard })}
        />
        {discardPile.length && (
          <Card
            card={discardPile[discardPile.length - 1]}
            {...(playerAction &&
              playerAction.action === 'pick' && { onClick: handlePickDiscardCard })}
          />
        )}
      </Row>
    </Column>
  );

  const renderPickedCard = () =>
    tmpCard && (
      <Column spacing="s2">
        <Subheading>Picked card</Subheading>
        <Card card={tmpCard} onClick={handleThrowTmpCard} />
      </Column>
    );

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

      {isStarted && (
        <Row spacing="s5">
          {renderDiscardPile()}
          {renderPickedCard()}
        </Row>
      )}

      <Column spacing="s1">
        {Object.keys(players).map(pid => {
          const player = players[pid];
          const { name, isReady } = player;
          const isPlayer = pid === playerId;
          return (
            <div key={`game${pid}`}>
              <span>{isPlayer ? 'you' : name}</span>
              {!isReady
                ? pid === playerId && <button onClick={handleSetPlayerReady}>Set as isReady</button>
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
