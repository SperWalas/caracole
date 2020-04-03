import React from 'react';

import { Row } from '../../layout';
import CardSpot from '../../CardSpot';
import PlayingCard from '../../PlayingCard';

import { CardInfo, CardWrapper } from './_styled';

const PlayerCards = ({
  cardPlayerId,
  cards,
  onCardHide,
  onCardPick,
  selectedCards,
  shouldRevealAllCards,
  unfoldedCards
}) => {
  return (
    <Row spacing="s1_5">
      {cards.map((card, cardIndex) =>
        card ? (
          <CardWrapper key={cardIndex}>
            {(unfoldedCards[cardPlayerId] && unfoldedCards[cardPlayerId][cardIndex]) ||
            shouldRevealAllCards ? (
              <PlayingCard card={card} onClick={() => onCardHide(cardIndex, cardPlayerId)} />
            ) : (
              // TEMP: keep cards visibile to ease debugging
              <div style={{ opacity: 0.15 }}>
                {card.metadata.isBeingWatched && <CardInfo>Being watched</CardInfo>}
                <PlayingCard
                  card={card}
                  isSelected={selectedCards[cardPlayerId] === cardIndex}
                  onClick={() => onCardPick(cardIndex, cardPlayerId)}
                />
              </div>
            )}
          </CardWrapper>
        ) : (
          <CardSpot key={cardIndex} label="No Card" />
        )
      )}
    </Row>
  );
};

export default PlayerCards;
