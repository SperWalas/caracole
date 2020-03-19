const uuidv4 = require('uuid').v4;

const Cards = require('./cards');
const Player = require('./player');
const Players = require('./players');

const addCardToPlayer = (game, playerId, card) => {
  const { players } = game;
  const player = players[playerId];

  return {
    ...game,
    players: {
      ...players,
      [player.id]: Player.addCard(player, card)
    }
  };
};

const addPlayer = (game, player) => {
  const { players } = game;
  const nbrOfPlayers = Players.getCount(players);
  return {
    ...game,
    players: {
      ...players,
      [player.id]: {
        ...player,
        order: nbrOfPlayers // Define plays order
      }
    }
  };
};

const setPlayerTmpCard = (game, playerId, card) => {
  console.log('setPlayerTmpCard', { playerId, card });
  const { players, nextActions: oldActions } = game;
  const player = players[playerId];

  // Next action: Player should throw a card
  const nextAction = { playerId, action: 'throw' };

  return {
    ...game,
    nextActions: [nextAction, ...oldActions.slice(1)],
    players: {
      ...players,
      [player.id]: Player.setTmpCard(player, card)
    }
  };
};

const create = name => ({
  cards: null, // Just to keep the generated deck somewhere
  discardPile: null, // Trash card pile
  drawPile: null, // Draw card pile
  id: uuidv4(),
  isReady: false, // Ready when all players are ready
  isStarted: false, // Started when all players have watched his cards
  name,
  nextActions: [], // Next play in the game { playerId: String, action: String }
  players: {}
});

const canStart = game => {
  const { players: playersCollection } = game;
  return Players.areAllReady(playersCollection) && Players.getCount(playersCollection) > 1;
};

const end = game => {
  console.log('end');
  const { players: playersCollection } = game;
  // Calc scores
  const playersCollectionWithScoresUpdated = Players.calcScores(playersCollection);
  // Reset isReady status to false for all players
  const playersCollectionHasUnready = Players.setAllIsReady(
    playersCollectionWithScoresUpdated,
    false
  );

  return {
    ...game,
    isStarted: false,
    nextActions: [],
    players: playersCollectionHasUnready
  };
};

const getPlayerByName = (game, playerName) => {
  const { players } = game;
  return Players.getByName(players, playerName);
};

const getCard = (game, card) => {
  // Get the card to throw
  const { players } = game;
  return players[card.playerId].cards[card.index];
};

const isCardCanBeThrown = (game, card) => {
  // Get the last card on the discardPile
  const lastCard = game.discardPile.slice(-1); // THIS CAN BE EMPTY !!
  const cardThrown = getCard(game, card);
  return lastCard.length && cardThrown.value === lastCard[0].value;
};

const isDone = game => {
  const { players: playersCollection } = game;
  const players = Object.values(playersCollection);
  return players.find(Player.isDone);
};

const givePlayerCard = (game, playerId, card) => {
  console.log('givePlayerCard', { playerId, card });
  const { nextActions: oldActions, players } = game;
  // Get card
  const cardToGive = getCard(game, card);
  // Find to whom player should give
  const [{ playerIdToGiveTo }] = oldActions;
  const playerToAddACard = players[playerIdToGiveTo];
  const playerToRemoveACard = players[playerId];

  return {
    ...game,
    nextActions: oldActions.slice(1),
    players: {
      ...players,
      [playerToAddACard.id]: Player.addCard(playerToAddACard, cardToGive),
      [playerToRemoveACard.id]: Player.removeCard(playerToRemoveACard, card)
    }
  };
};

const removeDiscardCard = game => ({
  ...game,
  discardPile: game.discardPile.slice(0, -1)
});

const removeDrawCard = game => {
  console.log('removeDrawCard');
  let { discardPile, drawPile } = game;

  // Verify there are still cards in the draw pile
  drawPile = drawPile.slice(1);
  if (!drawPile.length) {
    discardPile = game.discardPile.slice(-1);
    drawPile = Cards.shuffleDeck(game.discardPile.slice(0, -1));
  }

  return {
    ...game,
    discardPile,
    drawPile
  };
};

const setCardToDiscardPile = (game, playerId, card) => {
  console.log('setCardToDiscardPile', { playerId, card });

  let { discardPile, nextActions: oldActions, players: playersCollection } = game;
  const cardToThrow = getCard(game, card);
  let player = playersCollection[card.playerId];
  let nextActions = [];

  // If player that throw the card has a tmp card,
  // the tmpCard will replace the thrown card.
  if (playerId === card.playerId && player.tmpCard) {
    player = Player.replaceCard(player, card);
    // Remove action of throw
    oldActions = oldActions.slice(1);
    // Get next player to pick
    const nextPlayer = Players.getNext(playersCollection, player);
    nextActions = [{ playerId: nextPlayer.id, action: 'pick' }];
  }
  // If not, that means a player throw his card not during his turn
  // so we remove the card from his hand
  else {
    player = Player.removeCard(player, card);
  }

  // TODO: The order of Q matter? (if multiple player put a Q)
  if (cardToThrow.value === 'Q') {
    nextActions = [{ playerId, action: 'watch' }, ...nextActions];
  }
  if (cardToThrow.value === 'Joker') {
    // Create action to swipe a card
    nextActions = [{ playerId, action: 'swap' }, ...nextActions];
  }
  if (cardToThrow.value === 'J') {
    // Create action to swipe a card
    nextActions = [{ playerId, action: 'exchange' }, ...nextActions];
  }

  // When player have to give a card to an other player
  // This action should be the next in the queue
  if (playerId !== card.playerId) {
    nextActions = [{ playerId, action: 'give', playerIdToGiveTo: card.playerId }, ...nextActions];
  }

  return {
    ...game,
    nextActions: [...nextActions, ...oldActions],
    discardPile: [...discardPile, { ...cardToThrow, by: playerId }],
    players: {
      ...playersCollection,
      [card.playerId]: player
    }
  };
};

const setTmpCardToDiscardPile = (game, playerId) => {
  console.log('setTmpCardToDiscardPile', {
    playerId
  });
  const { discardPile, nextActions: oldActions, players } = game;
  // Get player tmp card
  let player = players[playerId];
  const { tmpCard } = player;
  let nextActions = [];

  // Define action if the card is special
  // TODO: The order of Q matter? (if multiple player put a Q)
  if (tmpCard.value === 'Q') {
    nextActions = [{ playerId, action: 'watch' }];
  }
  if (tmpCard.value === 'Joker') {
    // Create action to swipe a card
    nextActions = [{ playerId, action: 'swap' }, ...nextActions];
  }
  if (tmpCard.value === 'J') {
    // Create action to swipe a card
    nextActions = [{ playerId, action: 'exchange' }, ...nextActions];
  }

  // Find next action
  const nextPlayer = Players.getNext(players, player);
  nextActions = [...nextActions, { playerId: nextPlayer.id, action: 'pick' }];

  return {
    ...game,
    discardPile: [...discardPile, tmpCard],
    nextActions: [...nextActions, ...oldActions.slice(1)],
    players: {
      ...players,
      [player.id]: Player.setTmpCard(player, null)
    }
  };
};

const setPlayerHasDiscoveredHisCards = (game, playerId) => {
  let { players } = game;
  let nextActions = [];
  let player = players[playerId];
  // Update the player
  player = Player.setHasDiscoveredHisCards(player);
  // Update all players
  players = {
    ...players,
    [playerId]: Player.setHasDiscoveredHisCards(player)
  };
  // Check if game should start
  const shouldStart = Players.hasAllDiscoveredHisCards(players);

  // Find next to play once the
  if (shouldStart) {
    const dealer = Players.getDealer(players);
    const nextPlayer = Players.getNext(players, dealer);
    nextActions = [{ playerId: nextPlayer.id, action: 'pick' }];
  }

  return {
    ...game,
    isStarted: shouldStart,
    nextActions,
    players
  };
};

const setPlayerHasWatched = (game, playerId) => {
  console.log('setPlayerHasWatched', { playerId });
  const { players, nextActions: oldActions } = game;
  // Set player is not looking a card anymore
  let player = players[playerId];
  player = Player.setIsWatching(player, null);

  return {
    ...game,
    nextActions: [...oldActions.slice(1)], // Remove last action, push more if necessary
    players: {
      ...players,
      [playerId]: player
    }
  };
};

const setPlayerIsReady = (game, playerId) => {
  const { players } = game;
  const player = players[playerId];
  return {
    ...game,
    players: {
      ...players,
      [playerId]: Player.setIsReady(player, true)
    }
  };
};

const setPlayerIsWatching = (game, playerId, card) => {
  console.log('setPlayerIsWatching', { playerId, card });
  const { players } = game;
  const player = players[playerId];
  return {
    ...game,
    players: {
      ...players,
      [playerId]: {
        ...player,
        isWatching: card
      }
    }
  };
};

const setup = game => {
  const { players: playersCollection } = game;

  // Set dealer
  const playersCollectionWithDealer = Players.setDealer(playersCollection);

  // Generate cards
  const nbrOfPlayers = Players.getCount(playersCollection);
  const nbrCardsPerPlayer = nbrOfPlayers > 5 ? 6 : 4;
  const nbrCardsForPlayers = nbrOfPlayers * nbrCardsPerPlayer;
  const deckOfCards =
    nbrOfPlayers > 5
      ? Cards.getDeck().concat(Cards.getDeck()) // Two pack for +6 players
      : Cards.getDeck();
  const shuffledDeck = Cards.shuffleDeck(deckOfCards);
  const cardsForPlayers = shuffledDeck.slice(0, nbrCardsForPlayers);
  // First card to be discovered
  const discardPile = shuffledDeck.slice(nbrCardsForPlayers, nbrCardsForPlayers + 1);
  const drawPile = shuffledDeck.slice(nbrCardsForPlayers + 1);

  // Give card to players
  const playersCollectionWithCards = Players.distributeCards(
    playersCollectionWithDealer,
    cardsForPlayers
  );

  return {
    ...game,
    discardPile,
    drawPile,
    isReady: true,
    isStarted: false,
    players: playersCollectionWithCards
  };
};

const swapPlayersCards = (game, cards) => {
  const { players, nextActions: oldActions } = game;

  const [card1, card2] = cards;
  const player1 = players[card1.playerId];
  const player2 = players[card2.playerId];
  const cardForPlayer1 = getCard(game, card2);
  const cardForPlayer2 = getCard(game, card1);

  return {
    ...game,
    nextActions: [...oldActions.slice(1)], // Remove last action, push more if necessary
    players: {
      ...players,
      [player1.id]: Player.addCard(player1, cardForPlayer1, card1.index),
      [player2.id]: Player.addCard(player2, cardForPlayer2, card2.index)
    }
  };
};

module.exports = {
  addCardToPlayer,
  addPlayer,
  canStart,
  create,
  end,
  getCard,
  getPlayerByName,
  givePlayerCard,
  isCardCanBeThrown,
  isDone,
  removeDiscardCard,
  removeDrawCard,
  setCardToDiscardPile,
  setPlayerHasDiscoveredHisCards,
  setPlayerHasWatched,
  setPlayerIsReady,
  setPlayerIsWatching,
  setPlayerTmpCard,
  setTmpCardToDiscardPile,
  setup,
  swapPlayersCards
};
