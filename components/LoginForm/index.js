import React from 'react';
import { useFormik } from 'formik';

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
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="gameName">Game Name</label>
        <input
          id="gameName"
          name="gameName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.gameName}
          required
        />
      </div>
      <div>
        <label htmlFor="playerName">Your Name</label>
        <input
          id="playerName"
          name="playerName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.playerName}
          required
        />
      </div>
      <button type="submit">Connect</button>
      <button type="submit">Create</button>
    </form>
  );
};

export default LoginForm;
