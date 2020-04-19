import styled, { css } from 'styled-components';

import theme from '../theme';

export const StyledImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
`;

export const FrontCard = styled(StyledImg)`
  transform: rotateY(180deg);
`;

export const BackCard = styled(StyledImg)``;

export const PlayingCardInner = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  border-radius: ${theme.metric.borderRadius};
  transition: transform 0.4s ease-in-out;
  transform-style: preserve-3d;
  will-change: transform;

  ${props =>
    !props.isHidden &&
    css`
      transform: rotateY(180deg);
    `}

  /* DEBUG */
  /* ${StyledImg} {
    opacity: 0;
  }
  ${FrontCard} {
    opacity: 0.3;
    backface-visibility: visible;
  }
  ${props =>
    !props.isHidden &&
    css`
      ${FrontCard} {
        opacity: 1;
      }
    `} */
  /* END DEBUG */
`;

export const PlayingCardWrapper = styled.div`
  pointer-events: initial;
  transition: transform 0.1s ease-out;
  perspective: 1000px;

  ${props =>
    props.isRotated
      ? css`
          height: ${theme.metric.cardWidth};
          width: calc(${theme.metric.cardWidth} * 1.4);
        `
      : css`
          width: ${theme.metric.cardWidth};
          height: calc(${theme.metric.cardWidth} * 1.4);
        `}

  ${props =>
    props.onClick &&
    css`
      &:hover {
        cursor: pointer;
        box-shadow: 2px 8px 10px ${theme.color.shadow};
        transform: scale(1.05);
        transition: transform 0.2s ease-out;
      }
    `}

  ${props =>
    props.isSelected &&
    css`
      transform: scale(1.1);
      box-shadow: 0 0 2px 2px ${theme.color.governorBay};

      &:hover {
        box-shadow: 2px 8px 10px ${theme.color.shadow};
        transform: scale(1.15);
      }
    `}
  
  ${props =>
    props.isFailedCard &&
    css`
      transform: rotateZ(-10deg);

      ${PlayingCardInner} {
        transform: rotateY(180deg);
      }

      &:hover {
        transform: scale(1.05) rotateZ(-10deg);
      }
    `}
`;
