import React from 'react';
import styled, { css } from 'styled-components';

import theme from '../theme';

const DECK_COLOR = 'blue'; // 'blue' | 'red'

const SUIT_LETTER = {
  clubs: 'C',
  diamonds: 'D',
  hearts: 'H',
  spades: 'S'
};

const StyledImg = styled.img`
  margin: ${theme.spacing.s1};
  width: ${theme.metric.cardWidth};
  height: auto;
  border-radius: 7px;

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
`;

const Card = ({ card, isHidden, onClick }) => {
  if (isHidden) {
    return <StyledImg onClick={onClick} src={`/cards/${DECK_COLOR}_back.svg`} />;
  }

  const { value, suit } = card;
  const suitLetter = SUIT_LETTER[suit];
  const cardId = value === 'Joker' ? 'joker' : `${value}${suitLetter}`;

  return <StyledImg onClick={onClick} src={`/cards/${cardId}.svg`} />;
};

export default Card;
