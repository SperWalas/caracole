import styled, { css } from 'styled-components';

import theme from '../../theme';

const Subheading = styled.div`
  font-size: ${theme.fontSize.medium};
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.medium};

  ${props =>
    props.light &&
    css`
      font-weight: ${theme.fontWeight.normal};
    `};
`;

export default Subheading;
