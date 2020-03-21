import React from 'react';
import styled from 'styled-components';

import theme from '../theme';
import { Column } from '../layout';
import PlayingCard from '../PlayingCard';

const RelativeWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
`;

const LabelWrapper = styled(Column)`
  position: absolute;
  left: 0;
  right: 0;
  /* compensate card padding */
  top: 3px;
  bottom: 6px;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.s1};
  border: 2px dashed ${theme.color.border};
  border-radius: 6px;
  background: ${theme.color.backgroundAccented};
  text-transform: uppercase;
  font-size: ${theme.fontSize.larger};
  font-weight: ${theme.fontWeight.medium};
  line-height: 1.5;
  color: ${theme.color.border};
  text-align: center;
`;

const HiddenPlayingCard = styled(PlayingCard).attrs({ isHidden: true })`
  visibility: hidden;
`;

// export default StyledCardSpot;
const CardSpot = ({ label }) => {
  return (
    <RelativeWrapper>
      <LabelWrapper>{label}</LabelWrapper>
      {/* Use an invisible card as background to set width and height */}
      <HiddenPlayingCard />
    </RelativeWrapper>
  );
};

export default CardSpot;
