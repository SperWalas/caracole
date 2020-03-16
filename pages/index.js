import React, { useState } from 'react';

import useSocket from '../hooks/useSocket';
import Game from '../components/Game';
import LoginForm from '../components/LoginForm';

const Home = () => {
  const [playerId, setPlayerId] = useState(null);
  const [game, setGame] = useState(null);

  // Receive event
  useSocket('game.update', game => {
    console.log({ game });
    setGame(game);
  });

  useSocket('game.you', playerId => {
    setPlayerId(playerId);
  });

  return <main>{game ? <Game game={game} playerId={playerId} /> : <LoginForm />}</main>;
};

export default Home;
