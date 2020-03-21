import React from 'react';

import Game from '../components/Game';
import { Column } from '../components/layout';
import LoginForm from '../components/LoginForm';
import useGame from '../hooks/useGame';

const Home = () => {
  const { game } = useGame();
  return (
    <Column flex="1 0" style={{ minHeight: '100vh' }}>
      {game ? <Game /> : <LoginForm />}
    </Column>
  );
};

export default Home;
