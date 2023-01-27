import type { Database } from "@/types/schema";
import { supabase } from "@/lib/supabaseClient";

export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];

export type ArticleWithTags = Article & { tags: Pick<Tag, "name" | "slug">[] };
