import React from 'react';
import { useFormik } from 'formik';

import { Column } from '../layout';
import Button from '../Button';
import Input from '../Input';
import { Body } from '../text';
import { HeroTitle, StyledCard } from './_styled';

import useSocket from '../../hooks/useSocket';

const LoginForm = () => {
  const socket = useSocket('game.join', console.log);
  const formik = useFormik({
    initialValues: {
      gameName: '',
      playerName: ''
    },
    onSubmit: values => socket.emit('game.join', values)
  });

  return (
    <Column flex="1 0 auto" alignItems="center" justifyContent="center" spacing="s2">
      <HeroTitle>Caracole</HeroTitle>
      <StyledCard padding="s4" spacing="s3">
        <form onSubmit={formik.handleSubmit}>
          <Column spacing="s3">
            <Column spacing="s2">
              <Column spacing="s0">
                <Body>Game Name</Body>
                <Input
                  id="gameName"
                  name="gameName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.gameName}
                  required
                />
              </Column>
              <Column spacing="s0">
                <Body>Your name</Body>
                <Input
                  id="playerName"
                  name="playerName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.playerName}
                  required
                />
              </Column>
            </Column>
            <Button type="submit">Join</Button>
          </Column>
        </form>
      </StyledCard>
    </Column>
  );
};

export default LoginForm;
