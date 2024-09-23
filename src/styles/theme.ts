import { extendTheme, ThemeConfig } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
});

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const themeInitial = extendTheme({ config });
