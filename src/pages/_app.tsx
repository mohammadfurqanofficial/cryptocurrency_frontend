import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme, themeInitial } from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider theme={theme}>
        <ColorModeScript
          initialColorMode={themeInitial.config.initialColorMode}
        />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
