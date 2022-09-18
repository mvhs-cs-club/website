// mui
import { Card as MuiCard, useTheme } from '@mui/material';

interface Props {
  children?: any;
  sx?: object;
  stretch?: boolean;
  className?: string;
  onClick?: Function;
  onScroll?: Function;
}

const Card = ({ children, sx, stretch = false, className, onClick, onScroll }: Props) => {
  const theme = useTheme();

  const handleClick = (e: any) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleScroll = (e: any) => {
    if (onScroll) {
      onScroll(e);
    }
  };

  const cardSX = {
    padding: theme.spacing(2.5),
    boxShadow: theme.palette.mode === 'light' ? '0 8px 32px rgba(0, 0, 0, 0.12)' : '',
    ...(stretch ? { width: '100%' } : { width: 'fit-content' }),
    borderRadius: '8px',
    overflow: 'visible',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    background: theme.palette.background.default
  };

  return (
    <MuiCard
      className={className ? className : ''}
      sx={{
        ...cardSX,
        ...sx,
        ...(stretch
          ? {
            width: '100% !important',
            flex: '1 1 auto'
          }
          : {})
      }}
      onClick={(e: any) => handleClick(e)}
      onScroll={(e: any) => handleScroll(e)}
    >
      {children}
    </MuiCard>
  );
};

export default Card;
