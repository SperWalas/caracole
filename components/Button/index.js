import styled, { css } from 'styled-components';

import theme from '../theme';

export const borderify = (color, size = '1px') => css`
  box-shadow: inset 0 0 0 ${size} ${color};
  border-radius: ${theme.metric.borderRadius};
`;

export const resetButton = () => css`
  box-sizing: border-box;
  border: none;
  color: inherit;
  font: inherit;
  overflow: visible;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  /* Override normalize() style */
  && {
    appearance: none;
  }
`;

const Button = styled.button`
  ${resetButton()};
  /* ${borderify(theme.color.border)}; */

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${`${theme.spacing.s1} ${theme.spacing.s2}`};
  border-radius: ${theme.metric.borderRadius};
  font-size: ${theme.fontSize.normal};
  line-height: ${theme.lineHeight.normal};
  vertical-align: middle;
  text-decoration: none;
  text-align: center;
  color: ${theme.color.white};
  background-color: ${theme.color.primary};

  &:disabled {
    opacity: 0.2;
  }

  &:not(:disabled) {
    &:hover {
      cursor: pointer;
      color: ${theme.color.white};
      background-color: ${theme.color.primaryHover};
    }

    &:active {
      background-color: ${theme.color.primaryActive};
    }
  }
`;

export default Button;
