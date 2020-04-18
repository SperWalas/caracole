import React from 'react';
import App from 'next/app';
import { normalize } from 'polished';
import io from 'socket.io-client';
import { createGlobalStyle } from 'styled-components';

import { CardSpotsProvider } from '../hooks/useCardSpots';
import { GameProvider } from '../hooks/useGame';

// Override global style to avoid Story height to be 100% of the screen height
const GlobalStyle = createGlobalStyle`
  ${normalize()};
  body {
    font-family: Inter, Arial, Helvetica, sans-serif;
    background: url('/assets/green_felt.jpg') center;
    background-size: cover;
  }
`;

class CaracoleApp extends App {
  constructor() {
    super();

    this.state = {
      socket: null
    };
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  componentDidMount() {
    // connect to WS server and listen event
    const socket = io();
    this.setState({ socket });
  }

  // close socket connection
  componentWillUnmount() {
    this.state.socket.close();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <GlobalStyle />
        <GameProvider>
          <CardSpotsProvider>
            <Component {...pageProps} socket={this.state.socket} />
          </CardSpotsProvider>
        </GameProvider>
      </>
    );
  }
}

export default CaracoleApp;
