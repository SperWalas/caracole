import React from 'react';
import styled, { css } from 'styled-components';

import theme from '../theme';

export const DECK_COLOR = 'blue'; // 'blue' | 'red'

const SUIT_LETTER = {
  clubs: 'C',
  diamonds: 'D',
  hearts: 'H',
  spades: 'S'
};

export const StyledImg = styled.img`
  width: ${theme.metric.cardWidth};
  height: calc(${theme.metric.cardWidth} * 1.4);
  border-radius: ${theme.metric.borderRadius};

  ${props =>
    props.onClick &&
    css`
      cursor: pointer;
      transition: all ${theme.animation.timing} ${theme.animation.easing};

      &:hover {
        box-shadow: 2px 8px 10px ${theme.color.shadow};
        transform: translateY(-3px);
      }
    `};

  ${props =>
    props.isSelected &&
    css`
      box-shadow: 0 0 2px 2px ${theme.color.governorBay};

      &:hover {
        box-shadow: 0 0 2px 2px ${theme.color.governorBay}, 2px 8px 10px ${theme.color.shadow};
      }
    `};
`;

const PlayingCard = ({ card, isHidden, ...rest }) => {
  if (isHidden) {
    return <StyledImg {...rest} src={`/cards/${DECK_COLOR}_back.svg`} />;
  }

  const { value, suit } = card;
  const suitLetter = SUIT_LETTER[suit];
  const cardId = value === 'Joker' ? 'joker' : `${value}${suitLetter}`;

  return <StyledImg {...rest} src={`/cards/${cardId}.svg`} />;
};

export default PlayingCard;
