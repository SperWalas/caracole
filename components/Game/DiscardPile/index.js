import React from 'react';

import CardSpot from '../../CardSpot';
import { Column, Row } from '../../layout';
import PlayingCard from '../../PlayingCard';
import { Subheading } from '../../text';

const DiscardPile = ({ discardPile, onDrawDiscarded, onDrawNew }) => {
  return (
    <Column spacing="s2">
      <Subheading>Discard Pile</Subheading>
      <Row spacing="s1_5">
        {discardPile && discardPile.length ? (
          <PlayingCard card={discardPile[discardPile.length - 1]} onClick={onDrawDiscarded} />
        ) : (
          <CardSpot />
        )}
        <PlayingCard isHidden onClick={onDrawNew} />
      </Row>
    </Column>
  );
};

export default DiscardPile;
