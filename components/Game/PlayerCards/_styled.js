import styled from 'styled-components';

import { Column } from '../../layout';

export const CardInfo = styled(Column)`
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  justify-content: center;
  text-align: center;
`;

export const CardWrapper = styled.div`
  position: relative;
`;
