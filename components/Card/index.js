import React from 'react';

const DECK_COLOR = 'blue'; // 'blue' | 'red'

const SUIT_LETTER = {
  clubs: 'C',
  diamonds: 'D',
  hearts: 'H',
  spades: 'S'
};

const cardStyle = {
  margin: '5px',
  width: '140px',
  height: 'auto'
};

const Card = ({ card, isHidden, onClick }) => {
  const imgProps = {
    style: {
      ...cardStyle,
      ...(onClick && { cursor: 'pointer' })
    },
    onClick
  };

  if (isHidden) {
    return <img {...imgProps} src={`/cards/${DECK_COLOR}_back.svg`} />;
  }

  const { value, suit } = card;
  const suitLetter = SUIT_LETTER[suit];
  const cardId = value === 'Joker' ? 'joker' : `${value}${suitLetter}`;

  return <img {...imgProps} src={`/cards/${cardId}.svg`} />;
};

export default Card;
