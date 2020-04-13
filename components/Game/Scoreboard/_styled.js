import { rem } from 'polished';
import styled, { css } from 'styled-components';

import { Card, Column } from '../../layout';
import theme from '../../theme';
import { Body } from '../../text';

export const BodyName = styled(Body)`
  padding: 0 ${theme.spacing.s1};
`;

export const ScoreColumnTable = styled(Column)`
  & > ${Column} {
    border-top: 1px solid ${theme.color.border};
  }

  & + ${Column} {
    border-left: 1px solid ${theme.color.border};
  }
`;

export const ScoreModal = styled(Column)`
  position: relative;
`;

export const ScoreModalContent = styled(Card)`
  position: relative;
  border: none;
  width: ${rem('350px')};
  background-color: ${theme.color.white};
  box-shadow: 0 ${theme.spacing.s3} ${theme.spacing.s4} 0 ${theme.color.shadow};
`;

export const StyledColumn = styled(Column)`
  height: 100%;
`;

export const Overlay = styled(Column)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background-color: ${theme.color.backgroundOverlay};

  ${props =>
    props.isOpen &&
    css`
      display: block;
    `}
`;
