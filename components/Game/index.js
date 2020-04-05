import React from 'react';

import { Row, Column } from '../layout';
import { Heading, Subheading, Body, Link } from '../text';

import Button from '../Button';
import DiscardPile from './DiscardPile';
import useGame from '../../hooks/useGame';
import useCardActions from '../../hooks/useCardActions';
import DrawPile from './DrawPile';
import PickedCard from './PickedCard';
import PlayerCards from './PlayerCards';
import Scoreboard from './Scoreboard';

const Game = () => {
  const { handleTriggerCaracole, game, selfId, selectedCards, unfoldedCards } = useGame();
  const {
    handleCardClick,
    handleHideCard,
    handlePickDrawCard,
    handlePickDrawCardAfterFail,
    handlePickDiscardedCard,
    handlePickFailedCard,
    handlePlayerReady,
    handleThrowTmpCard,
    isSelfToPlay,
    nextAction,
    nextPlayer
  } = useCardActions();

  const { cardBeingWatched, discardPile, failedCard, name, players, isReady, isStarted } = game;

  const selfPlayer = Object.values(players).find(p => p.id === selfId) || {};
  const otherPlayers = Object.values(players).filter(p => p.id !== selfId) || [];

  const { tmpCard } = selfPlayer;

  const renderPlayerDeck = (player, key) => {
    const isPlayerToPlay = nextPlayer && nextPlayer.id === player.id;
    const isSelf = selfPlayer.id === player.id;
    const canCaracole = isSelf && isPlayerToPlay && nextAction === 'pick' && !game.caracolePlayer;

    return (
      <Column spacing="s2" key={key} alignItems="center">
        <Row spacing="s2">
          <Subheading highlighted={isPlayerToPlay}>
            {!!isPlayerToPlay && '→'} {player.name} {!!isPlayerToPlay && '←'}
          </Subheading>
        </Row>

        <PlayerCards
          cardBeingWatched={!isSelfToPlay ? cardBeingWatched : null}
          cardPlayerId={player.id}
          cards={player.cards}
          onCardHide={handleHideCard}
          onCardPick={handleCardClick}
          selectedCards={selectedCards}
          shouldRevealAllCards={!isReady}
          unfoldedCards={unfoldedCards}
        />
        {!!canCaracole && isReady && (
          <Button onClick={() => handleTriggerCaracole(player)}>Caracoler !</Button>
        )}

        {!isReady && (
          <>
            {player.isReady ? (
              <Body>Ready</Body>
            ) : isSelf ? (
              <Button onClick={handlePlayerReady}>Let’s go !</Button>
            ) : (
              <Body>Not ready yet…</Body>
            )}
          </>
        )}
      </Column>
    );
  };

  return (
    <Column flex="1 0" padding="s3">
      <Column flex="1 0" justifyContent="space-between" spacing="s6">
        {/* TODO spread other players around a circle*/}
        <Row justifyContent="space-around" spacing="s3">
          {otherPlayers.map((player, index) => renderPlayerDeck(player, index))}
        </Row>

        <Column spacing="s2" justifyContent="center">
          <Column textAlign="center">
            <Body>Game name: {name}</Body>
            {!!nextPlayer && !!nextAction ? (
              <Heading withHighlightedParts>
                Turn of <strong>{nextPlayer.name}</strong> to <strong>{nextAction}</strong>
              </Heading>
            ) : (
              <>
                {!isReady ? (
                  <Heading>Waiting for every player to be ready</Heading>
                ) : (
                  !isStarted && <Heading>Every player should remember 2 of their cards</Heading>
                )}
              </>
            )}
          </Column>
          <Row justifyContent="center" spacing="s4">
            <PickedCard card={tmpCard} onClick={handleThrowTmpCard} />
            <Row spacing="s1_5" justifyContent="center">
              <DiscardPile
                pickedCard={tmpCard}
                discardPile={isStarted ? discardPile : undefined}
                failedCard={failedCard}
                players={players}
                {...(isSelfToPlay &&
                  nextAction === 'pick' && {
                    onPickDiscardedCard: handlePickDiscardedCard
                  })}
                {...(isSelfToPlay &&
                  nextAction === 'pickFailed' && {
                    onPickFailedCard: handlePickFailedCard
                  })}
              />
              <DrawPile
                cards={cards}
                onDraw={
                  (isSelfToPlay &&
                    ((nextAction === 'pick' && handlePickDrawCard) ||
                      (nextAction === 'pickDrawAfterFail' && handlePickDrawCardAfterFail))) ||
                  undefined
                }
              />
            </Row>
          </Row>
          <Row justifyContent="center">
            <Scoreboard players={players}>
              {({ open }) => <Link onClick={open}>see scores</Link>}
            </Scoreboard>
          </Row>
        </Column>

        <Row justifyContent="space-around">{renderPlayerDeck(selfPlayer)}</Row>
      </Column>
    </Column>
  );
};

export default Game;
