import React, { useState } from 'react';

import Button from '../../Button';
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

const LoginForm = ({ children, players }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeScoreboard = () => setIsOpen(false);
  const openScoreboard = () => setIsOpen(true);

  return (
    <>
      <Overlay onClick={closeScoreboard} isOpen={isOpen}>
        <StyledColumn alignItems="center" justifyContent="center">
          <ScoreModal>
            <ScoreModalContent spacing="s3">
              <Heading>Scores</Heading>
              <Row>
                <div></div>
                {Object.keys(players).map(pid => {
                  const { name, scores } = players[pid];
                  const incrementalScore = scores.map((_, idx) =>
                    scores.slice(0, idx + 1).reduce((sum, score) => sum + score, 0)
                  );
                  return (
                    <ScoreColumnTable flex="1" key={pid} textAlign="center" spacing="s1">
                      <BodyName bold>{name}</BodyName>
                      <Column spacing="s0">
                        {incrementalScore.map((score, idx) => (
                          <Body key={`${pid}${idx}`}>{score}</Body>
                        ))}
                      </Column>
                      <Body bold highlighted>
                        {scores.reduce((sum, score) => sum + score, 0)}
                      </Body>
                    </ScoreColumnTable>
                  );
                })}
              </Row>
              <Row justifyContent="flex-end">
                <Button onClick={closeScoreboard}>Close</Button>
              </Row>
            </ScoreModalContent>
          </ScoreModal>
        </StyledColumn>
      </Overlay>
      {children({ open: openScoreboard })}
    </>
  );
};

export default LoginForm;
