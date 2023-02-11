import { Container } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { NextPage } from "next";
import { ReactElement } from "react";
import { DashboardArticleTable } from "@/features/Article/components/DashboardArticleTable";
import useSWR from "swr";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { ArticleWithTags } from "@/features/types";

const fetcher = async () => {
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
    throw new Error(error.message);
  }

  return articles as ArticleWithTags[];
};

const DashboardIndexPage = () => {
  const { data: articles, isLoading } = useSWR("/dashboard/articles", fetcher);

  return (
    <Container size="md" pt={20}>
      {isLoading || !articles ? (
        <>loading</>
      ) : (
        <DashboardArticleTable articles={articles} />
      )}
    </Container>
  );
};

DashboardIndexPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardIndexPage;
