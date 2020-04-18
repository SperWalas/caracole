import styled from 'styled-components';

import { Column, Row } from '../../../layout';
import theme from '../../../theme';

export const ActionWrapper = styled(Column)`
  position: absolute;
  left: 100%;
  margin-left: ${theme.spacing.s1};
`;

export const RelativeRow = styled(Row)`
  position: relative;
`;
