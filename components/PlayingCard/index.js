import React from 'react';

import useCardActions from '../../hooks/useCardActions';
import useCardSpots, {
  DISCARD_PILE_SPOT_ID,
  DRAW_PILE_SPOT_ID,
  FAILED_CARD_SPOT_ID,
  PICKED_CARD_SPOT_ID
} from '../../hooks/useCardSpots';
import useGame from '../../hooks/useGame';
import { PlayingCardWrapper, PlayingCardInner, StyledImg, FrontCard } from './_styled';

export const DECK_COLOR = 'blue'; // 'blue' | 'red'

const SUIT_LETTER = {
  clubs: 'C',
  diamonds: 'D',
  hearts: 'H',
  spades: 'S'
};

const PlayingCard = ({ card, className }) => {
  const { cardSpots } = useCardSpots();
  const { handleCardClick, isSelfToPlay } = useCardActions();
  const { game, selectedCards, unfoldedCards } = useGame();

  const { id, suit, value } = card;
  const suitLetter = SUIT_LETTER[suit];
  const cardId = value === 'Joker' ? 'joker' : `${value}${suitLetter}`;

  const cardSpot = cardSpots[id];
  const isFailedCard = cardSpot === FAILED_CARD_SPOT_ID;
  const isInDiscardPile = cardSpot === DISCARD_PILE_SPOT_ID;
  const isInDrawPile = cardSpot === DRAW_PILE_SPOT_ID;
  const isPickedCard = cardSpot === PICKED_CARD_SPOT_ID;
  const isSelected = !!selectedCards.find(selectedCard => selectedCard.id === id);
  const isUnfolded = !!unfoldedCards.find(unfoldedCard => unfoldedCard.id === id);

  const isCardVisible =
    ((isInDiscardPile || isUnfolded || isFailedCard) && !isInDrawPile && !isPickedCard) ||
    (isSelfToPlay && isPickedCard);
  const canPlay =
    (isSelfToPlay && game.isStarted) || (!isInDiscardPile && !isInDrawPile && !isFailedCard);

  return (
    <PlayingCardWrapper className={className}>
      <PlayingCardInner
        isFailed={isFailedCard}
        isHidden={!isCardVisible}
        isPicked={isPickedCard}
        isSelected={isSelected}
        {...(canPlay ? { onClick: () => handleCardClick(card) } : {})}
      >
        <StyledImg src={`/cards/${DECK_COLOR}_back.svg`} />
        <FrontCard src={`/cards/${cardId}.svg`} />
      </PlayingCardInner>
    </PlayingCardWrapper>
  );
};

export default PlayingCard;
