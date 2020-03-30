import styled from 'styled-components';
import { StyledImg } from '../../PlayingCard';

import theme from '../../theme';

export const PickedCardWrapper = styled.div`
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translateX(-50%) scale(1.2);
  z-index: 1000;

  ${StyledImg} {
    box-shadow: 2px 20px 27px ${theme.color.darkShadow};

    &:hover {
      box-shadow: 2px 8px 10px ${theme.color.darkShadow};
    }
  }
`;
