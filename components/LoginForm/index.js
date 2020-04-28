import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';

import { Column } from '../layout';
import Button from '../Button';
import Input from '../Input';
import { Body } from '../text';
import { HeroTitle, StyledCard } from './_styled';

import useSocket from '../../hooks/useSocket';

const LoginForm = () => {
  const { query = {} } = useRouter();
  const socket = useSocket('game.join');
  const formik = useFormik({
    initialValues: {
      gameName: query.gameName || '',
      playerName: ''
    },
    onSubmit: values => {
      history.pushState({}, null, `/${values.gameName}`);
      socket.emit('game.join', values);
    }
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
