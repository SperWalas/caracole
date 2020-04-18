import React from 'react';

import useGame from '../../../../hooks/useGame';
import useCardActions from '../../../../hooks/useCardActions';
import Button from '../../../Button';
import PlayerCards from '../../PlayerCards';
import { Body, Subheading } from '../../../text';
import { ActionWrapper, RelativeRow } from './_styled';

const BottomPlayer = ({ player }) => {
  const { handlePlayerIsReady, handlePlayerTriggerCaracole, game } = useGame();
  const { nextAction, nextPlayer } = useCardActions();

  const { isReady } = game;

  const isPlayerToPlay = nextPlayer && nextPlayer.id === player.id;
  const canCaracole = isPlayerToPlay && nextAction === 'pick' && !game.caracolePlayer;
  const hasCaracoler = game.caracolePlayer && game.caracolePlayer.id === player.id;

  return (
    <RelativeRow>
      <ActionWrapper spacing="s1">
        <Subheading highlighted={isPlayerToPlay}>{player.name}</Subheading>
        {!!canCaracole && isReady && (
          <Button onClick={() => handlePlayerTriggerCaracole(player)}>Caracoler</Button>
        )}
        {!isReady && (
          <>
            {player.isReady ? (
              <Body>Ready</Body>
            ) : (
              <Button onClick={handlePlayerIsReady}>Ready</Button>
            )}
          </>
        )}
        {hasCaracoler && <Body>Called Caracole</Body>}
      </ActionWrapper>
      <PlayerCards player={player} />
    </RelativeRow>
  );
};

export default BottomPlayer;
