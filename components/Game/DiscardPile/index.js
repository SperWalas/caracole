import React from 'react';

import CardSpot from '../../CardSpot';
import { Row } from '../../layout';
import PlayingCard from '../../PlayingCard';
import { DiscardPileWrapper, DrawPile, FailedCard } from './_styled';

const DiscardPile = ({ discardPile, failedCard, onDrawDiscarded, onPickFailedCard, onDrawNew }) => {
  return (
    <Row spacing="s1_5" justifyContent="center">
      <DiscardPileWrapper>
        {discardPile && discardPile.length ? (
          <PlayingCard card={discardPile[discardPile.length - 1]} onClick={onDrawDiscarded} />
        ) : (
          <CardSpot />
        )}
        {failedCard && (
          <FailedCard>
            <PlayingCard card={failedCard.card} onClick={onPickFailedCard} />
          </FailedCard>
        )}
      </DiscardPileWrapper>
      <DrawPile>
        <PlayingCard isHidden onClick={onDrawNew} />
      </DrawPile>
    </Row>
  );
};

export default DiscardPile;
