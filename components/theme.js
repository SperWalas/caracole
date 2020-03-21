import { darken, rem, rgba, tint } from 'polished';

// Colors are named using [Name that color](http://chir.ag/projects/name-that-color)
export const color = {
  // Gray shades
  black: '#000',
  codGray: '#191919',
  dustyGray: '#969696',
  silver: '#c8c8c8',
  mercury: '#e1e1e1',

  governorBay: '#3a50c0', // Blue
  emerald: '#00C241', // Green
  jaffa: '#fe990d', // Orange
  monza: '#e60c0c' // Red
};

export const colorForStatus = {
  danger: color.monza,
  disabled: color.dustyGray,
  info: color.governorBay,
  success: color.emerald,
  warning: color.jaffa
};

const theme = {
  animation: {
    easing: 'ease-in-out',
    timing: '150ms'
  },
  color: {
    ...color,

    primary: color.governorBay,
    primaryHover: darken(0.05, color.governorBay),
    primaryActive: darken(0.1, color.governorBay),
    primaryBackground: tint(0.85, color.governorBay),

    background: color.white,
    backgroundAccented: color.alabaster,

    text: color.codGray,
    textDisabled: color.silver,
    textHighlighted: color.governorBay,
    textSubdued: color.dustyGray,

    border: color.mercury,
    shadow: rgba(color.black, 0.1)
  },
  fontSize: {
    small: rem('11px'),
    normal: rem('14px'),
    medium: rem('16px'),
    large: rem('22px'),
    larger: rem('28px'),
    jumbo: rem('44px')
  },
  fontWeight: {
    normal: 400,
    medium: 600
  },
  lineHeight: {
    small: rem('16px'),
    normal: rem('20px'),
    medium: rem('24px'),
    large: rem('32px'),
    larger: rem('40px'),
    jumbo: rem('56px')
  },
  metric: {
    borderRadius: rem('3px'),
    cardWidth: rem('80px'),

    smallContainer: rem('400px'),
    mediumContainer: rem('600px'),
    largeContainer: rem('850px'),
    xlargeContainer: rem('1200px')
  },
  spacing: {
    s0: rem('4px'),
    s1: rem('8px'),
    s1_5: rem('12px'),
    s2: rem('16px'),
    s3: rem('24px'),
    s4: rem('32px'),
    s6: rem('48px'),
    s8: rem('64px')
  }
};

export default theme;
