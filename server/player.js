const uuidv4 = require('uuid').v4;

const Cards = require('./cards');

const addCards = (player, cards) => ({
  ...player,
  cards
});

const addCard = (player, cardToAdd) => {
  const { cards } = player;
  const emptyCardSpot = cards.indexOf(null);
  const newCards =
    emptyCardSpot === -1
      ? [...cards, cardToAdd]
      : cards.map((card, idx) => (idx === emptyCardSpot ? cardToAdd : card));

  return {
    ...player,
    cards: newCards
  };
};

const create = name => ({
  cards: [],
  hasDiscoveredHisCards: false,
  id: uuidv4(),
  isDealer: false, // The player who distribute the cards
  isReady: false, // Is ready to start a game
  isWatching: null, // What card the user watching (useful in front) { playerId: String, cardIndex: number }
  name,
  order: 0, // The order the players play
  scores: [], // Score of each set,
  tmpCard: null // Card the player pick (discard or draw pile)
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
    cards: cards.map((card, index) => (index === cardToReplace.index ? tmpCard : card))
  };
};

const setHasDiscoveredHisCards = player => ({
  ...player,
  hasDiscoveredHisCards: true
});

const setIsReady = (player, isReady = true) => ({
  ...player,
  isReady
});

const setIsWatching = (player, card = null) => ({
  ...player,
  isWatching: card
});

const setScore = (player, isFirstToFinish = false) => ({
  ...player,
  scores: [...player.scores, isFirstToFinish ? -5 : Cards.calcScore(player.cards)]
});

const setTmpCard = (player, tmpCard) => ({
  ...player,
  tmpCard
});

module.exports = {
  addCard,
  addCards,
  create,
  isDone,
  removeCard,
  replaceCard,
  setHasDiscoveredHisCards,
  setIsReady,
  setIsWatching,
  setScore,
  setTmpCard
};
