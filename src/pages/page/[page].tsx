import { Center, Container } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { NextPage, InferGetStaticPropsType } from "next";
import { ArticleList } from "@/features/Article/components/ArticleList";
import { AppPagination } from "@/components/Layout/AppPagination";
import { assertExists } from "@/utils/assert";
import { ArticleWithTags } from "@/features/types";
import { PAGE_SIZE } from "@/const";

const range = (start: number, end: number) =>
  [...Array(end - start + 1)].map((_, i) => start + i);

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const PageIndexPage: NextPage<Props> = ({ articles, totalCount }) => {
  return (
    <Container size="xs">
      <ArticleList articles={articles} />
      <Center my={20}>
        <AppPagination totalCount={totalCount} />
      </Center>
    </Container>
  );
};

export default PageIndexPage;

export const getStaticPaths = async () => {
  const { count } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .not("published_at", "is", null);
  assertExists(count);

  const paths = range(2, Math.ceil(count / PAGE_SIZE)).map(
    (repo) => `/page/${repo}`
  );

  return { paths, fallback: false };
};

export const getStaticProps = async (context: any) => {
  const page = context.params.page;
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;
  const {
    data: articles,
    error,
    count,
  } = await supabase
    .from("articles")
    .select(
      `
    *,
    tags (
      name,
      slug
    )
  `,
      { count: "exact" }
    )
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .range(start, end);

  assertExists(count);

  return {
    props: {
      articles: articles as ArticleWithTags[],
      totalCount: count,
    },
  };
};
