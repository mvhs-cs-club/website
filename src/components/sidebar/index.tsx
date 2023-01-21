// react
import { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';

// mui
import {
  ChevronLeft,
  HomeRounded,
  NotificationsNoneRounded,
  LeaderboardRounded,
  PersonRounded,
  LogoutRounded,
  AdminPanelSettingsRounded,
  Person,
  PriorityHighRounded,
  Info,
  Construction,
  TuneRounded,
  People
} from '@mui/icons-material';
import { Button, Fab, Box, useTheme, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

// firebase
import { signIn, handleSignOut as signOut } from 'src/utils/firebase';

// utils
import { AdminContext, UserContext, UserLoadingContext } from 'contexts/UserContext';

// types
import type { PathType } from 'types/utils';

// components
import ExpandDown from 'keyframes/expand-down';
import NavItem from './NavItem';

const expandedWidth: string = '250px';
const contractedWidth: string = '60px';

const SidebarWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  width: '100%',
  borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'transparent' : '#ccc'}`,
  padding: theme.spacing(1),
  paddingTop: theme.spacing(1.5),
  overflow: 'hidden',
  background: theme.palette.background.default
}));

const Sections = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  transition: '0.15s'
}));

const ExpandedArrowWrapper = styled('div')(({ theme }: any) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  padding: '3px'
}));

const CustomFab = styled(Fab)({
  transform: 'translateX(2px)',
  minWidth: '40px !important',
  boxShadow: 'none !important',
  '&:focus': {
    boxShadow: 'none'
  }
});

const Sidebar = () => {
  const user: any = useContext(UserContext);
  const isAdmin: boolean | null = useContext(AdminContext);
  const loading: boolean = useContext(UserLoadingContext);

  const theme = useTheme();
  const location = useLocation();
  let p = location.pathname.match(/^(\/\w+)/)?.[1] || '/';
  const [pathname, setPathname] = useState<string | undefined>(p);
  const [expanded, setExpanded] = useState<boolean>(true);
  let paths: PathType[] = [
    {
      path: '/',
      name: 'Home',
      icon: <HomeRounded />
    },
    {
      path: '/announcements',
      name: 'Announcements',
      icon: <NotificationsNoneRounded />
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      icon: <LeaderboardRounded />
    }
  ];
  if (user != null) {
    paths.push({
      path: '/challenges',
      name: (
        <>
          Challenges
          <Chip
            label="beta"
            size="small"
            sx={{
              ml: 1.5
            }}
            color="warning"
            variant="outlined"
          />
        </>
      ),
      icon: <Construction />
    });
  }
  if (isAdmin) {
    paths.push(
      ...[
        {
          path: '/problems',
          name: 'Problems',
          icon: <PriorityHighRounded />
        },
        {
          path: '/admin',
          name: 'Admin Panel',
          icon: <AdminPanelSettingsRounded />
        },
        {
          path: '/attendance',
          name: 'Attendance',
          icon: <Person />
        }
      ]
    );
  }
  if (user !== null) {
    paths.push({
      path: '/actions',
      name: 'Action Panel',
      icon: <TuneRounded></TuneRounded>
    });
  }
  if (user !== null && !isAdmin) {
    paths.push({
      path: '/request-attendance',
      name: 'Request Attendance',
      icon: <People />
    });
  }
  paths.push({
    path: '/about',
    name: 'About',
    icon: <Info />
  });

  const handleToggleExpand = (): void => {
    setExpanded((prev) => !prev);
  };

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = () => {
    signOut();
    window.location.reload();
  };

  const handleSetPath = (path: string): void => {
    setPathname(path);
  };

  const buttonSx = {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    span: {
      whiteSpace: 'nowrap'
    }
  };

  const buttonSxExpanded = {
    ...buttonSx,
    padding: '5px 8px 5px 5px !important'
  };

  const buttonSxContracted = {
    ...buttonSx,
    padding: '5px !important'
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        transition: '0.25s ease-in-out',
        ...(expanded
          ? {
              maxWidth: expandedWidth,
              minWidth: expandedWidth
            }
          : {
              maxWidth: contractedWidth,
              minWidth: contractedWidth
            })
      }}
    >
      <SidebarWrapper>
        <ExpandDown>
          <Sections>
            {paths.map((path: PathType, index: number) => (
              <NavItem
                to={path.path}
                icon={path.icon}
                onClick={() => handleSetPath(path.path)}
                expanded={expanded}
                active={path.path === pathname}
                key={`nav-item-${index}`}
              >
                {path.name}
              </NavItem>
            ))}
          </Sections>
        </ExpandDown>
        <ExpandedArrowWrapper
          sx={{
            display: 'flex',
            flexDirection: expanded ? 'row' : 'column'
          }}
        >
          {user === null && !loading ? (
            <Button
              className={!expanded ? 'expanded' : ''}
              onClick={handleSignIn}
              variant="contained"
              sx={expanded ? buttonSxExpanded : buttonSxContracted}
            >
              <PersonRounded />
              {expanded && <span>Sign in</span>}
            </Button>
          ) : (
            <Button
              className={!expanded ? 'expanded' : ''}
              onClick={handleSignOut}
              color="error"
              variant="outlined"
              sx={expanded ? buttonSxExpanded : buttonSxContracted}
            >
              <LogoutRounded />
              {expanded && <span>Sign out</span>}
            </Button>
          )}
          <CustomFab
            size="small"
            color={theme.palette.mode === 'light' ? 'inherit' : 'primary'}
            onClick={handleToggleExpand}
          >
            <ChevronLeft
              sx={{
                transition: '0.15s',
                ...(!expanded
                  ? {
                      transform: 'rotate(180deg)'
                    }
                  : {
                      transform: 'rotate(0deg)'
                    })
              }}
            />
          </CustomFab>
        </ExpandedArrowWrapper>
      </SidebarWrapper>
    </Box>
  );
};

export default Sidebar;
