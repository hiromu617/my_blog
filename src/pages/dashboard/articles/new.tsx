import type { NextPage } from "next";
import { supabase } from "@/lib/supabaseClient";
import { InferGetServerSidePropsType } from "next";
import { useAddTagsToArticle } from "@/features/Article/hooks/useAddTagsToArticle";
import { usePublishNewArticle } from "@/features/Article/hooks/usePublishNewArticle";
import { assertExists } from "@/utils/assert";
import { showNotification } from "@mantine/notifications";
import { useTriggerDeploy } from "@/hooks/useTriggerDeploy";
import { articleSchema } from "@/features/Article/schema/articleSchema";
import { z } from "zod";
import { useCallback } from "react";
import { Editor } from "@/features/Article/components/Editor";
type ArticleParams = z.infer<typeof articleSchema>;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const NewArticlePage: NextPage<Props> = ({ tags }) => {
  const { publishNewArticle } = usePublishNewArticle();
  const { addTagsToArticle } = useAddTagsToArticle();
  const { trigger } = useTriggerDeploy();

  const handlePublishNewArticle = useCallback(
    async (articleParams: ArticleParams, tagIds: number[]) => {
      const { newArticle, error } = await publishNewArticle(articleParams);

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
    [publishNewArticle, addTagsToArticle, trigger]
  );

  return (
    <Editor
      tags={tags ?? []}
      lsKey="new-article"
      handleSubmit={handlePublishNewArticle}
    />
  );
};

export default NewArticlePage;

export const getServerSideProps = async () => {
  const { data: tags } = await supabase.from("tags").select("*");

  return {
    props: {
      tags,
    },
  };
};
