import { Center, Container } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { NextPage, InferGetStaticPropsType } from "next";
import { ArticleList } from "@/features/Article/components/ArticleList";
import { AppPagination } from "@/components/Layout/AppPagination";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const IndexPage: NextPage<Props> = ({ articles }) => {
  return (
    <Container size="xs">
      <ArticleList articles={articles} />
      <Center my={20}>
        <AppPagination />
      </Center>
    </Container>
  );
};

export default IndexPage;

export const getStaticProps = async () => {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: true });

  return {
    props: {
      articles: articles ?? [],
    },
  };
};
