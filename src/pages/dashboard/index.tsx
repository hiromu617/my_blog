import { Container } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { NextPage, InferGetServerSidePropsType } from "next";
import { DashboardArticleTable } from "@/features/Article/components/DashboardArticleTable";
import { ArticleWithTags } from "@/features/types";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const DashboardIndexPage: NextPage<Props> = ({ articles }) => {
  return (
    <Container size="md" pt={20}>
      <DashboardArticleTable articles={articles} />
    </Container>
  );
};

export default DashboardIndexPage;

export const getServerSideProps = async () => {
  const { data: articles, error } = await supabase
    .from("articles")
    .select(
      `
      *,
      tags (
        name,
        slug
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return {
    props: {
      articles: articles as ArticleWithTags[],
    },
  };
};
