import openGraphScraper from "open-graph-scraper";
import type { NextApiRequest, NextApiResponse } from "next";
import { assertExists } from "@/utils/assert";

type Data = {
  ogpData: (OgpData | null)[];
};

type OgpData = {
  title: string;
  description: string;
  image: ImageObject | null;
  requestUrl: string;
};

type ImageObject = {
  height?: string | number;
  type: string;
  url: string;
  width?: string | number;
};

const isArray = <T>(maybeArray: T | readonly T[]): maybeArray is T[] => {
  return Array.isArray(maybeArray);
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

  const response: (OgpData | null)[] = [];

  await Promise.all(
    urls.map(async (url) => {
      try {
        const { result, error } = await openGraphScraper({
          url,
          onlyGetOpenGraphInfo: true,
        });

        console.log(result);

        if (result.success && !error) {
          const image = result.ogImage as ImageObject;

          if (!result.ogTitle || !result.ogDescription || !result.requestUrl)
            return response.push(null);

          const ogpData = {
            title: result.ogTitle as string,
            description: result.ogDescription as string,
            image: image ?? null,
            requestUrl: result.requestUrl,
          };
          response.push(ogpData);
        } else {
          response.push(null);
        }
      } catch {
        response.push(null);
      }
    })
  );

  res.status(200).json({ ogpData: response });
}
