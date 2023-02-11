import { supabase } from "@/lib/supabaseClient";
import { articleSchema } from "@/features/Article/schema/articleSchema";
import { z } from "zod";
import { useCallback } from "react";
type ArticleParams = z.infer<typeof articleSchema>;

export const usePublishNewArticle = () => {
  const publishNewArticle = useCallback(async (params: ArticleParams) => {
    const { data: articles, error } = await supabase
      .from("articles")
      .insert({
        ...params,
        published_at: new Date().toLocaleString(),
      })
      .select();

    return { newArticle: articles?.[0], error };
  }, []);

  return { publishNewArticle };
};
