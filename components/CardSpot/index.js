import React, { forwardRef } from 'react';
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
  top: 1px;
  bottom: 1px;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.s1};
  border: 2px dashed ${theme.color.border};
  border-radius: 6px;
  background: ${theme.color.backgroundAccented};
  text-transform: uppercase;
  font-size: ${theme.fontSize.large};
  font-weight: ${theme.fontWeight.medium};
  line-height: 1.5;
  color: ${theme.color.border};
  text-align: center;
`;

const HiddenPlayingCard = styled(PlayingCard).attrs({ isHidden: true })`
  visibility: hidden;
`;

const CardSpot = ({ label, ...rest }, ref) => {
  return (
    <RelativeWrapper ref={ref} {...rest}>
      <LabelWrapper>{label}</LabelWrapper>
      {/* Use an invisible card as background to set width and height */}
      <HiddenPlayingCard />
    </RelativeWrapper>
  );
};

export default forwardRef(CardSpot);
