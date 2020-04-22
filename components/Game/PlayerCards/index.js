import React from 'react';

import useCardActions from '../../../hooks/useCardActions';
import useCardSpots, { getPlayerCardSpotId } from '../../../hooks/useCardSpots';
import CardSpot from '../../CardSpot';
import { StyledColumn } from './_styled';

const PlayerCards = ({ player, position }) => {
  const { cards, id: playerId } = player;
  const { nextAction, nextPlayer } = useCardActions();
  const { setCardSpotRef } = useCardSpots();
  // Find maximum spot used
  const [lastCard] = cards.sort((c1, c2) => (c1.spot > c2.spot ? 1 : -1)).slice(-1);
  const nbrOfSpots = lastCard ? Math.max(parseInt(lastCard.spot.slice(-1)) + 1, 4) : 4;

  const spots = Array.apply(null, Array(nbrOfSpots));
  const isPlayerToPlay = nextPlayer && nextAction && playerId === nextPlayer.id;

  return (
    <StyledColumn cardCount={spots.length} isHighlighted={isPlayerToPlay} position={position}>
      {spots.map((_, idx) => (
        <CardSpot
          key={`${playerId}${idx}`}
          ref={setCardSpotRef(getPlayerCardSpotId(playerId, idx))}
          data-rotation={position}
          isRotated={position === 'left' || position === 'right'}
        />
      ))}
    </StyledColumn>
  );
};

export default PlayerCards;
