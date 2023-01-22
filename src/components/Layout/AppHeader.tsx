import { FC } from "react";
import {
  Button,
  Header,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { TbSun, TbMoonStars } from "react-icons/tb";
import { NextLink } from "@mantine/next";

export const AppHeader: FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
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
        color={dark ? "yellow" : "blue"}
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
        size="lg"
      >
        {dark ? <TbSun size={18} /> : <TbMoonStars size={18} />}
      </ActionIcon>
    </Header>
  );
};
