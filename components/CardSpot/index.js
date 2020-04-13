import React, { forwardRef } from 'react';
import styled from 'styled-components';

import theme from '../theme';
import { PlayingCardWrapper } from '../PlayingCard/_styled';

const RelativeWrapper = styled(PlayingCardWrapper)`
  box-sizing: border-box;
  pointer-events: none;

  border: 2px dashed ${theme.color.border};
  border-radius: 6px;
  background: ${theme.color.backgroundAccented};
  opacity: 0.3;
`;

const CardSpot = (props, ref) => {
  /* Use an invisible card as background to set width and height */
  return <RelativeWrapper ref={ref} {...props} />;
};

export default forwardRef(CardSpot);
