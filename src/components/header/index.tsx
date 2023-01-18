// react
import { useState, useContext } from 'react';

// mui
import { PaletteColor, Fab, Menu, useTheme, Switch, Theme } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// img
import MvhsLogo from 'assets/MvhsLogo';

// utils
import { ThemeModeContext, ColorModeContext } from 'theme/CustomTheme';
import { utils } from 'utils/style-utils';

// types
import type { ColorSwatch } from 'types/colors';

// assets
import theme1 from 'assets/scss/_theme1.module.scss';
import theme2 from 'assets/scss/_theme2.module.scss';
import theme3 from 'assets/scss/_theme3.module.scss';
import theme4 from 'assets/scss/_theme4.module.scss';
import theme5 from 'assets/scss/_theme5.module.scss';
import theme6 from 'assets/scss/_theme6.module.scss';

// components
import Sub from 'components/sub';

const HeaderWrapper = styled('header')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '19px 24px',
  background:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.primary['800' as keyof PaletteColor],
  color: theme.palette.getContrastText(theme.palette.primary.main),
  boxShadow:
    '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
  zIndex: 5,
  height: 65,
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: `${utils.colorAnimationTime} background`
}));

const Left = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(3.25)
}));

const HeaderTitle = styled('p')({
  margin: 0,
  padding: 0,
  fontSize: 22,
  fontWeight: 400
});

const CustomMenu = styled(Menu)(({ theme }) => ({
  top: theme.spacing(1.125),
  ul: {
    padding: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.25)
  }
}));

const SwatchWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0.125),
  borderRadius: '100%',
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'transparent'
}));

const Swatch = styled('div')({
  borderRadius: '100%',
  width: 28,
  height: 28,
  cursor: 'pointer'
});

const Row = styled('div')({
  display: 'flex',
  flexDirection: 'row'
});

const Section = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25)
}));

interface GroupTitleProps {
  children: React.ReactNode;
  theme: Theme;
}

const GroupTitle = ({ children, theme }: GroupTitleProps) => {
  return (
    <Sub
      sx={{
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.getContrastText(theme.palette.background.default)
            : (theme.palette.text as any).primary
      }}
    >
      {children}
    </Sub>
  );
};

const Header = () => {
  const theme = useTheme();
  const themeMode = useContext(ThemeModeContext);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const getThemeColor = (themeObj: any): string => {
    return theme.palette.mode === 'light' ? themeObj.primaryMain : themeObj.darkPrimaryMain;
  };

  const colors: ColorSwatch[] = [
    {
      color: getThemeColor(theme1),
      theme: 'theme1'
    },
    {
      color: getThemeColor(theme2),
      theme: 'theme2'
    },
    {
      color: getThemeColor(theme3),
      theme: 'theme3'
    },
    {
      color: getThemeColor(theme4),
      theme: 'theme4'
    },
    {
      color: getThemeColor(theme5),
      theme: 'theme5'
    },
    {
      color: getThemeColor(theme6),
      theme: 'theme6'
    }
  ];

  const handleSetTheme = (newTheme: string) => {
    themeMode.setThemeMode(newTheme);
  };

  const handleModeChange = () => {
    colorMode.toggleColorMode();
  };

  return (
    <HeaderWrapper>
      <Left>
        <MvhsLogo />
        <HeaderTitle>MVHS CS Club</HeaderTitle>
      </Left>
      <Fab
        size="small"
        onClick={handleOpenMenu}
      >
        <Settings />
      </Fab>
      <CustomMenu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <Section>
          <GroupTitle theme={theme}>Theme</GroupTitle>
          <Row>
            {colors.map((color: ColorSwatch, index: number) => (
              <SwatchWrapper
                sx={
                  color.theme === themeMode.themeType
                    ? { borderColor: `${theme.palette.primary.main} !important` }
                    : {}
                }
                key={`color-swatch-${index}`}
              >
                <Swatch
                  sx={{
                    background: color.color
                  }}
                  onClick={() => handleSetTheme(color.theme)}
                />
              </SwatchWrapper>
            ))}
          </Row>
        </Section>
        <Section>
          <GroupTitle theme={theme}>Dark Mode</GroupTitle>
          <Switch
            color="default"
            checked={theme.palette.mode === 'dark'}
            onChange={handleModeChange}
          />
        </Section>
      </CustomMenu>
    </HeaderWrapper>
  );
};

export default Header;
