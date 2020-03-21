import React from 'react';
import { Column } from '../../layout';
import { Subheading } from '../../text';
import PlayingCard from '../../PlayingCard';

const PickedCard = ({ card, onClick }) => {
  return (
    card && (
      <Column spacing="s2">
        <Subheading>Picked card</Subheading>
        <PlayingCard card={card} onClick={onClick} />
      </Column>
    )
  );
};

export default PickedCard;
