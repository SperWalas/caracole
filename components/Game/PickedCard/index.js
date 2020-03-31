import React from 'react';

import PlayingCard from '../../PlayingCard';
import { PickedCardWrapper } from './_styled';

const PickedCard = ({ card, className, onClick }) => {
  return (
    card && (
      <PickedCardWrapper>
        <PlayingCard className={className} card={card} onClick={onClick} />
      </PickedCardWrapper>
    )
  );
};

export default PickedCard;
