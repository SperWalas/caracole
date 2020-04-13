import React from 'react';

import useCardSpots, {
  DISCARD_PILE_SPOT_ID,
  FAILED_CARD_SPOT_ID
} from '../../../hooks/useCardSpots';
import CardSpot from '../../CardSpot';
import { FailedCard, RelativeWrapper } from './_styled';

const DiscardPile = () => {
  const { setCardSpotRef } = useCardSpots();

  return (
    <RelativeWrapper>
      <CardSpot ref={setCardSpotRef(DISCARD_PILE_SPOT_ID)} />
      <FailedCard ref={setCardSpotRef(FAILED_CARD_SPOT_ID)} />
    </RelativeWrapper>
  );
};

export default DiscardPile;
