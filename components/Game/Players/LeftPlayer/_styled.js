import styled from 'styled-components';

import { Row } from '../../../layout';
import theme from '../../../theme';

export const ActionWrapper = styled(Row)`
  position: absolute;
  top: 100%;
  margin-top: ${theme.spacing.s1};
  align-items: baseline;
`;

export const RelativeRow = styled(Row)`
  position: relative;
`;
