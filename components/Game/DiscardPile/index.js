import React from 'react';

import CardSpot from '../../CardSpot';
import PlayingCard from '../../PlayingCard';
import { FailedCard, RelativeWrapper } from './_styled';

const DiscardPile = ({ discardPile, failedCard, onPickDiscardedCard, onPickFailedCard }) => {
  return (
    <RelativeWrapper>
      <CardSpot
        onClick={onPickDiscardedCard}
        {...((!discardPile || !discardPile.length) && { style: { opacity: 0 } })}
      />
      <FailedCard>
        {failedCard && <PlayingCard card={failedCard.card} onClick={onPickFailedCard} />}
      </FailedCard>
    </RelativeWrapper>
  );
};

export default DiscardPile;
