import { rem } from 'polished';
import styled from 'styled-components';

import { Card } from '../layout';
import theme from '../theme';
import { Heading } from '../text';

export const StyledCard = styled(Card)`
  border: none;
  width: ${rem('300px')};
  background-color: ${theme.color.white};
  box-shadow: 0 ${theme.spacing.s3} ${theme.spacing.s4} 0 ${theme.color.shadow};
`;

export const HeroTitle = styled(Heading)`
  color: ${theme.color.forestGreen};
  text-shadow: #46ad5d ${rem('1px')} ${rem('1px')} 0, #2e6f3c ${rem('-1px')} ${rem('-1px')} 0;
  font-size: ${theme.fontSize.jumbo};
  line-height: ${theme.lineHeight.jumbo};
  letter-spacing: -0.03em;
`;
