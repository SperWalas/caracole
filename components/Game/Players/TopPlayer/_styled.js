import styled from 'styled-components';

import { Column, Row } from '../../../layout';
import theme from '../../../theme';

export const ActionWrapper = styled(Column)`
  position: absolute;
  right: 100%;
  margin-right: ${theme.spacing.s1};
  text-align: right;
`;

export const RelativeRow = styled(Row)`
  position: relative;
`;
