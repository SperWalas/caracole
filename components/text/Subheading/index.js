import styled from 'styled-components';

import theme from '../../theme';
import { withHighlightedParts, withTextColorModifiers } from '../helpers';

const Subheading = styled.div`
  ${withHighlightedParts};
  ${withTextColorModifiers};

  font-size: ${theme.fontSize.medium};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.medium};
`;

export default Subheading;
