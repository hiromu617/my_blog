import { Center, Container } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { NextPage, InferGetStaticPropsType } from "next";
import { ArticleList } from "@/features/Article/components/ArticleList";
import { AppPagination } from "@/components/Layout/AppPagination";
import { assertExists } from "@/utils/assert";
import { PAGE_SIZE } from "@/const";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const IndexPage: NextPage<Props> = ({ articles, totalCount }) => {
  return (
    <Container size="xs">
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
    .select("*", { count: "exact" })
    .not("published_at", "is", null)
    .order("published_at", { ascending: true })
    .range(0, PAGE_SIZE - 1);

  if (error) {
    console.error(error);
  }

  assertExists(count);

  return {
    props: {
      articles: articles ?? [],
      totalCount: count,
    },
  };
};
