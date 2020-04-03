const uuidv4 = require('uuid').v4;

const Cards = require('./cards');

const addCards = (player, cards) => ({
  ...player,
  cards: cards.map((card, idx) => ({
    ...card,
    metadata: {
      isBeingWatched: false,
      playerId: null,
      cardSpot: `player${player.id}_${idx}`
    }
  }))
});

const addCard = (player, cardToAdd, cardIndex) => {
  const { cards } = player;
  const cardSpot = typeof cardIndex !== 'undefined' ? cardIndex : cards.indexOf(null);
  const newCards =
    cardSpot === -1
      ? [
          ...cards,
          {
            ...cardToAdd,
            metadata: {
              isBeingWatched: false,
              playerId: null,
              cardSpot: `player${player.id}_${cards.length}`
            }
          }
        ]
      : cards.map((card, idx) =>
          idx === cardSpot
            ? {
                ...cardToAdd,
                metadata: {
                  isBeingWatched: false,
                  playerId: null,
                  cardSpot: `player${player.id}_${cardSpot}`
                }
              }
            : card
        );

  return {
    ...player,
    cards: newCards
  };
};

const calcScores = (player, isFirstToFinish = false, hasCaracoleSucceed) => {
  let score = Cards.calcScore(player.cards);
  if (isFirstToFinish) {
    score = -5;
  }
  if (hasCaracoleSucceed === false) {
    score = 21;
  }
  if (hasCaracoleSucceed === true) {
    score = -21;
  }
  return {
    ...player,
    scores: [...player.scores, score]
  };
};

const create = name => ({
  cards: [],
  hasDiscoveredHisCards: false,
  id: uuidv4(),
  isDealer: false, // The player who distribute the cards
  isReady: false, // Is ready to start a game
  isWatching: false, // Is the user watching a card (useful to know when he's done)
  name,
  order: 0, // The order the players play
  scores: [], // Score of each set,
  tmpCard: null // Card the player pick from discard pile or draw pile
});

const isDone = player => player.cards.every(card => card === null);

const removeCard = (player, card) => ({
  ...player,
  cards: player.cards.map((c, idx) => (idx !== card.index ? c : null))
});

const replaceCard = (player, cardToReplace) => {
  const { cards, tmpCard } = player;
  return {
    ...player,
    tmpCard: null,
    cards: cards.map((card, index) =>
      index === cardToReplace.index
        ? {
            ...tmpCard,
            metadata: {
              isBeingWatched: false,
              playerId: null,
              cardSpot: `player${player.id}_${index}`
            }
          }
        : card
    )
  };
};

const setCardIsBeingWatched = (player, cardBeingWatched, playerId) => ({
  ...player,
  cards: player.cards.map((card, idx) =>
    idx === cardBeingWatched.index
      ? {
          ...card,
          metadata: {
            isBeingWatched: playerId ? true : false,
            playerId,
            cardSpot: `player${player.id}_${cardBeingWatched.index}`
          }
        }
      : card
  )
});

const setHasDiscoveredHisCards = player => ({
  ...player,
  hasDiscoveredHisCards: true
});

const setIsReady = (player, isReady = true) => ({
  ...player,
  isReady
});

const setIsWatching = (player, isWatching = false) => ({
  ...player,
  isWatching
});

const setTmpCard = (player, tmpCard) => ({
  ...player,
  tmpCard: tmpCard
    ? {
        ...tmpCard,
        metadata: {
          isBeingWatched: false,
          playerId: player.id,
          cardSpot: 'picked-card'
        }
      }
    : null
});

module.exports = {
  addCard,
  addCards,
  calcScores,
  create,
  isDone,
  removeCard,
  replaceCard,
  setCardIsBeingWatched,
  setHasDiscoveredHisCards,
  setIsReady,
  setIsWatching,
  setTmpCard
};
