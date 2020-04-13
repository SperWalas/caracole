import styled from 'styled-components';

import CardSpot from '../../CardSpot';

export const FailedCard = styled(CardSpot)`
  position: absolute;
  z-index: 1;
  top: 30%;
  left: -20%;
  opacity: 0;
`;

export const RelativeWrapper = styled.div`
  position: relative;
`;
