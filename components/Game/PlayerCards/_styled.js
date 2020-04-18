import styled, { css } from 'styled-components';

import theme from '../../theme';
import { PlayingCardWrapper } from '../../PlayingCard/_styled';

const getTopToBottomWidth = ({ cardCount }) => `
  calc(
    (${theme.metric.cardWidth} + ${theme.spacing.s0} * 2) *
      ${Math.ceil(cardCount / 2)}
  )
`;

const getLeftToRightWidth = () => `
  calc((${theme.metric.cardWidth} * 1.4 + ${theme.spacing.s0}) * 2 + 8px)
`;

export const StyledColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  pointer-events: none;

  width: ${getTopToBottomWidth};
  height: ${getLeftToRightWidth};

  ${PlayingCardWrapper} {
    flex-shrink: 0;
    flex-grow: 0;
    margin: ${theme.spacing.s0};
  }

  ${props =>
    (props.position === 'left' || props.position === 'right') &&
    css`
      height: ${getTopToBottomWidth};
      width: ${getLeftToRightWidth};
    `}

  ${props =>
    props.position === 'left' &&
    css`
      flex-direction: row-reverse;
    `}

  ${props =>
    props.position === 'right' &&
    css`
      flex-direction: row;
      flex-wrap: wrap-reverse;
    `}

  ${props =>
    props.position === 'top' &&
    css`
      flex-direction: column-reverse;
      flex-wrap: wrap-reverse;
    `}

  ${props =>
    props.isHighlighted &&
    css`
      &::before {
        --halo-color: rgba(255, 255, 255, 0.4);
        content: '';
        z-index: -1;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: var(--halo-color);
        box-shadow: 0 0 65px 65px var(--halo-color);
        border-radius: 50px;
      }
    `}

`;
