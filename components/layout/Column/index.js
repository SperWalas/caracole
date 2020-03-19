import styled, { css } from 'styled-components';

import Flex from '../Flex';
import theme from '../../theme';

const Column = styled(Flex)`
  flex-direction: column;

  ${({ spacing }) =>
    spacing &&
    css`
      && {
        > * + * {
          margin-top: ${theme.spacing[spacing]};
        }
      }
    `}
`;

export default Column;
