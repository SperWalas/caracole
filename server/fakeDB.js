// fake DB
const DB = {
  games: {}
};

const findGameByName = gameName => {
  return Object.values(DB.games).find(game => game.name === gameName);
};

const getGame = gameId => {
  return DB.games[gameId];
};

const getGames = () => {
  return DB.games;
};

const saveGame = game => {
  DB.games = {
    ...DB.games,
    [game.id]: game
  };
  return DB.games;
};

module.exports = {
  findGameByName,
  getGame,
  getGames,
  saveGame
};
