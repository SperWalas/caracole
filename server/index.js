const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const FakeDB = require('./fakeDB');
const Game = require('./game');
const Player = require('./player');

const port = parseInt(process.env.PORT, 10) || 3500;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const sendGameUpdateToClients = gameId => {
  // Tell everyone a new player comes in
  const game = FakeDB.getGame(gameId);
  io.to(gameId).emit('game.update', game);
};

// socket.io server
io.on('connection', socket => {
  // When a user want to join a game
  socket.on('game.join', ({ gameName, playerName }) => {
    // Get game
    let game = FakeDB.findGameByName(gameName);

    if (game) {
      // Want to join existing game
      // Get player if exist
      let player = Game.getPlayerByName(game, playerName);
      // After game isReady, no new player can join in
      if (game.isReady && !player) {
        socket.emit('errorMessage', 'Game already started.');
        return;
      }
      if (!player) {
        // Add player to the game
        player = Player.create(playerName);
        game = Game.addPlayer(game, player);
        // Save
        FakeDB.saveGame(game);
      }
      // Subscribe to game channel
      socket.join(game.id);
      // Send player id to user
      socket.emit('game.you', player.id);
      sendGameUpdateToClients(game.id);
    } else {
      // Want to create
      game = Game.create(gameName);
      // Add player to the game
      const player = Player.create(playerName, true);
      game = Game.addPlayer(game, player);
      // Save
      FakeDB.saveGame(game);
      // Subscribe to game channel
      socket.join(game.id);
      // Send player id to user
      socket.emit('game.you', player.id);
      sendGameUpdateToClients(game.id);
    }
  });

  socket.on('game.playerGiveCard', ({ gameId, playerId, cardId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    // Give card to someone (playerToAddACard is in the nextActions of the game)
    game = Game.givePlayerCard(game, playerId, cardId);
    // Check if game is done
    if (Game.isDone(game)) {
      game = Game.end(game);
    }
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  // When an player is wathcing a card
  socket.on('game.playerWatchCard', ({ gameId, cardId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    // Set the card is being watched
    game = Game.setCardIsBeingWatchedBy(game, playerId, cardId);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  // When an player confirm he has seen the card
  socket.on('game.playerHasWatchedCard', ({ gameId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    // Set has discover if game is still in discovery mode (beginning of the game)
    game = Game.setPlayerHasWatched(game);
    // Check if game is done (in case someone caracoled and last player watched one of his card)
    if (Game.isDone(game)) {
      game = Game.end(game);
    }
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  // When a player saw his cards at the begin of the game
  socket.on('game.playerHasDiscoveredHisCards', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    // Update player, if all players have seen their cards, start the game
    game = Game.setPlayerHasDiscoveredHisCards(game, playerId);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients that player is looking to a card
    sendGameUpdateToClients(gameId);
  });

  // When a user set itself as ready
  socket.on('game.playerIsReady', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    game = Game.setPlayerIsReady(game, playerId);
    // When all player are ready, start the game
    if (Game.canStart(game)) {
      game = Game.setup(game);
    }
    // Save
    FakeDB.saveGame(game);
    sendGameUpdateToClients(gameId);
  });

  // When a player pick a card in the draw pile
  socket.on('game.playerPickDrawCard', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    const [drawCard] = game.drawPile;
    // game = Game.removeDrawCard(game, drawCard.id);
    game = Game.setDrawCardAsPickedCard(game, playerId, drawCard.id);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  socket.on('game.playerPickDrawCardAfterFail', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    game = Game.setDrawCardToPlayer(game, playerId);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  socket.on('game.playerPickDiscardCard', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    const [discardCard] = game.discardPile.slice(-1);
    game = Game.setDiscardCardAsPickedCard(game, playerId, discardCard.id);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(game.id);
  });

  socket.on('game.playerPickFailedCard', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    game = Game.setFailedCardToPlayer(game, playerId);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  // When an user want to put a card in the discard pile
  socket.on('game.playerThrowCard', ({ gameId, playerId, cardId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    const { nextActions } = game;
    const [currentAction] = nextActions;

    if (currentAction.player.id === playerId && currentAction.action === 'throw') {
      game = Game.setCardToDiscardPileAndReplaceByPickedCard(game, playerId, cardId);
    }
    // If a player throws his or someone's card
    else if (Game.isCardCanBeThrown(game, cardId)) {
      game = Game.setCardToDiscardPile(game, playerId, cardId);
    }
    // Player throws a wrong card
    else {
      // Set the card to be visible by everyone
      game = Game.setCardAsFailedCard(game, playerId, cardId);
    }
    // Check if game is done
    if (Game.isDone(game)) {
      game = Game.end(game);
    }
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  socket.on('game.playerThrowPickedCard', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    // Set tmp card to discardPile
    game = Game.setPickedCardToDiscardPile(game, playerId);
    // Check if game is done
    if (Game.isDone(game)) {
      game = Game.end(game);
    }
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  socket.on('game.playerTriggerCaracole', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    game = Game.setCaracolePlayer(game, playerId);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  socket.on('game.swapCardBetweenPlayer', ({ gameId, cards }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    // Give card to someone (playerToAddACard is in the nextActions of the game)
    game = Game.swapPlayersCards(game, cards);
    // Check if game is done
    if (Game.isDone(game)) {
      game = Game.end(game);
    }
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  socket.on('game.reset', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    if (!game) {
      return;
    }
    if (game.players[playerId].isCreator) {
      game = Game.reset(game);
      // Save
      FakeDB.saveGame(game);
    }
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });
});

nextApp.prepare().then(() => {
  app.get('/:gameName', (req, res) => {
    return nextApp.render(req, res, '/index', { ...req.params });
  });

  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
