import React from 'react';

import useCardSpots, { getPlayerCardSpotId } from '../../../hooks/useCardSpots';
import CardSpot from '../../CardSpot';
import { StyledColumn } from './_styled';

const PlayerCards = ({ player, position }) => {
  const { cards, id: playerId } = player;
  const { setCardSpotRef } = useCardSpots();
  const spots = Array.apply(null, Array(Math.max(cards.length, 4)));

  return (
    <StyledColumn cardCount={spots.length} position={position}>
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
