import { InferGetServerSidePropsType, NextPage } from "next";
import { assertExists } from "@/utils/assert";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";
import { useCallback, ReactElement } from "react";
import { Editor } from "@/features/Article/components/Editor";
import { ArticleWithTagsForEdit } from "@/features/types";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { useAddTagsToArticle } from "@/features/Article/hooks/useAddTagsToArticle";
import { useTriggerDeploy } from "@/hooks/useTriggerDeploy";
import { articleSchema } from "@/features/Article/schema/articleSchema";
import { useDeleteTagsOnArticle } from "@/features/Article/hooks/useDeleteTagsOnArticle";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import type { NextPageWithLayout } from "next";

type ArticleParams = z.infer<typeof articleSchema>;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const ArticleEditPage: NextPageWithLayout<Props> = ({
  article,
  tags,
  slug,
}) => {
  const router = useRouter();
  const { trigger } = useTriggerDeploy();
  const { addTagsToArticle } = useAddTagsToArticle();
  const { deleteTagsOnArticle } = useDeleteTagsOnArticle();

  const handleUpdateArticle = useCallback(
    async (articleParams: ArticleParams, tagIds: number[]) => {
      const { data, error } = await supabase
        .from("articles")
        .update({
          ...articleParams,
          published_at: !article.published_at
            ? new Date().toLocaleString()
            : undefined,
        })
        .eq("slug", slug);
      if (error) {
        alert(error.message);
        return;
      }
      const newTagIds = tagIds;
      const oldTagIds = article.tags.map((t) => t.id);
      const addIds = newTagIds.filter((i) => oldTagIds.indexOf(i) == -1);
      const removeIds = oldTagIds.filter((i) => newTagIds.indexOf(i) == -1);

      if (addIds.length > 0) {
        const { error: errorOnCreateRelation } = await addTagsToArticle({
          tagIds: addIds,
          articleId: article.id,
        });

        if (errorOnCreateRelation) {
          alert(errorOnCreateRelation.message);
          return;
        }
      }

      if (removeIds.length > 0) {
        const { error: errorOnDeleteRelation } = await deleteTagsOnArticle({
          tagIds: removeIds,
          articleId: article.id,
        });

        if (errorOnDeleteRelation) {
          alert(errorOnDeleteRelation.message);
          return;
        }
      }

      showNotification({
        title: "success",
        message: "",
      });
      trigger();
      router.push("/dashboard");
    },
    [slug, router, trigger, article, addTagsToArticle, deleteTagsOnArticle]
  );

  return (
    <Editor
      tags={tags ?? []}
      lsKey={article.slug}
      initialTitle={article.title}
      initialContent={article.content}
      initialSlug={article.slug}
      initialTagIds={article.tags.map((t) => t.id)}
      handleSubmit={handleUpdateArticle}
      isEdit
    />
  );
};

ArticleEditPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default ArticleEditPage;

export const getServerSideProps = async (context: any) => {
  const slug = z.string().parse(context.params.slug);
  const { data: articles, error } = await supabase
    .from("articles")
    .select(
      `
    *,
    tags (
      id,
      name,
      slug
    )
  `
    )
    .eq("slug", slug);
  const { data: tags } = await supabase.from("tags").select("*");

  assertExists(articles?.[0]);

  const article = articles[0];

  return {
    props: {
      article: article as ArticleWithTagsForEdit,
      tags,
      slug,
    },
  };
};
