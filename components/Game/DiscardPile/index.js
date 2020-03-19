import React from 'react';

import { Column, Row } from '../../layout';
import PlayingCard from '../../PlayingCard';
import { Heading } from '../../text';

const DiscardPile = ({ discardPile, onDrawDiscarded, onDrawNew }) => {
  return (
    <Column spacing="s2">
      <Heading>Discard Pile</Heading>
      <Row spacing="s1_5">
        <PlayingCard isHidden onClick={onDrawNew} />
        {discardPile && discardPile.length && (
          <PlayingCard card={discardPile[discardPile.length - 1]} onClick={onDrawDiscarded} />
        )}
      </Row>
    </Column>
  );
};

export default DiscardPile;
