import { assertExists } from "@/utils/assert";

// TODO：APIにラップする
export const useTriggerDeploy = () => {
  const url = process.env.NEXT_PUBLIC_VERCEL_DEPLOY_HOOK_URL;
  assertExists(url);

  const trigger = async () => {
    if (process.env.NODE_ENV === "development") return;
    const res = await fetch(url, { method: "POST" });
    console.log(res);
  };

  return { trigger };
};
