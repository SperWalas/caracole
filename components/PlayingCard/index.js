import React from 'react';

import useCardActions from '../../hooks/useCardActions';
import useCardSpots, {
  DISCARD_PILE_SPOT_ID,
  DRAW_PILE_SPOT_ID,
  FAILED_CARD_SPOT_ID,
  PICKED_CARD_SPOT_ID
} from '../../hooks/useCardSpots';
import useGame from '../../hooks/useGame';
import { PlayingCardWrapper, PlayingCardInner, StyledEye, StyledImg, FrontCard } from './_styled';

export const DECK_COLOR = 'blue'; // 'blue' | 'red'

const SUIT_LETTER = {
  clubs: 'C',
  diamonds: 'D',
  hearts: 'H',
  spades: 'S'
};

const PlayingCard = ({ card, className, isRotated = false }) => {
  const { cardSpots } = useCardSpots();
  const { handleCardClick, isSelfToPlay, nextAction } = useCardActions();
  const { game, selectedCards, selfId, unfoldedCards } = useGame();

  const { id, isBeingWatchedBy, suit, value } = card;
  const suitLetter = SUIT_LETTER[suit];
  const cardId = value === 'Joker' ? 'joker' : `${value}${suitLetter}`;

  const cardSpot = cardSpots[id];
  const isFailedCard = cardSpot === FAILED_CARD_SPOT_ID;
  const isInDiscardPile = cardSpot === DISCARD_PILE_SPOT_ID;
  const isInDrawPile = cardSpot === DRAW_PILE_SPOT_ID;
  const isInSelfPlayersHand = (cardSpot || '').startsWith(`player${selfId}`);
  const isInPlayersHand = (cardSpot || '').startsWith('player');
  const isPickedCard = cardSpot === PICKED_CARD_SPOT_ID;
  const isSelected = !!selectedCards.find(selectedCard => selectedCard.id === id);
  const isUnfolded = !!unfoldedCards.find(unfoldedCard => unfoldedCard.id === id);

  const isCardVisible =
    ((isInDiscardPile || isUnfolded || isFailedCard) && !isInDrawPile && !isPickedCard) ||
    (isSelfToPlay && isPickedCard) ||
    (!game.isReady && isInPlayersHand);

  const canDiscover =
    !game.isStarted && (cardSpot === `player${selfId}_1` || cardSpot === `player${selfId}_3`);
  const canGive = isSelfToPlay && nextAction === 'give' && isInSelfPlayersHand;
  const canPick =
    (isSelfToPlay && nextAction === 'pick' && (isInDiscardPile || isInDrawPile)) ||
    (isSelfToPlay && nextAction === 'pickFailed' && isFailedCard) ||
    (isSelfToPlay && nextAction === 'pickDrawAfterFail' && isInDrawPile);
  const canSelect =
    isSelfToPlay && (nextAction === 'exchange' || nextAction === 'swap') && isInPlayersHand;
  const canThrow =
    (game.isStarted && !isSelfToPlay && isInPlayersHand) ||
    (isSelfToPlay && nextAction === 'throw' && (isPickedCard || isInSelfPlayersHand)) ||
    (isSelfToPlay && nextAction === 'pick' && isInPlayersHand);
  // TODO: allow watch the top card of the draw pile
  const canWatch = isSelfToPlay && nextAction === 'watch' && isInPlayersHand;

  const canPlay = canDiscover || canGive || canPick || canSelect || canThrow || canWatch;

  return (
    <PlayingCardWrapper
      className={className}
      isRotated={isRotated}
      isSelected={isSelected}
      isFailedCard={isFailedCard}
      {...(canPlay ? { onClick: () => handleCardClick(card) } : {})}
    >
      <PlayingCardInner isHidden={!isCardVisible}>
        {isBeingWatchedBy && isBeingWatchedBy !== selfId && <StyledEye src={'/assets/eye.svg'} />}
        <StyledImg src={`/cards/${DECK_COLOR}_back.svg`} />
        <FrontCard src={`/cards/${cardId}.svg`} />
      </PlayingCardInner>
    </PlayingCardWrapper>
  );
};

export default PlayingCard;
