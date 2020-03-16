const { NBR_CARDS_TO_DISCOVER } = require('./constants');
const Player = require('./player');

// Create a players object
const add = (playersCollection, newPlayer) => ({
  ...playersCollection,
  [newPlayer.id]: {
    ...newPlayer,
    order: Object.keys(playersCollection).length // Define plays order
  }
});

const areAllDiscoveredHisCards = playersCollection => {
  const players = Object.values(playersCollection);
  return players.every(p => p.nbrCardsDiscovered === NBR_CARDS_TO_DISCOVER);
};

const areAllReady = playersCollection => {
  const players = Object.values(playersCollection);
  return players.every(p => p.isReady);
};

const calcScores = playersCollection => {
  const players = Object.values(playersCollection);
  return players.reduce(
    (playersWithScoresUpdated, player) => ({
      ...playersWithScoresUpdated,
      [player.id]: Player.calcScores(player)
    }),
    {}
  );
};

const distributeCards = (playersCollection, cardsToDistribute) => {
  const nbrPerPlayer = cardsToDistribute.length / getCount(playersCollection);
  const players = Object.values(playersCollection);

  return players.reduce((playersWithCards, player, idx) => {
    const cards = cardsToDistribute.slice(nbrPerPlayer * idx, nbrPerPlayer * (idx + 1));
    return {
      ...playersWithCards,
      [player.id]: Player.addCards(player, cards)
    };
  }, {});
};

const getCount = playersCollection => Object.keys(playersCollection).length;

const getDealer = playersCollection => {
  const players = Object.values(playersCollection);
  return players.find(p => p.isDealer);
};

// Get next player that plays after another
const getNext = (playersCollection, playerBefore) => {
  const players = Object.values(playersCollection);
  return players.find(player => player.order === (playerBefore.order + 1) % players.length);
};

const getRandom = playersCollection => {
  const players = Object.values(playersCollection);
  const idx = Math.floor(Math.random() * players.length);
  console.log({ idx });
  return players[idx];
};

const mask = playersCollection => {
  return Object.keys(playersCollection).reduce((maskedPlayers, id) => {
    const player = playersCollection[id];
    return {
      ...maskedPlayers,
      [player.id]: Player.mask(player)
    };
  }, {});
};

const setAllIsReady = (playersCollection, isReady = true) => {
  const players = Object.values(playersCollection);
  return players.reduce(
    (playersUpdated, player) => ({
      ...playersUpdated,
      [player.id]: Player.setIsReady(player, isReady)
    }),
    {}
  );
};

const setDealer = playersCollection => {
  const players = Object.values(playersCollection);
  // Get previous dealer
  const previousDealer = getDealer(playersCollection);
  // If already a dealer find the next on the order or randomly pick one
  const nextDealer = previousDealer
    ? getNext(playersCollection, previousDealer)
    : getRandom(playersCollection);

  return players.reduce((playersPopulated, player) => {
    return {
      ...playersPopulated,
      [player.id]: {
        ...player,
        isDealer: nextDealer.id === player.id
      }
    };
  }, {});
};

module.exports = {
  add,
  areAllDiscoveredHisCards,
  areAllReady,
  calcScores,
  distributeCards,
  getCount,
  getDealer,
  getNext,
  getRandom,
  mask,
  setAllIsReady,
  setDealer
};
