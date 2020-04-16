import React from 'react';

import useGame from '../../../../hooks/useGame';
import useCardActions from '../../../../hooks/useCardActions';
import PlayerCards from '../../PlayerCards';
import { Body, Subheading } from '../../../text';
import { ActionWrapper, RelativeRow } from './_styled';

const RightPlayer = ({ player }) => {
  const { game } = useGame();
  const { nextPlayer } = useCardActions();

  const { isReady } = game;

  const isPlayerToPlay = nextPlayer && nextPlayer.id === player.id;
  const hasCaracoler = game.caracolePlayer && game.caracolePlayer.id === player.id;

  return (
    <RelativeRow>
      <ActionWrapper spacing="s1">
        <Subheading highlighted={isPlayerToPlay}>{player.name}</Subheading>
        {!isReady ? player.isReady ? <Body>Ready</Body> : <Body>Not ready yet…</Body> : null}
        {hasCaracoler && <Body>Called Caracole</Body>}
      </ActionWrapper>
      <PlayerCards player={player} position="right" />
    </RelativeRow>
  );
};

export default RightPlayer;
