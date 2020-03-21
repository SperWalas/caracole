import { useContext } from 'react';

import { GameContext } from './GameProvider';

const useGame = () => {
  const gameContext = useContext(GameContext);
  if (!gameContext) {
    throw Error('You should not use useGame outside a <GameProvider>');
  }

  return gameContext;
};

export default useGame;
