import styled, { css } from 'styled-components';

import Flex from '../Flex';
import theme from '../../theme';

const Row = styled(Flex)`
  flex-direction: row;

  ${({ spacing }) =>
    spacing &&
    css`
      && {
        > * + * {
          margin-left: ${theme.spacing[spacing]};
        }
      }
    `}
`;

export default Row;
