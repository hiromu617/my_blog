import { FC } from "react";
import { useMantineColorScheme, Pagination } from "@mantine/core";
export const AppPagination: FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return <Pagination total={10} color={dark ? "blue" : "dark"} radius="md" />;
};
