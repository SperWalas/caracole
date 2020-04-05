import React from 'react';

import useCardSpots, {
  DISCARD_PILE_SPOT_ID,
  FAILED_CARD_SPOT_ID
} from '../../../hooks/useCardSpots';
import CardSpot from '../../CardSpot';
import PlayingCard from '../../PlayingCard';
import { FailedCard, RelativeWrapper } from './_styled';

const DiscardPile = ({ discardPile, failedCard, onPickDiscardedCard, onPickFailedCard }) => {
  const { setCardSpotRef } = useCardSpots();
  return (
    <RelativeWrapper>
      <CardSpot
        ref={setCardSpotRef(DISCARD_PILE_SPOT_ID)}
        onClick={onPickDiscardedCard}
        {...((!discardPile || !discardPile.length) && { style: { opacity: 0 } })}
      />
      <FailedCard ref={setCardSpotRef(FAILED_CARD_SPOT_ID)}>
        {failedCard && <PlayingCard card={failedCard.card} onClick={onPickFailedCard} />}
      </FailedCard>
    </RelativeWrapper>
  );
};

export default DiscardPile;
