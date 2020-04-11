const Cards = require('./cards');
const Player = require('./player');

// Create a players object
const add = (playersCollection, newPlayer) => ({
  ...playersCollection,
  [newPlayer.id]: {
    ...newPlayer,
    order: Object.keys(playersCollection).length // Define plays order
  }
});

const areAllReady = playersCollection => {
  const players = Object.values(playersCollection);
  return players.every(p => p.isReady);
};

const calcScores = (playersCollection, caracolePlayer) => {
  const players = Object.values(playersCollection);

  // Check here if player has caracole if it has lower than other
  const haveSucceedCaracole = ({ id: playerId, cards }) => {
    // Check only for the player who triggers caracole
    if (caracolePlayer && caracolePlayer.id === playerId) {
      const caracolePlayerScore = Cards.calcScore(cards);
      const playerWithSameOrBetterScore = players.find(
        player => player.id !== playerId && Cards.calcScore(player.cards) <= caracolePlayerScore
      );
      return !playerWithSameOrBetterScore;
    }
    return undefined;
  };

  return players.reduce((playersWithScoresUpdated, player) => {
    const isFirstToFinish = !caracolePlayer && Player.isDone(player);
    return {
      ...playersWithScoresUpdated,
      [player.id]: Player.calcScores(player, isFirstToFinish, haveSucceedCaracole(player))
    };
  }, {});
};

const distributeCards = (playersCollection, cards) => {
  const players = Object.values(playersCollection);
  return players.reduce(
    (playersPopulated, player) => ({
      ...playersPopulated,
      [player.id]: {
        ...player,
        cards: cards.filter(card => card.belongsTo === player.id)
      }
    }),
    {}
  );
};

const getCount = playersCollection => Object.keys(playersCollection).length;

const getByName = (playersCollection, name) => {
  const players = Object.values(playersCollection);
  return players.find(p => p.name === name);
};

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
  return players[idx];
};

const hasAllDiscoveredHisCards = playersCollection => {
  const players = Object.values(playersCollection);
  return players.every(p => p.hasDiscoveredHisCards);
};

const setAllIsReady = (playersCollection, isReady = true) => {
  const players = Object.values(playersCollection);
  return players.reduce(
    (playersUpdated, player) => ({
      ...playersUpdated,
      [player.id]: {
        ...player,
        // Reset has discover if the player is not ready
        hasDiscoveredHisCards: !isReady ? false : player.hasDiscoveredHisCards,
        isReady
      }
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
  areAllReady,
  calcScores,
  distributeCards,
  getByName,
  getCount,
  getDealer,
  getNext,
  getRandom,
  hasAllDiscoveredHisCards,
  setAllIsReady,
  setDealer
};
