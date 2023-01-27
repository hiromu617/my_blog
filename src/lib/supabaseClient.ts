import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/schema";

const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!API_KEY) throw new Error();

export const supabase = createClient<Database>(
  "https://yqdqmgyprsjygpoqoguf.supabase.co",
  API_KEY
);
