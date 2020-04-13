import React, { useRef, useEffect, useState, memo } from 'react';
import { useSpring } from 'react-spring';
import { useWindowSize } from 'react-use';

import useCardSpots, { DRAW_PILE_SPOT_ID } from '../../hooks/useCardSpots';
import PlayingCard from '../PlayingCard';
import { getNodesOffset } from './helpers';
import { StyledAnimatedDiv } from './_styled';

const AnimatedPlayingCard = ({ card }) => {
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

  return (
    <StyledAnimatedDiv ref={cardRef} style={animatedStyle}>
      <PlayingCard card={card} />
    </StyledAnimatedDiv>
  );
};

export default memo(AnimatedPlayingCard);
