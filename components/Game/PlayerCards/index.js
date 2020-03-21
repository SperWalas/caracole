import React from 'react';

import { Row } from '../../layout';
import CardSpot from '../../CardSpot';
import PlayingCard from '../../PlayingCard';

import { CardInfo, CardWrapper } from './_styled';

const PlayerCards = ({
  cardBeingWatched,
  cardPlayerId,
  cards,
  onCardHide,
  onCardPick,
  selectedCards,
  unfoldedCards
}) => {
  const isCardBeingWatched = cardIndex => {
    return (
      cardBeingWatched &&
      cardBeingWatched.index === cardIndex &&
      cardBeingWatched.cardPlayerId === cardPlayerId
    );
  };

  return (
    <Row spacing="s1_5">
      {cards.map((card, cardIndex) =>
        card ? (
          <CardWrapper key={cardIndex}>
            {unfoldedCards[cardPlayerId] && unfoldedCards[cardPlayerId][cardIndex] ? (
              <PlayingCard card={card} onClick={() => onCardHide(cardIndex, cardPlayerId)} />
            ) : (
              // TEMP: keep cards visibile to ease debugging
              <div style={{ opacity: 0.15 }}>
                {isCardBeingWatched(cardIndex) && (
                  <CardInfo>{cardBeingWatched.player.name} is watching</CardInfo>
                )}
                <PlayingCard
                  card={card}
                  isSelected={selectedCards[cardPlayerId] === cardIndex}
                  onClick={() => onCardPick(cardIndex, cardPlayerId)}
                />
              </div>
            )}
          </CardWrapper>
        ) : (
          <CardSpot label="No Card" />
        )
      )}
    </Row>
  );
};

export default PlayerCards;
