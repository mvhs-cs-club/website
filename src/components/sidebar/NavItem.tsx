// mui
import { ListItemButton, useTheme, ListItemText, ListItemIcon, PaletteColor } from '@mui/material';
import { styled } from '@mui/material/styles';

// components
import Link from 'components/link';

interface Props {
  to: string;
  onClick?: (event: any) => void;
  expanded: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  active: boolean;
}

const Item = styled(ListItemButton)(({ theme }) => ({
  transition: '0.15s all',
  height: '39px',
  cursor: 'pointer',
  borderTop: 'none',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  '& .MuiTouchRipple-root .MuiTouchRipple-child': {
    backgroundColor: theme.palette.primary.main
  }
}));

const NavItem = ({ to, onClick, expanded, icon, children, active }: Props) => {
  const theme = useTheme();

  const handleClick = (e: any): void => {
    if (onClick) onClick(e);
  };

  return (
    <Link to={to}>
      <Item
        onClick={handleClick}
        sx={{
          padding: `8px ${expanded ? '30px' : '9px'}`,
          borderRadius: '4px',
          '&:hover': {
            ...(!active
              ? {
                  background: `${theme.palette.primary.main}1a`
                }
              : {
                  background: `${theme.palette.primary.main}33`
                })
          },
          ...(active
            ? {
                background: `${theme.palette.primary.main}33`
              }
            : {})
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 36,
            ...(active
              ? {
                  color: theme.palette.primary.main
                }
              : {})
          }}
        >
          {icon}
        </ListItemIcon>
        {expanded && (
          <ListItemText
            sx={{
              color: active
                ? theme.palette.mode === 'light'
                  ? theme.palette.primary.main
                  : theme.palette.primary['200' as keyof PaletteColor]
                : theme.palette.text.primary
            }}
          >
            {children}
          </ListItemText>
        )}
      </Item>
    </Link>
  );
};

export default NavItem;
