import { FC } from "react";
import { useMantineColorScheme, Pagination } from "@mantine/core";
import { useRouter } from "next/router";
import { PAGE_SIZE } from "@/const";

type Props = {
  totalCount: number;
  currentPage: number;
};
export const AppPagination: FC<Props> = ({ totalCount, currentPage }) => {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const total = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <Pagination
      total={total}
      page={currentPage}
      color={dark ? "blue" : "dark"}
      radius="md"
      onChange={(page) => {
        if (page === 1) return router.push("/");
        router.push(`/page/${page}`);
      }}
    />
  );
};
