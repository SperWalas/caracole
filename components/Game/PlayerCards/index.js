import React from 'react';

import useCardSpots, { getPlayerCardSpotId } from '../../../hooks/useCardSpots';
import CardSpot from '../../CardSpot';
import { Row } from '../../layout';
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
  const { setCardSpotRef } = useCardSpots();

  return (
    <Row spacing="s1_5">
      {cards.map((card, cardIndex) => (
        <div key={cardIndex} ref={setCardSpotRef(getPlayerCardSpotId(cardPlayerId, cardIndex))}>
          {card ? (
            <CardWrapper>
              {(unfoldedCards[cardPlayerId] && unfoldedCards[cardPlayerId][cardIndex]) ||
              shouldRevealAllCards ? (
                <PlayingCard card={card} onClick={() => onCardHide(cardIndex, cardPlayerId)} />
              ) : (
                <>
                  {card.metadata.isBeingWatched && <CardInfo>Being watched</CardInfo>}
                  <CardSpot
                    style={{ opacity: 0 }}
                    onClick={() => onCardPick(cardIndex, cardPlayerId)}
                  />
                </>
              )}
            </CardWrapper>
          ) : (
            <CardSpot label="No Card" />
          )}
        </div>
      ))}
    </Row>
  );
};

export default PlayerCards;
