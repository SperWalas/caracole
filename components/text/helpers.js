import { css } from 'styled-components';

import theme from '../theme';

export const withHighlightedParts = css`
  ${props =>
    props.withHighlightedParts &&
    css`
      a,
      span,
      strong {
        color: ${theme.color.textHighlighted};
      }
    `};
`;

export const withTextColorModifiers = css`
  ${props =>
    props.disabled &&
    css`
      color: ${theme.color.textDisabled};
    `};

  ${props =>
    props.highlighted &&
    css`
      color: ${theme.color.textHighlighted};
    `};

  ${props =>
    props.reversed &&
    css`
      color: ${theme.color.textReversed};

      /* Prevent links from becoming blue on hover */
      && a {
        color: inherit;
      }
    `};

  ${props =>
    props.subdued &&
    css`
      color: ${theme.color.textSubdued};
    `};
`;
