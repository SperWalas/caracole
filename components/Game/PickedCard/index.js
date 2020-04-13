import React from 'react';

import useCardSpots, { PICKED_CARD_SPOT_ID } from '../../../hooks/useCardSpots';
import CardSpot from '../../CardSpot';

const PickedCard = () => {
  const { setCardSpotRef } = useCardSpots();

  return <CardSpot ref={setCardSpotRef(PICKED_CARD_SPOT_ID)} />;
};

export default PickedCard;
