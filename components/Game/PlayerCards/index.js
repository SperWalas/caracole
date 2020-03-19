import React, { Fragment } from 'react';

import { Row } from '../../layout';
import PlayingCard from '../../PlayingCard';

const PlayerCards = ({
  cardPlayerId,
  cards,
  onCardHide,
  onCardPick,
  selectedCards,
  unfoldedCards
}) => {
  return (
    <Row spacing="s1_5">
      {cards.map((card, cardIndex) =>
        card ? (
          <Fragment key={cardIndex}>
            {unfoldedCards[cardPlayerId] && unfoldedCards[cardPlayerId][cardIndex] ? (
              <PlayingCard card={card} onClick={() => onCardHide(cardIndex, cardPlayerId)} />
            ) : (
              <PlayingCard
                card={card}
                isHidden
                isSelected={selectedCards[cardPlayerId] === cardIndex}
                onClick={() => onCardPick(cardIndex, cardPlayerId)}
              />
            )}
          </Fragment>
        ) : // TODO Render empty spot
        null
      )}
    </Row>
  );
};

export default PlayerCards;
