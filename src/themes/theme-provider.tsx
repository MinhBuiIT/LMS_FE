import { ThemeProvider as NextThemeProvider, ThemeProviderProps } from 'next-themes';

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, ...props }) => {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};

export default ThemeProvider;
