import React from 'react';

import PlayingCard from '../../PlayingCard';
import { DrawPileWrapper } from './_styled';

const DrawPile = ({ onDraw }) => {
  return (
    <DrawPileWrapper>
      <PlayingCard isHidden onClick={onDraw} />
    </DrawPileWrapper>
  );
};

export default DrawPile;
