import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

import theme from '../../theme';
import { getStyleFromProps } from './helpers';

const StyledDiv = styled.div``;
const DivWithoutSpacing = ({ spacing, ...rest }, ref) => <StyledDiv {...rest} ref={ref} />;

export default styled(forwardRef(DivWithoutSpacing))`
  display: flex;
  box-sizing: border-box;

  ${({ padding }) =>
    padding &&
    css`
      padding: ${theme.spacing[padding]};
    `};

  ${({ paddingBottom }) =>
    paddingBottom &&
    css`
      padding-bottom: ${theme.spacing[paddingBottom]};
    `};

  ${({ paddingLeft }) =>
    paddingLeft &&
    css`
      padding-left: ${theme.spacing[paddingLeft]};
    `};

  ${({ paddingRight }) =>
    paddingRight &&
    css`
      padding-right: ${theme.spacing[paddingRight]};
    `};

  ${({ paddingTop }) =>
    paddingTop &&
    css`
      padding-top: ${theme.spacing[paddingTop]};
    `};

  ${({ paddingX }) =>
    paddingX &&
    css`
      padding-left: ${theme.spacing[paddingX]};
      padding-right: ${theme.spacing[paddingX]};
    `};

  ${({ paddingY }) =>
    paddingY &&
    css`
      padding-top: ${theme.spacing[paddingY]};
      padding-bottom: ${theme.spacing[paddingY]};
    `};

  && {
    ${getStyleFromProps('alignContent')}
    ${getStyleFromProps('alignItems')}
    ${getStyleFromProps('alignSelf')}
    ${getStyleFromProps('flex')}
    ${getStyleFromProps('flexBasis')}
    ${getStyleFromProps('flexDirection')}
    ${getStyleFromProps('flexGrow')}
    ${getStyleFromProps('flexShrink')}
    ${getStyleFromProps('flexWrap')}
    ${getStyleFromProps('justifyContent')}
    ${getStyleFromProps('justifyItems')}
    ${getStyleFromProps('justifySelf')}
    ${getStyleFromProps('order')}
    ${getStyleFromProps('textAlign')}
    ${getStyleFromProps('width')}
  }
`;
