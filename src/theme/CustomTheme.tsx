// react
import { useState, useMemo, createContext, useContext, useEffect } from 'react';

// mui
import { PaletteMode, ThemeProvider } from '@mui/material';

// utils
import Palette from './palette';

// hooks
import useLocalStorage from 'hooks/useLocalStorage';

interface ColorModeContextType {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

interface ThemeModeContextType {
  setThemeMode: (type: string) => void;
  themeType: string;
}

interface Props {
  children: React.ReactNode;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'light'
});

export const ThemeModeContext = createContext<ThemeModeContextType>({
  setThemeMode: () => {},
  themeType: 'theme1'
});

const CustomTheme = ({ children }: Props) => {
  const [localTheme, setLocalTheme] = useLocalStorage('site-theme', {
    theme: 'theme7',
    mode: 'light'
  });
  const [mode, setMode] = useState<PaletteMode>(localTheme.mode);
  const [themeType, setThemeType] = useState<string>(localTheme.theme);
  const themeMode = useMemo(
    () => ({
      setThemeMode: (type: string) => {
        setThemeType(type);
      },
      themeType
    }),
    [themeType]
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
      },
      mode
    }),
    [mode]
  );

  const theme = useMemo(() => Palette(mode, themeType), [mode, themeType]);

  useEffect(() => {
    setLocalTheme({
      theme: themeType,
      mode
    });
  }, [theme]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeModeContext.Provider value={themeMode}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeModeContext.Provider>
    </ColorModeContext.Provider>
  );
};

export default CustomTheme;

export const useThemeMode = () => useContext(ColorModeContext);
