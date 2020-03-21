import styled, { css } from 'styled-components';

import theme from '../../theme';
import { withHighlightedParts, withTextColorModifiers } from '../helpers';

const Heading = styled.div`
  ${withHighlightedParts};
  ${withTextColorModifiers};

  font-size: ${theme.fontSize.large};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.large};
`;

export default Heading;
