import React from 'react';

import CardSpot from '../../CardSpot';
import { Row } from '../../layout';
import PlayingCard from '../../PlayingCard';
import { DrawPile } from './_styled';

const DiscardPile = ({ discardPile, onDrawDiscarded, onDrawNew }) => {
  return (
    <Row spacing="s1_5" justifyContent="center">
      {discardPile && discardPile.length ? (
        <PlayingCard card={discardPile[discardPile.length - 1]} onClick={onDrawDiscarded} />
      ) : (
        <CardSpot />
      )}
      <DrawPile>
        <PlayingCard isHidden onClick={onDrawNew} />
      </DrawPile>
    </Row>
  );
};

export default DiscardPile;
