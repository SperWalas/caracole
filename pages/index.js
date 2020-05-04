import React from 'react';
import Head from 'next/head';

import Game from '../components/Game';
import { Column } from '../components/layout';
import LoginForm from '../components/LoginForm';
import useGame from '../hooks/useGame';

const Home = () => {
  const { game } = useGame();
  return (
    <Column flex="1 0" style={{ minHeight: '100vh' }}>
      <Head>
        <title>Play Caracole!</title>
      </Head>
      {game ? <Game /> : <LoginForm />}
    </Column>
  );
};

export default Home;
