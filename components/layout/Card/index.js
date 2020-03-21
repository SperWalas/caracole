import styled from 'styled-components';

import theme from '../../theme';
import Column from '../Column';

const Card = styled(Column).attrs({ padding: 's3' })`
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.metric.borderRadius};
`;

export default Card;
