import React, { useState } from 'react';

import useGame from '../../../hooks/useGame';
import Button, { DestructiveButton } from '../../Button';
import { Column, Row } from '../../layout';
import { Body, Heading } from '../../text';
import {
  BodyName,
  Overlay,
  ScoreColumnTable,
  ScoreModal,
  ScoreModalContent,
  StyledColumn
} from './_styled';

const Scoreboard = ({ children, players }) => {
  const { game, selfId, handleReset } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const closeScoreboard = () => setIsOpen(false);
  const openScoreboard = () => setIsOpen(true);

  return (
    <>
      <Overlay onClick={closeScoreboard} isOpen={isOpen}>
        <StyledColumn alignItems="center" justifyContent="center">
          <ScoreModal>
            <ScoreModalContent spacing="s3">
              <Heading>
                Scores<Body subdued>(Game name: {game.name})</Body>
              </Heading>

              <Row>
                {Object.keys(players).map(pid => {
                  const { name, scores } = players[pid];
                  const incrementalScore = scores.map((_, idx) =>
                    scores.slice(0, idx + 1).reduce((sum, score) => sum + score, 0)
                  );
                  return (
                    <ScoreColumnTable flex="1" key={pid} textAlign="center" spacing="s1">
                      <BodyName bold>{name}</BodyName>
                      <Column spacing="s0">
                        {incrementalScore.length ? (
                          incrementalScore.map((score, idx) => (
                            <Body
                              key={`${pid}${idx}`}
                              bold={idx === incrementalScore.length - 1}
                              highlighted={idx === incrementalScore.length - 1}
                            >
                              {score}
                            </Body>
                          ))
                        ) : (
                          <Body>0</Body>
                        )}
                      </Column>
                    </ScoreColumnTable>
                  );
                })}
              </Row>
              <Row justifyContent="space-between" flexDirection="row-reverse">
                <Button onClick={closeScoreboard}>Close</Button>
                {players[selfId].isCreator && (
                  <DestructiveButton onClick={handleReset}>Reset</DestructiveButton>
                )}
              </Row>
            </ScoreModalContent>
          </ScoreModal>
        </StyledColumn>
      </Overlay>
      {children({ open: openScoreboard })}
    </>
  );
};

export default Scoreboard;
