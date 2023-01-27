import { Center, Container } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { NextPage, InferGetStaticPropsType } from "next";
import { ArticleList } from "@/features/Article/components/ArticleList";
import { AppPagination } from "@/components/Layout/AppPagination";
import { useMediaQuery } from "@mantine/hooks";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const IndexPage: NextPage<Props> = ({ articles }) => {
  const isSP = useMediaQuery("(max-width: 576px)");

  return (
    <Container size="xs" p={isSP ? 0 : undefined}>
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
