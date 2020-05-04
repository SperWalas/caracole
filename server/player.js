const uuidv4 = require('uuid').v4;

const Cards = require('./cards');

const addCard = (player, cardToAdd) => {
  const { cards, id } = player;
  let playerSpotIndex = null;
  let idx = 0;

  while (playerSpotIndex === null) {
    if (!cards.find(card => card.spot === `player${id}_${idx}`)) {
      playerSpotIndex = idx;
    }
    idx++;
  }

  const newCard = {
    ...cardToAdd,
    spot: `player${id}_${playerSpotIndex}`,
    belongsTo: id,
    playerSpotIndex: playerSpotIndex
  };

  return {
    ...player,
    cards: [newCard, ...cards]
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

const create = (name, isCreator = false) => ({
  cards: [],
  hasDiscoveredHisCards: false,
  id: uuidv4(),
  isCreator,
  isDealer: false, // The player who distribute the cards
  isReady: false, // Is ready to start a game
  name,
  order: 0, // The order the players play
  scores: [] // Score of each set,
});

const isDone = player => !player.cards.length;

const removeCard = (player, cardId) => {
  return {
    ...player,
    cards: player.cards.filter(card => card.id !== cardId)
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

module.exports = {
  addCard,
  calcScores,
  create,
  isDone,
  removeCard,
  setHasDiscoveredHisCards,
  setIsReady
};
