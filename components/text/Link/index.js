import styled from 'styled-components';

import theme from '../../theme';
import Body from '../Body';

const Link = styled(Body).attrs({ as: 'a' })`
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${theme.color.textHighlighted};
  }
`;

export default Link;
