import React from 'react';

import useCardSpots, { getPlayerCardSpotId } from '../../../hooks/useCardSpots';
import CardSpot from '../../CardSpot';
import { StyledRow } from './_styled';

const PlayerCards = ({ player }) => {
  const { cards, id: playerId } = player;
  const { setCardSpotRef } = useCardSpots();
  const spots = Array.apply(null, Array(Math.max(cards.length, 4)));

  return (
    <StyledRow spacing="s1_5">
      {spots.map((_, idx) => (
        <CardSpot
          key={`${playerId}${idx}`}
          ref={setCardSpotRef(getPlayerCardSpotId(playerId, idx))}
        />
      ))}
    </StyledRow>
  );
};

export default PlayerCards;
