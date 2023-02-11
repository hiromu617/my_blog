import { supabase } from "@/lib/supabaseClient";
import { useCallback } from "react";

export const useDeleteTagsOnArticle = () => {
  const deleteTagsOnArticle = useCallback(
    async (params: { tagIds: number[]; articleId: number }) => {
      const { error } = await supabase
        .from("article_tags")
        .delete()
        .eq("article_id", params.articleId)
        .eq("tag_id", params.tagIds);

      return { error };
    },
    []
  );

  return { deleteTagsOnArticle };
};
