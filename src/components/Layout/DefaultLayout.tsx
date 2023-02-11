import { FC, ReactNode } from "react";
import { AppShell } from "@mantine/core";
import { AppHeader } from "./AppHeader";

type Props = {
  children: ReactNode;
};
export const DefaultLayout: FC<Props> = ({ children }) => {
  return (
    <AppShell
      header={<AppHeader />}
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
