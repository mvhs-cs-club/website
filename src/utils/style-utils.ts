import { keyframes as kf } from 'styled-components';

export const utils = {
  yellow: '#ffc107',
  yellowRgb: '255, 193, 7',
  blue: '#007bff',
  red: 'rgb(255, 104, 104)',
  headerHeight: '65px',
  contentPadding: '34px 46px',
  itemGap: '12px',
  cardPadding: '20px',
  colorAnimationTime: '0.25s',
  removeScrollbars: {
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none'
  }
};

export const classes = {
  full: {
    width: '100%',
    height: '100%'
  },
  col: {
    display: 'flex',
    'flex-direction': 'column'
  },
  row: {
    display: 'flex',
    'flex-direction': 'row'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  }
};
