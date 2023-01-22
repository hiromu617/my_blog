import { AppProps } from "next/app";
import { useState } from "react";
import Head from "next/head";
import {
  MantineProvider,
  AppShell,
  Button,
  Header,
  ColorSchemeProvider,
  ColorScheme,
  ActionIcon,
  Container,
} from "@mantine/core";
import { TbSun, TbMoonStars } from "react-icons/tb";
import { NextLink } from "@mantine/next";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
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
            padding="md"
            header={
              <Header
                height={60}
                p="xs"
                display="flex"
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="subtle"
                  color="dark"
                  fz={36}
                  component={NextLink}
                  href="/"
                  legacyBehavior
                >
                  🛹
                </Button>
                <ActionIcon
                  variant="subtle"
                  color={colorScheme === "dark" ? "yellow" : "blue"}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                  size="lg"
                >
                  {colorScheme === "dark" ? (
                    <TbSun size={18} />
                  ) : (
                    <TbMoonStars size={18} />
                  )}
                </ActionIcon>
              </Header>
            }
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Container>
              <Component {...pageProps} />
            </Container>
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
