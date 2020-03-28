import styled from 'styled-components';

import theme from '../theme';

const Input = styled.input`
  box-sizing: border-box;
  display: flex;
  flex: 1;
  width: 100%;
  padding: ${theme.spacing.s1};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.metric.borderRadius};
  color: ${theme.color.text};
  font-size: ${theme.fontSize.normal};
  line-height: ${theme.lineHeight.normal};
  appearance: none;
  background: transparent;
  box-shadow: none;
  cursor: inherit;
  outline: none;

  ::placeholder {
    color: ${theme.color.textDisabled};
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    box-shadow: 0 0 0 50px ${theme.color.white} inset;
  }
`;

export default Input;
