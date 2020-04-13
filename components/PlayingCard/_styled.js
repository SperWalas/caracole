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
  transition: transform 0.3s ease-out;
  transform-style: preserve-3d;
  cursor: pointer;

  ${props =>
    props.onClick &&
    css`
      &:hover {
        box-shadow: 2px 8px 10px ${theme.color.shadow};
        transform: translateY(-3px);
        transition: transform 0.1s ease-out;

        ${props =>
          !props.isHidden &&
          css`
            transform: rotateY(180deg) translateY(-3px);
          `}
      }
    `}

  ${props =>
    !props.isHidden &&
    css`
      transform: rotateY(180deg);
    `}

  ${props =>
    props.isFailedCard &&
    css`
      transform: rotateZ(-10deg) rotateY(180deg);
      &:hover {
        transform: translateY(-5px) rotateZ(-10deg) rotateY(180deg);
      }
    `}

  ${props =>
    props.isSelected &&
    css`
      transform: scale(1.1);
      box-shadow: 0 0 2px 2px ${theme.color.governorBay};

      &:hover {
        box-shadow: 2px 8px 10px ${theme.color.shadow};
        transform: scale(1.1) translateY(-5px);
      }
    `}

  /* ${props =>
    props.isPicked &&
    css`
      box-shadow: 0 6px 10px 0px ${theme.color.shadow};
      transform: scale(1.2) rotateY(180deg);

      &:hover {
        box-shadow: 0 6px 8px 3px ${theme.color.shadow}
        transform: scale(1.2) translateY(-5px) rotateY(180deg);
      }
    `} */

  /* DEBUG */
  ${StyledImg} {
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
    `}
  /* END DEBUG */
`;

export const PlayingCardWrapper = styled.div`
  width: ${theme.metric.cardWidth};
  height: calc(${theme.metric.cardWidth} * 1.4);
  perspective: 1000px;
`;
