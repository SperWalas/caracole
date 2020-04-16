import styled from 'styled-components';
import { animated } from 'react-spring';

import {
  DISCARD_PILE_SPOT_ID,
  FAILED_CARD_SPOT_ID,
  DRAW_PILE_SPOT_ID,
  PICKED_CARD_SPOT_ID
} from '../../hooks/useCardSpots';

const zIndexCardSpot = {
  [DISCARD_PILE_SPOT_ID]: 1,
  [FAILED_CARD_SPOT_ID]: 2,
  // Default is at 3 (players cards)
  [DRAW_PILE_SPOT_ID]: 4,
  [PICKED_CARD_SPOT_ID]: 5
};

export const StyledAnimatedDiv = styled(animated.div)`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${({ cardSpot }) => zIndexCardSpot[cardSpot] || 3};
  will-change: transform;
`;
