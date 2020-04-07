import React, { useRef, useEffect, useState, memo } from 'react';
import { animated, useSpring } from 'react-spring';
import { useWindowSize } from 'react-use';

import useCardSpots, {
  DRAW_PILE_SPOT_ID,
  DISCARD_PILE_SPOT_ID,
  PICKED_CARD_SPOT_ID
} from '../../hooks/useCardSpots';
import PlayingCard from '../PlayingCard';
import { getNodesOffset } from './helpers';

const AnimatedPlayingCard = ({ card, ...rest }) => {
  const cardRef = useRef();
  const { cardSpots, getSpotNode } = useCardSpots();
  const { width, height } = useWindowSize();

  const cardSpot = cardSpots[card.id];

  const originNode = getSpotNode(DRAW_PILE_SPOT_ID);
  const destinationNode = getSpotNode(cardSpot);

  const [offset, setOffset] = useState(() => getNodesOffset(originNode, destinationNode));

  useEffect(() => {
    const newOffset = getNodesOffset(originNode, destinationNode);
    setOffset(newOffset);
  }, [width, height, cardSpots]);

  const animatedStyle = useSpring({
    from: { transform: 'translate3d(0px, 0px, 0)' },
    to: { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }
  });

  const isInDiscardPile = cardSpot === DISCARD_PILE_SPOT_ID;
  const isInDrawPile = cardSpot === DRAW_PILE_SPOT_ID;
  const isPickedCard = cardSpot === PICKED_CARD_SPOT_ID;

  const isCardVisible = (isInDiscardPile || isPickedCard) && !isInDrawPile;

  return (
    <animated.div ref={cardRef} style={animatedStyle}>
      <PlayingCard
        card={isInDrawPile ? null : card}
        isHidden={isInDrawPile}
        style={{
          // Delegate click to card spot
          pointerEvents: 'none',
          // TEMP debug mode
          ...(!isCardVisible && { opacity: 0.2 })
        }}
        {...rest}
      />
    </animated.div>
  );
};

export default memo(AnimatedPlayingCard);
