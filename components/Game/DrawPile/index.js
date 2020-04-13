import React from 'react';

import useCardSpots, { DRAW_PILE_SPOT_ID } from '../../../hooks/useCardSpots';
import AnimatedPlayingCard from '../../AnimatedPlayingCard';
import { DrawPileWrapper } from './_styled';

const DrawPile = ({ cards, discardPile, drawPile, onCardClick }) => {
  const { setCardSpotRef } = useCardSpots();

  const renderCards = cards => {
    // Sort cards from discard & draw pile.
    // We want the next & last one at the top of their respective each
    const sortedDiscardCards = cards
      .filter(card => card.spot === 'discard-pile')
      .sort((a, b) => {
        return (
          discardPile.findIndex(c => c.id === a.id) - discardPile.findIndex(c => c.id === b.id)
        );
      });
    const sortedDrawPile = cards
      .filter(card => card.spot === 'draw-pile')
      .sort((a, b) => {
        return drawPile.findIndex(c => c.id === a.id) - discardPile.findIndex(c => c.id === b.id);
      });
    const restCards = cards.filter(
      card => card.spot !== 'discard-pile' && card.spot !== 'draw-pile'
    );

    return [...sortedDiscardCards, ...sortedDrawPile, ...restCards].map(
      card => card && <AnimatedPlayingCard key={card.id} card={card} onClick={onCardClick} />
    );
  };

  return (
    <DrawPileWrapper ref={setCardSpotRef(DRAW_PILE_SPOT_ID)}>
      {/* Render every card on the draw pile, and position them to the right spot with CSS */}
      {!!cards && renderCards(cards)}
    </DrawPileWrapper>
  );
};

export default DrawPile;
