import React from 'react';

import useCardSpots, { PICKED_CARD_SPOT_ID } from '../../../hooks/useCardSpots';
import CardSpot from '../../CardSpot';

const PickedCard = ({ onClick }) => {
  const { setCardSpotRef } = useCardSpots();

  return (
    <div ref={setCardSpotRef(PICKED_CARD_SPOT_ID)}>
      <CardSpot style={{ opacity: 0 }} onClick={onClick} />
    </div>
  );
};

export default PickedCard;
