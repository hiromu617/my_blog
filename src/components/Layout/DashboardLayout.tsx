import { FC, ReactNode } from "react";
import { AppShell, Navbar, NavLink } from "@mantine/core";
import { AppHeader } from "./AppHeader";
import { NextLink } from "@mantine/next";

type Props = {
  children: ReactNode;
};
export const DashboardLayout: FC<Props> = ({ children }) => {
  return (
    <AppShell
      header={<AppHeader />}
      navbar={
        <Navbar width={{ base: 250 }} height="full" p="xs">
          <Navbar.Section mt="xs">
            <NavLink
              label="記事一覧"
              component={NextLink}
              href="/dashboard"
              legacyBehavior
            />
          </Navbar.Section>
          <Navbar.Section mt="xs">
            <NavLink
              label="新しい記事"
              component={NextLink}
              href="/dashboard/articles/new"
              legacyBehavior
            />
          </Navbar.Section>
          <Navbar.Section mt="xs">
            <NavLink
              label="タグ一覧"
              component={NextLink}
              href="/dashboard"
              legacyBehavior
            />
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : "#fff",
        },
      })}
    >
      {children}
    </AppShell>
  );
};
