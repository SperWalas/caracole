const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const { NBR_MAX_SIMULTANEOUS_GAMES } = require('./constants');
const FakeDB = require('./fakeDB');
const Game = require('./game');
const Player = require('./player');
const Players = require('./players');

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
      const games = FakeDB.getGames();
      const gamesCount = Object.keys(games).length;
      // Avoid too many game
      if (gamesCount >= NBR_MAX_SIMULTANEOUS_GAMES) {
        socket.emit('errorMessage', 'Too many games created.');
        return;
      }
      // Can create a game
      game = Game.create(gameName);
      // Add player to the game
      const player = Player.create(playerName);
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

  // When a user saw his cards at the begin of the game
  socket.on('game.setPlayerhasDiscoveredHisCards', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    // Update player, if all players have seen their cards, start the game
    game = Game.setPlayerHasDiscoveredHisCards(game, playerId);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients that player is looking to a card
    sendGameUpdateToClients(gameId);
  });

  // When a user set itself as ready
  socket.on('game.setPlayerReady', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    game = Game.setPlayerIsReady(game, playerId);
    // When all player are ready, start the game
    if (Game.canStart(game)) {
      game = Game.setup(game);
    }
    // Save
    FakeDB.saveGame(game);
    sendGameUpdateToClients(gameId);
  });

  // When an user confirm he has seen the card
  socket.on('game.hasWatchedCard', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    // Set has discover if game is still in discovery mode (beginning of the game)
    game = Game.setPlayerHasWatched(game, playerId);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  socket.on('game.pickDrawCard', ({ gameId, playerId }) => {
    console.log('game.pickDrawCard', { gameId, playerId });
    let game = FakeDB.getGame(gameId);
    const [card] = game.drawPile;
    game = Game.removeDrawCard(game);
    game = Game.setPlayerTmpCard(game, playerId, card);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
    // Send card only to client
    socket.emit('game.pickedCard', card);
  });

  socket.on('game.pickDiscardCard', ({ gameId, playerId }) => {
    console.log('game.pickDiscardCard', { gameId, playerId });
    let game = FakeDB.getGame(gameId);
    const [card] = game.discardPile.slice(-1);
    game = Game.removeDiscardCard(game);
    game = Game.setPlayerTmpCard(game, playerId, card);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(game.id);
    // Send card only to client
    socket.emit('game.pickedCard', card);
  });

  // When an user want to put a card in the discard pile
  socket.on('game.throwCard', ({ gameId, playerId, card }) => {
    let game = FakeDB.getGame(gameId);
    const { players } = game;
    const player = players[playerId];

    // If player has a tmpCard and throw one of his card
    if (player.tmpCard && playerId === card.playerId) {
      game = Game.setCardToDiscardPile(game, playerId, card);
    }
    // If a player throws his or someone's card
    else if (Game.isCardCanBeThrown(game, card)) {
      game = Game.setCardToDiscardPile(game, playerId, card);
    }
    // Player throws a wrong card
    else {
      // Add card from the draw pile to player
      const [cardToAdd] = game.drawPile;
      game = Game.removeDrawCard(game);
      game = Game.addCardToPlayer(game, playerId, cardToAdd);

      // TODO: Reveal a card to anyone
      // const cardThrown = Game.getCard(game, card);
      // io.to(game.id).emit('game.card', {
      //   ...cardThrown,
      //   ...card
      // });
    }

    // Check if game is done
    if (Game.isDone(game)) {
      // TODO: let people who has the same card to throw even if the game is over
      console.log('GAME IS OVER');
      game = Game.end(game);
    }

    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  socket.on('game.throwTmpCard', ({ gameId, playerId }) => {
    let game = FakeDB.getGame(gameId);
    // Set tmp card to discardPile
    game = Game.setTmpCardToDiscardPile(game, playerId);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });

  socket.on('game.giveCard', ({ gameId, playerId, card }) => {
    let game = FakeDB.getGame(gameId);
    // Give card to someone (playerIdToGiveTo is in the nextActions of the game)
    game = Game.givePlayerCard(game, playerId, card);
    // Save
    FakeDB.saveGame(game);
    // Respond to clients
    sendGameUpdateToClients(gameId);
  });
});

nextApp.prepare().then(() => {
  app.get('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
