import React from 'react';

import useCardSpots, { DRAW_PILE_SPOT_ID } from '../../../hooks/useCardSpots';
import PlayingCard from '../../PlayingCard';
import { DrawPileWrapper } from './_styled';

const DrawPile = ({ onDraw }) => {
  const { setCardSpotRef } = useCardSpots();

  return (
    <DrawPileWrapper ref={setCardSpotRef(DRAW_PILE_SPOT_ID)}>
      <PlayingCard isHidden onClick={onDraw} />
    </DrawPileWrapper>
  );
};

export default DrawPile;
