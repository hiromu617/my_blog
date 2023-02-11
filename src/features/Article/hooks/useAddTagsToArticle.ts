import { supabase } from "@/lib/supabaseClient";
import { useCallback } from "react";

export const useAddTagsToArticle = () => {
  const addTagsToArticle = useCallback(
    async (params: { tagIds: number[]; articleId: number }) => {
      const { error } = await supabase.from("article_tags").insert(
        params.tagIds.map((tag_id) => ({
          tag_id,
          article_id: params.articleId,
        }))
      );

      return { error };
    },
    []
  );

  return { addTagsToArticle };
};
