import { FC } from "react";
import {
  Button,
  Header,
  ActionIcon,
  useMantineColorScheme,
  Flex,
} from "@mantine/core";
import { TbSun, TbMoonStars } from "react-icons/tb";
import { NextLink } from "@mantine/next";

export const AppHeader: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Header
      height={60}
      p="lg"
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
      <Flex gap={20} align="center">
        <ActionIcon
          variant="subtle"
          color={dark ? "orange" : "dark"}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
          size="lg"
        >
          {dark ? <TbSun size={18} /> : <TbMoonStars size={18} />}
        </ActionIcon>
        <Button
          color={dark ? "blue" : "dark"}
          radius="md"
          size="md"
          component={NextLink}
          href="/about"
          legacyBehavior
        >
          About
        </Button>
      </Flex>
    </Header>
  );
};
