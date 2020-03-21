import React, { Fragment } from 'react';

import { Row } from '../../layout';
import CardSpot from '../../CardSpot';
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
              // TEMP: keep cards visibile to ease debugging
              <div style={{ opacity: 0.15 }}>
                <PlayingCard
                  card={card}
                  isSelected={selectedCards[cardPlayerId] === cardIndex}
                  onClick={() => onCardPick(cardIndex, cardPlayerId)}
                />
              </div>
            )}
          </Fragment>
        ) : (
          <CardSpot label="No Card" />
        )
      )}
    </Row>
  );
};

export default PlayerCards;
