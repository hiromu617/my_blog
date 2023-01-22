import { AppProps } from "next/app";
import Head from "next/head";
import {
  MantineProvider,
  AppShell,
  ColorSchemeProvider,
  ColorScheme,
  Container,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { AppHeader } from "@/components/Layout/AppHeader";
import { useLocalStorage } from "@mantine/hooks";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const isSP = useMediaQuery("(max-width: 576px)");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>hiromu617</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            globalStyles: (theme) => ({
              body: {
                color:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.colors.dark[9],
              },
            }),
          }}
        >
          <AppShell
            padding={isSP ? "sm" : "lg"}
            header={<AppHeader />}
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark" ? theme.colors.dark[8] : "#fff",
              },
            })}
          >
            <Component {...pageProps} />
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
