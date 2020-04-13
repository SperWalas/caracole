import styled from 'styled-components';

import { DECK_COLOR } from '../../PlayingCard';
import theme from '../../theme';

export const DrawPileWrapper = styled.div`
  position: relative;
  width: ${theme.metric.cardWidth};
  height: 100%;
  background: url('/cards/${DECK_COLOR}_back.svg') no-repeat;
  background-size: 100% 100%;

/* 
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    z-index: 0;
  } */
`;
