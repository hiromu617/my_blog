import type { Database } from "@/types/schema";

export type Article = Database["public"]["Tables"]["articles"]["Row"];
