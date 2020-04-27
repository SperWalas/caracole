const uuidv4 = require('uuid').v4;

const Cards = require('./cards');
const Player = require('./player');
const Players = require('./players');

const addCardToPlayer = (game, playerId, cardId) => {
  const { cards, nextActions: oldActions, players } = game;
  const card = cards.find(card => card.id === cardId);
  const player = players[playerId];

  // Find next available spot to put the card in player's hand
  let playerSpotIndex = null;
  let idx = 0;

  while (playerSpotIndex === null) {
    if (!cards.find(card => card.spot === `player${playerId}_${idx}`)) {
      playerSpotIndex = idx;
    }
    idx++;
  }

  const cardToAdd = {
    ...card,
    spot: `player${playerId}_${playerSpotIndex}`,
    belongsTo: playerId,
    playerSpotIndex: playerSpotIndex
  };

  return {
    ...game,
    nextActions: oldActions.slice(1),
    cards: cards.map(card => (cardId === card.id ? cardToAdd : card)),
    players: {
      ...players,
      [player.id]: Player.addCard(player, cardToAdd)
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

const create = name => ({
  caracolePlayer: null, // player that triggers caracole
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
  const { players: playersCollection, caracolePlayer } = game;
  // Calc scores
  const playersCollectionWithScoresUpdated = Players.calcScores(playersCollection, caracolePlayer);
  // Reset isReady status to false for all players
  const playersCollectionHasUnready = Players.setAllIsReady(
    playersCollectionWithScoresUpdated,
    false
  );

  return {
    ...game,
    caracolePlayer: null,
    isReady: false,
    isStarted: false,
    nextActions: [],
    players: playersCollectionHasUnready
  };
};

const getPlayerByName = (game, playerName) => {
  const { players } = game;
  return Players.getByName(players, playerName);
};

const isCardCanBeThrown = (game, cardId) => {
  // Get the last card on the discardPile
  const lastCard = game.discardPile.slice(-1); // THIS CAN BE EMPTY !!
  const cardThrown = game.cards.find(card => card.id === cardId);
  return lastCard.length && cardThrown.value === lastCard[0].value;
};

const isDone = game => {
  const { caracolePlayer, players: playersCollection, nextActions } = game;

  const [nextAction] = nextActions;

  if (nextAction.action === 'give') {
    return false;
  }

  // If final round after calling caracol is done, game's end
  if (
    caracolePlayer &&
    nextAction.player.id === caracolePlayer.id &&
    nextAction.action === 'pick'
  ) {
    return true;
  }
  // If someone doesn't have cards anymore
  const players = Object.values(playersCollection);
  return players.find(Player.isDone);
};

const givePlayerCard = (game, playerId, cardId) => {
  const { nextActions: oldActions, players } = game;
  // Find to whom player should give
  const [{ playerToAddACard }] = oldActions;
  // Add card to player
  const newGame = addCardToPlayer(game, playerToAddACard.id, cardId);
  const playerToRemoveACard = players[playerId];

  return {
    ...newGame,
    players: {
      ...newGame.players,
      [playerToRemoveACard.id]: Player.removeCard(playerToRemoveACard, cardId)
    }
  };
};

const removeDiscardCard = game => {
  return {
    ...game,
    discardPile: game.discardPile.slice(0, -1)
  };
};

const removeDrawCard = game => {
  let { cards, discardPile, drawPile } = game;

  // Verify there are still cards in the draw pile
  drawPile = drawPile.slice(1);
  if (!drawPile.length) {
    discardPile = game.discardPile.slice(-1);
    drawPile = Cards.shuffleDeck(game.discardPile.slice(0, -1));
  }

  return {
    ...game,
    cards: cards.map(card => {
      // Reset discard pile
      if (discardPile.find(discardCard => discardCard.id === card.id)) {
        return { ...card, spot: 'discard-pile' };
      }
      // Reset draw pile
      if (drawPile.find(drawCard => drawCard.id === card.id)) {
        return { ...card, spot: 'draw-pile' };
      }
      return card;
    }),
    discardPile,
    drawPile
  };
};

const reset = game => {
  return {
    ...create(game.name),
    id: game.id,
    players: Players.reset(game.players)
  };
};

const setCaracolePlayer = (game, playerId) => {
  const { players } = game;

  // Get next player to pick
  const playerThatCaracole = players[playerId];
  const nextPlayer = Players.getNext(players, playerThatCaracole);

  return {
    ...game,
    nextActions: [{ player: nextPlayer, action: 'pick' }],
    caracolePlayer: players[playerId]
  };
};

const setCardIsBeingWatchedBy = (game, playerId, cardId) => {
  const { cards } = game;

  return {
    ...game,
    cards: cards.map(card => (card.id === cardId ? { ...card, isBeingWatchedBy: playerId } : card))
  };
};

const setCardToDiscardPile = (game, playerId, cardId) => {
  let { cards, discardPile, nextActions: oldActions, players: playersCollection } = game;
  const cardToThrow = cards.find(card => card.id === cardId);

  let player = playersCollection[cardToThrow.belongsTo];
  let playerThrowing = playersCollection[playerId];
  let nextActions = [];

  player = Player.removeCard(player, cardId);

  // TODO: The order of Q matter? (if multiple player put a Q)
  if (cardToThrow.value === 'Q') {
    nextActions = [{ player: playerThrowing, action: 'watch' }, ...nextActions];
  }
  if (cardToThrow.value === 'Joker') {
    // Create action to swipe a card
    nextActions = [{ player: playerThrowing, action: 'swap' }, ...nextActions];
  }
  if (cardToThrow.value === 'J') {
    // Create action to swipe a card
    nextActions = [{ player: playerThrowing, action: 'exchange' }, ...nextActions];
  }

  // When player have to give a card to an other player
  // This action should be the next in the queue
  if (cardToThrow.belongsTo !== playerId) {
    nextActions = [
      { player: playerThrowing, action: 'give', playerToAddACard: player },
      ...nextActions
    ];
  }

  return {
    ...game,
    cards: cards.map(card => {
      if (card.id === cardToThrow.id) {
        return {
          ...card,
          belongsTo: null,
          playerSpotIndex: null,
          spot: 'discard-pile'
        };
      }
      return card;
    }),
    nextActions: [...nextActions, ...oldActions],
    discardPile: [...discardPile, cardToThrow],
    players: {
      ...playersCollection,
      [player.id]: player
    }
  };
};

const setCardToDiscardPileAndReplaceByPickedCard = (game, playerId, cardId) => {
  let { cards, discardPile, drawPile, nextActions: oldActions, players: playersCollection } = game;
  const cardToThrow = cards.find(card => card.id === cardId);
  const pickedCard = cards.find(card => card.spot === 'picked-card');
  let player = playersCollection[playerId];
  let nextActions = [];

  // Add picked card to player
  player = Player.removeCard(player, cardToThrow.id);
  player = Player.addCard(player, pickedCard);
  // Remove action of throw
  oldActions = oldActions.slice(1);
  // Get next player to pick
  const nextPlayer = Players.getNext(playersCollection, player);
  nextActions = [{ player: nextPlayer, action: 'pick' }];

  // TODO: The order of Q matter? (if multiple player put a Q)
  if (cardToThrow.value === 'Q') {
    nextActions = [{ player, action: 'watch' }, ...nextActions];
  }
  if (cardToThrow.value === 'Joker') {
    // Create action to swipe a card
    nextActions = [{ player, action: 'swap' }, ...nextActions];
  }
  if (cardToThrow.value === 'J') {
    // Create action to swipe a card
    nextActions = [{ player, action: 'exchange' }, ...nextActions];
  }

  return {
    ...game,
    cards: cards.map(card => {
      if (card.id === pickedCard.id) {
        return {
          ...card,
          belongsTo: cardToThrow.belongsTo,
          playerSpotIndex: cardToThrow.playerSpotIndex,
          spot: cardToThrow.spot
        };
      }
      if (card.id === cardToThrow.id) {
        return {
          ...card,
          belongsTo: null,
          playerSpotIndex: null,
          spot: 'discard-pile'
        };
      }
      return card;
    }),
    nextActions: [...nextActions, ...oldActions],
    discardPile: [...discardPile.filter(c => c.id !== pickedCard.id), cardToThrow],
    drawPile: drawPile.filter(c => c.id !== pickedCard.id),
    players: {
      ...playersCollection,
      [player.id]: player
    }
  };
};

const setDiscardCardAsPickedCard = (game, playerId, cardId) => {
  const { players, nextActions: oldActions } = game;
  const player = players[playerId];

  // Next action: Player should throw a card
  const nextAction = { player, action: 'throw' };
  const updateGame = removeDiscardCard(game);

  return {
    ...updateGame,
    cards: updateGame.cards.map(card =>
      card.id === cardId ? { ...card, spot: 'picked-card' } : card
    ),
    nextActions: [nextAction, ...oldActions.slice(1)]
  };
};

const setDrawCardAsPickedCard = (game, playerId, cardId) => {
  const { players, nextActions: oldActions } = game;
  const player = players[playerId];

  // Next action: Player should throw a card
  const nextAction = { player, action: 'throw' };
  const updateGame = removeDrawCard(game);

  return {
    ...updateGame,
    cards: updateGame.cards.map(card =>
      card.id === cardId ? { ...card, spot: 'picked-card' } : card
    ),
    nextActions: [nextAction, ...oldActions.slice(1)]
  };
};

const setDrawCardToPlayer = (game, playerId) => {
  const { drawPile } = game;
  // Add card from the draw pile to player
  const [cardToAdd] = drawPile;
  game = removeDrawCard(game);

  return addCardToPlayer(game, playerId, cardToAdd.id);
};

const setCardAsFailedCard = (game, playerId, cardId) => {
  const { cards, players, nextActions: oldActions } = game;
  const player = players[playerId];
  const cardPlayer = cards.find(c => c.id === cardId);

  // Next action: Player should get his card back
  const nextActions = [
    {
      player: players[cardPlayer.belongsTo],
      action: 'pickFailed'
    },
    {
      player,
      action: 'pickDrawAfterFail'
    }
  ];

  return {
    ...game,
    cards: cards.map(card =>
      card.id === cardId ? { ...card, spot: 'failed-card', oldSpot: card.spot } : card
    ),
    nextActions: [...nextActions, ...oldActions]
  };
};

const setFailedCardToPlayer = game => {
  const { cards, nextActions: oldActions } = game;

  return {
    ...game,
    cards: cards.map(card =>
      card.spot === 'failed-card' ? { ...card, spot: card.oldSpot } : card
    ),
    nextActions: oldActions.slice(1)
  };
};

const setPickedCardToDiscardPile = (game, playerId) => {
  const { cards, discardPile, drawPile, nextActions: oldActions, players } = game;
  // Get player tmp card
  let pickedCard = cards.find(card => card.spot === 'picked-card');
  let player = players[playerId];
  let nextActions = [];

  const isPickedFromDiscard = !!discardPile.find(c => c.id === pickedCard.id);

  if (!isPickedFromDiscard) {
    if (pickedCard.value === 'Q') {
      // Define action if the card is special
      // TODO: The order of Q matter? (if multiple player put a Q)
      nextActions = [{ player, action: 'watch' }];
    }
    if (pickedCard.value === 'Joker') {
      // Create action to swipe a card
      nextActions = [{ player, action: 'swap' }, ...nextActions];
    }
    if (pickedCard.value === 'J') {
      // Create action to swipe a card
      nextActions = [{ player, action: 'exchange' }, ...nextActions];
    }
  }

  // Find next action
  const nextPlayer = Players.getNext(players, player);
  nextActions = [...nextActions, { player: nextPlayer, action: 'pick' }];

  return {
    ...game,
    cards: cards.map(card =>
      card.spot === 'picked-card' ? { ...card, spot: 'discard-pile' } : card
    ),
    discardPile: [...discardPile.filter(c => c.id !== pickedCard.id), pickedCard],
    drawPile: drawPile.filter(c => c.id !== pickedCard.id),
    nextActions: [...nextActions, ...oldActions.slice(1)]
  };
};

const setPlayerHasDiscoveredHisCards = (game, playerId) => {
  let { players } = game;
  let nextActions = [];
  let player = players[playerId];
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
    nextActions = [{ player: nextPlayer, action: 'pick' }];
  }

  return {
    ...game,
    isStarted: shouldStart,
    nextActions,
    players
  };
};

const setPlayerHasWatched = game => {
  const { cards, nextActions: oldActions } = game;

  return {
    ...game,
    cards: cards.map(card => ({ ...card, isBeingWatchedBy: null })), // no card is being watched anymore
    nextActions: [...oldActions.slice(1)] // Remove last action
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

const setup = game => {
  const { players: playersCollection } = game;

  // Generate cards
  const nbrOfPlayers = Players.getCount(playersCollection);
  const nbrCardsPerPlayer = nbrOfPlayers > 5 ? 6 : 4;
  const nbrCardsForPlayers = nbrOfPlayers * nbrCardsPerPlayer;
  const cards = Cards.getDeck(nbrOfPlayers > 2); // Joker only for 3+ players
  const deck =
    nbrOfPlayers > 5
      ? cards.concat(cards) // Two pack for +6 players
      : cards;

  const shuffledDeck = Cards.shuffleDeck(deck);
  const populatedShuffledDeck = shuffledDeck.map((card, idx) => {
    // Cards of players
    if (idx < nbrCardsForPlayers) {
      const players = Object.values(playersCollection);
      const playerIdx = idx % nbrOfPlayers;
      const player = players[playerIdx];
      const cardIdx = Math.floor(idx / nbrOfPlayers);

      return {
        ...card,
        belongsTo: player.id,
        isBeingWatchedBy: null,
        playerSpotIndex: cardIdx,
        spot: `player${player.id}_${cardIdx}`
      };
    }

    // Cards in discard pile
    if (idx === nbrCardsForPlayers) {
      return {
        ...card,
        belongsTo: null,
        isBeingWatchedBy: null,
        playerSpotIndex: null,
        spot: 'discard-pile'
      };
    }

    // Cards in draw pile
    return {
      ...card,
      belongsTo: null,
      isBeingWatchedBy: null,
      playerSpotIndex: null,
      spot: 'draw-pile'
    };
  });

  // First card to be discovered
  const discardPile = populatedShuffledDeck.filter(card => card.spot === 'discard-pile');
  const drawPile = populatedShuffledDeck.filter(card => card.spot === 'draw-pile');

  // Set dealer
  const playersCollectionWithDealer = Players.setDealer(playersCollection);
  // Give card to players
  const playersCollectionWithCards = Players.distributeCards(
    playersCollectionWithDealer,
    populatedShuffledDeck
  );

  return {
    ...game,
    cards: populatedShuffledDeck,
    discardPile,
    drawPile,
    isReady: true,
    isStarted: false,
    players: playersCollectionWithCards
  };
};

const swapPlayersCards = (game, cardIdsToSwap) => {
  const { cards, nextActions: oldActions, players } = game;

  const [card1Id, card2Id] = cardIdsToSwap;

  const cardFromPlayer1 = cards.find(card => card.id === card1Id);
  const cardFromPlayer2 = cards.find(card => card.id === card2Id);

  const cardForPlayer1 = {
    ...cardFromPlayer2,
    belongsTo: cardFromPlayer1.belongsTo,
    playerSpotIndex: cardFromPlayer1.playerSpotIndex,
    spot: cardFromPlayer1.spot
  };
  const cardForPlayer2 = {
    ...cardFromPlayer1,
    belongsTo: cardFromPlayer2.belongsTo,
    playerSpotIndex: cardFromPlayer2.playerSpotIndex,
    spot: cardFromPlayer2.spot
  };

  let player1 = players[cardForPlayer1.belongsTo];
  player1 = Player.removeCard(player1, cardFromPlayer1.id);
  player1 = Player.addCard(player1, cardForPlayer1);

  let player2 = players[cardForPlayer2.belongsTo];
  player2 = Player.removeCard(player2, cardFromPlayer2.id);
  player2 = Player.addCard(player2, cardForPlayer2);

  return {
    ...game,
    // Swap position of card
    cards: cards.map(card => {
      if (card.id === cardFromPlayer1.id) {
        return cardForPlayer2;
      }
      if (card.id === cardFromPlayer2.id) {
        return cardForPlayer1;
      }
      return card;
    }),
    nextActions: oldActions.slice(1), // Remove last action
    players: {
      ...players,
      [player1.id]: player1,
      [player2.id]: player2
    }
  };
};

module.exports = {
  addCardToPlayer,
  addPlayer,
  canStart,
  create,
  end,
  getPlayerByName,
  givePlayerCard,
  isCardCanBeThrown,
  isDone,
  removeDiscardCard,
  removeDrawCard,
  reset,
  setCaracolePlayer,
  setCardAsFailedCard,
  setCardIsBeingWatchedBy,
  setCardToDiscardPile,
  setCardToDiscardPileAndReplaceByPickedCard,
  setDiscardCardAsPickedCard,
  setDrawCardAsPickedCard,
  setDrawCardToPlayer,
  setFailedCardToPlayer,
  setPickedCardToDiscardPile,
  setPlayerHasDiscoveredHisCards,
  setPlayerHasWatched,
  setPlayerIsReady,
  setup,
  swapPlayersCards
};
