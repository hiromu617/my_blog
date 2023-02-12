import { supabase } from "@/lib/supabaseClient";
import { InferGetServerSidePropsType } from "next";
import { useAddTagsToArticle } from "@/features/Article/hooks/useAddTagsToArticle";
import { useAddNewArticle } from "@/features/Article/hooks/useAddNewArticle";
import { assertExists } from "@/utils/assert";
import { showNotification } from "@mantine/notifications";
import { useTriggerDeploy } from "@/hooks/useTriggerDeploy";
import { articleSchema } from "@/features/Article/schema/articleSchema";
import { z } from "zod";
import { useCallback, ReactElement } from "react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Editor } from "@/features/Article/components/Editor";
import type { NextPageWithLayout } from "next";
type ArticleParams = z.infer<typeof articleSchema>;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const NewArticlePage: NextPageWithLayout<Props> = ({ tags }) => {
  const { addNewArticle } = useAddNewArticle();
  const { addTagsToArticle } = useAddTagsToArticle();
  const { trigger } = useTriggerDeploy();

  const handlePublishNewArticle = useCallback(
    async (
      articleParams: ArticleParams,
      tagIds: number[],
      isToPublish: boolean
    ) => {
      const { newArticle, error } = await addNewArticle(
        articleParams,
        isToPublish
      );

      if (error) {
        alert(error.message);
        return;
      }
      assertExists(newArticle);

      const { error: errorOnCreateRelation } = await addTagsToArticle({
        tagIds: tagIds,
        articleId: newArticle.id,
      });

      if (errorOnCreateRelation) {
        alert(errorOnCreateRelation.message);
        return;
      }
      showNotification({
        title: "success",
        message: "",
      });
      trigger();
    },
    [addNewArticle, addTagsToArticle, trigger]
  );

  return (
    <Editor
      tags={tags ?? []}
      lsKey="new-article"
      handleSubmit={handlePublishNewArticle}
    />
  );
};

NewArticlePage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default NewArticlePage;

export const getServerSideProps = async () => {
  const { data: tags } = await supabase.from("tags").select("*");

  return {
    props: {
      tags,
    },
  };
};
