import { Center, Container } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { NextPage, InferGetStaticPropsType } from "next";
import { ArticleList } from "@/features/Article/components/ArticleList";
import { AppPagination } from "@/components/Layout/AppPagination";
import { assertExists } from "@/utils/assert";
import { PAGE_SIZE } from "@/const";
import { ArticleWithTags } from "@/features/types";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const IndexPage: NextPage<Props> = ({ articles, totalCount }) => {
  return (
    <Container size="xs" pt={20}>
      <ArticleList articles={articles} />
      <Center my={20}>
        <AppPagination totalCount={totalCount} />
      </Center>
    </Container>
  );
};

export default IndexPage;

export const getStaticProps = async () => {
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
    .range(0, PAGE_SIZE - 1);

  if (error) {
    console.error(error);
  }

  assertExists(count);

  return {
    props: {
      articles: articles as ArticleWithTags[],
      totalCount: count,
    },
  };
};
