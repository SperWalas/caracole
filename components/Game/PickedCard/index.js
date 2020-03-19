import React from 'react';
import { Column } from '../../layout';
import { Heading } from '../../text';
import PlayingCard from '../../PlayingCard';

const PickedCard = ({ card, onClick }) => {
  return (
    card && (
      <Column spacing="s2">
        <Heading>Picked card</Heading>
        <PlayingCard card={card} onClick={onClick} />
      </Column>
    )
  );
};

export default PickedCard;
