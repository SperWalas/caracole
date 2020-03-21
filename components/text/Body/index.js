import styled, { css } from 'styled-components';

import theme from '../../theme';
import { withHighlightedParts, withTextColorModifiers } from '../helpers';

const Body = styled.div`
  ${withHighlightedParts};
  ${withTextColorModifiers};

  font-size: ${theme.fontSize.normal};
  font-weight: ${theme.fontWeight.normal};
  line-height: ${theme.lineHeight.normal};

  ${props =>
    props.bold &&
    css`
      font-weight: ${theme.fontWeight.medium};
    `};
`;

export default Body;
