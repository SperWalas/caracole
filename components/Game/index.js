import React from 'react';

import { Row, Column } from '../layout';
import { Heading, Link } from '../text';

import DiscardPile from './DiscardPile';
import useGame from '../../hooks/useGame';
import useCardActions from '../../hooks/useCardActions';
import DrawPile from './DrawPile';
import PickedCard from './PickedCard';
import Scoreboard from './Scoreboard';
import LeftPlayer from './Players/LeftPlayer';
import RightPlayer from './Players/RightPlayer';
import TopPlayer from './Players/TopPlayer';
import BottomPlayer from './Players/BottomPlayer';

const Game = () => {
  const { game, selfId } = useGame();
  const { nextAction, nextPlayer } = useCardActions();

  const { cards, discardPile, drawPile, players, isReady, isStarted } = game;

  const playersValues = Object.values(players);
  const selfPlayer = playersValues.find(p => p.id === selfId) || {};
  const playersCount = playersValues.length;
  const orderTable = Array.apply(null, Array(playersCount)).map((_, idx) => {
    return (selfPlayer.order + idx) % playersCount;
  });
  const otherPlayers = playersValues.filter(p => p.id !== selfId) || [];
  const otherPlayersOrdered = otherPlayers.sort((a, b) => {
    return orderTable.indexOf(a.order) - orderTable.indexOf(b.order);
  });

  const renderCenterLayout = () => (
    <Column flex="1 0" spacing="s2" justifyContent="center">
      <Column textAlign="center">
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
        <PickedCard />
        <Row spacing="s1_5" justifyContent="center">
          <DiscardPile />
          <DrawPile cards={cards} drawPile={drawPile} discardPile={discardPile} />
        </Row>
      </Row>
      <Row justifyContent="center">
        <Scoreboard players={players}>
          {({ open }) => <Link onClick={open}>see scores</Link>}
        </Scoreboard>
      </Row>
    </Column>
  );

  return (
    <Row flex="1 0" padding="s2" justifyContent="space-between">
      <Column flex="1 0" justifyContent="space-around">
        {otherPlayersOrdered.length > 1 && <LeftPlayer player={otherPlayersOrdered[0]} />}
      </Column>

      <Column Column flex="1 0" justifyContent="space-between" alignItems="center">
        <Column flex="1 0">
          {otherPlayersOrdered.length === 1 && <TopPlayer player={otherPlayersOrdered[0]} />}
          {otherPlayersOrdered.length > 1 && <TopPlayer player={otherPlayersOrdered[1]} />}
        </Column>
        {renderCenterLayout()}
        <Column flex="1 0" justifyContent="flex-end">
          <BottomPlayer player={selfPlayer} />
        </Column>
      </Column>

      <Column Column flex="1 0" alignItems="flex-end" justifyContent="space-around">
        {otherPlayersOrdered.length === 3 && <RightPlayer player={otherPlayersOrdered[2]} />}
      </Column>
    </Row>
  );
};

export default Game;
