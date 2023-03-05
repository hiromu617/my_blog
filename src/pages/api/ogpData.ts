import type { NextApiRequest, NextApiResponse } from "next";
import { assertExists } from "@/utils/assert";
import { getOgpDataForServer } from "@/utils/convertToHtmlWithOgpCardForServer";
import { OgpData } from "@/utils/convertToHtmlWithOgpCardForServer";

export type Data = {
  ogpData: (OgpData | null)[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // FIXME: use zod validation
  let urls: string[];
  assertExists(req.query.urls);
  if (Array.isArray(req.query.urls)) {
    urls = req.query.urls;
  } else {
    urls = [req.query.urls];
  }

  const response = await getOgpDataForServer(urls);

  res.status(200).json(response);
}
