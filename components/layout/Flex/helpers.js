import kebabCase from 'lodash/kebabCase';

export const getStyleFromProps = cssProp => props => {
  if (typeof props[cssProp] !== 'undefined') {
    const cssProperty = kebabCase(cssProp);
    return `${cssProperty}: ${props[cssProp]}`;
  }
};
