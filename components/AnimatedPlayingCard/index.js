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
  const rotation = destinationNode ? destinationNode.dataset.rotation || 'top' : 'top';
  const rotationAnimation =
    rotation === 'top' || 'rotation' === 'bottom'
      ? 'rotate(0deg)'
      : rotation === 'right'
      ? 'rotate(-90deg)'
      : 'rotate(90deg)';

  const [offset, setOffset] = useState(() => getNodesOffset(originNode, destinationNode));

  useEffect(() => {
    const newOffset = getNodesOffset(originNode, destinationNode);
    setOffset(newOffset);
  }, [cardSpots, width, height, originNode, destinationNode]);

  const animatedStyle = useSpring({
    to: {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0) ${rotationAnimation}`
    }
  });

  return (
    <StyledAnimatedDiv ref={cardRef} style={animatedStyle}>
      <PlayingCard card={card} />
    </StyledAnimatedDiv>
  );
};

export default memo(AnimatedPlayingCard);
