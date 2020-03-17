import React, { useState } from 'react';
import useSocket from '../../hooks/useSocket';

const Game = ({ game, playerId }) => {
  // TODO: reset this when game reset
  const [nbrCardsDiscover, setNbrCardsDiscover] = useState(0);
  const [tmpCard, setTmpCard] = useState(null);
  const { discardPile, id: gameId, name, nextActions, players, isStarted } = game;

  const nextAction = nextActions.length && nextActions[0];
  const isToPlayerToPlay = nextAction && nextAction.playerId === playerId;
  const playerAction = isToPlayerToPlay ? nextAction : null;

  // Listen to message when user pick from drawPile or discardPile
  const socket = useSocket('game.pickedCard', card => {
    console.log('pickedCard', { card });
    setTmpCard(card);
  });

  const handleGiveCard = (cardIndex, cardPlayerId) => {
    console.log('handleGiveCard');
    const card = { index: cardIndex, playerId: cardPlayerId };
    socket.emit('game.giveCard', { gameId, playerId, card });
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
    setTmpCard(null);
    socket.emit('game.throwTmpCard', { gameId, playerId });
  };

  const handleThrowHandCard = (cardIndex, cardPlayerId) => {
    console.log('handleThrowHandCard', { cardIndex, cardPlayerId });
    const card = { index: cardIndex, playerId: cardPlayerId };
    socket.emit('game.throwCard', { gameId, playerId, card });
    setTmpCard(null);
  };

  const handleWatchCard = card => {
    console.log('handleWatchCard');
    // TODO: Send to back that player is looking card
    // if (isStarted) {
    //   socket.emit('game.setPlayerhasDiscoveredHisCards', { gameId, playerId });
    // }

    confirm(`The card is ${card.value} of ${card.suit}`);

    // Tell the world the player watcher
    if (isStarted) {
      socket.emit('game.hasWatchedCard', { gameId, playerId });
    }

    // Number of card to discover at the beginning
    setNbrCardsDiscover(nbrCardsDiscover + 1);

    if (nbrCardsDiscover === 1) {
      socket.emit('game.setPlayerhasDiscoveredHisCards', { gameId, playerId });
    }
  };

  const renderPlayerCard = ({ cards, id: cardPlayerId }) => {
    const handleClickOnCard = (card, idx) => {
      // Game hasn't start
      if (!isStarted) {
        // PLayer should one watch their own card
        if (cardPlayerId === playerId && nbrCardsDiscover < 2) {
          return handleWatchCard(card);
        }
        // Don't do anything
        return;
      }

      // Game started it's player turn
      if (isToPlayerToPlay) {
        if (playerAction.action === 'watch') {
          return handleWatchCard(card);
        }
        if (playerAction.action === 'give' && cardPlayerId === playerId) {
          return handleGiveCard(idx, cardPlayerId);
        }
      }
      // No action? the player want to throw the card then
      return handleThrowHandCard(idx, cardPlayerId);
    };

    return cards.map((card, idx) => (
      <div key={idx}>
        {card ? (
          <button key={idx} onClick={() => handleClickOnCard(card, idx)}>
            Card {idx}
          </button>
        ) : (
          `No card`
        )}
      </div>
    ));
  };

  return (
    <div>
      <h1>Game name : {name}</h1>
      <p>You are : {playerId}</p>
      <p>
        Turn of {nextAction.playerId} to {nextAction.action}
      </p>

      <div>
        <h2>Scores</h2>
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
        <div>
          <div>
            Last card :
            {discardPile.length
              ? `${discardPile[discardPile.length - 1].value} of ${
                  discardPile[discardPile.length - 1].suit
                }`
              : 'No card'}
            {playerAction && playerAction.action === 'pick' && (
              <button onClick={handlePickDiscardCard}>Pick</button>
            )}
          </div>
          {playerAction && playerAction.action === 'pick' && (
            <button onClick={handlePickDrawCard}>Pick new card</button>
          )}
        </div>
      )}

      <div>
        {Object.keys(players).map(pid => {
          const player = players[pid];
          const { name, isReady } = player;
          const isPlayer = pid === playerId;
          return (
            <div key={`game${pid}`} style={{ marginTop: '10px' }}>
              <span>{isPlayer ? 'you' : name}</span>
              {!isReady
                ? pid === playerId && <button onClick={handleSetPlayerReady}>Set as isReady</button>
                : ' is ready'}
              <p>{renderPlayerCard(player)}</p>
              {isPlayer && tmpCard && (
                <p>
                  Card pick is {tmpCard.value} of {tmpCard.suit}{' '}
                  <button onClick={handleThrowTmpCard}>Throw away</button>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Game;
