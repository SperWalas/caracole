import React, { useState } from 'react';
import useSocket from '../../hooks/useSocket';

const Game = ({ game, playerId }) => {
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

  // Listen to message when user watch a card
  useSocket('game.discoveredCard', card => {
    confirm(`The card is ${card.value} of ${card.suit}`);
    socket.emit('game.hasWatchedCard', { gameId, playerId });
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

  const handleWatchCard = (cardIndex, cardPlayerId) => {
    console.log('handleWatchCard');
    const card = { index: cardIndex, playerId: cardPlayerId };
    socket.emit('game.watchCard', { gameId, playerId, card });
  };

  const renderPlayerCard = ({ cards, id: cardPlayerId }) => {
    return cards.map((card, idx) => (
      <div key={idx}>
        {card ? (
          <button
            key={idx}
            onClick={() =>
              !isStarted || (isToPlayerToPlay && playerAction.action === 'watch')
                ? handleWatchCard(idx, cardPlayerId)
                : cardPlayerId === playerId && isToPlayerToPlay && playerAction.action === 'give'
                ? handleGiveCard(idx, cardPlayerId)
                : handleThrowHandCard(idx, cardPlayerId)
            }
          >
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
            {discardPile.length ? `${discardPile[0].value} of ${discardPile[0].suit}` : 'No card'}
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
