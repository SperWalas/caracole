import React from 'react';

import useCardSpots, { DRAW_PILE_SPOT_ID } from '../../../hooks/useCardSpots';
import AnimatedPlayingCard from '../../AnimatedPlayingCard';
import PlayingCard from '../../PlayingCard';
import { DrawPileWrapper } from './_styled';

const DrawPile = ({ cards, onDraw }) => {
  const { setCardSpotRef } = useCardSpots();

  return (
    <DrawPileWrapper ref={setCardSpotRef(DRAW_PILE_SPOT_ID)}>
      {/* Render every card on the draw pile, and position them to the right spot with CSS */}
      {!!cards && cards.map(card => card && <AnimatedPlayingCard key={card.id} card={card} />)}
      <PlayingCard isHidden onClick={onDraw} />
    </DrawPileWrapper>
  );
};

export default DrawPile;
