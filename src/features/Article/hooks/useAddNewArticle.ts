import { supabase } from "@/lib/supabaseClient";
import { articleSchema } from "@/features/Article/schema/articleSchema";
import { z } from "zod";
import { useCallback } from "react";
type ArticleParams = z.infer<typeof articleSchema>;

export const useAddNewArticle = () => {
  const addNewArticle = useCallback(
    async (params: ArticleParams, isToPublish: boolean) => {
      const { data: articles, error } = await supabase
        .from("articles")
        .insert({
          ...params,
          published_at: isToPublish ? new Date().toLocaleString() : undefined,
        })
        .select();

      return { newArticle: articles?.[0], error };
    },
    []
  );

  return { addNewArticle };
};
