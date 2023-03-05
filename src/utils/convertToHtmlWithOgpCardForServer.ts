import { convertToHTMLString } from "@hiromu617/markdown-parser";
import { getDomainFromUrl } from "./getDomainFromUrl";
import { Data } from "./../pages/api/ogpData";

export type OgpData = {
  title: string;
  description: string;
  image: ImageObject | null;
  requestUrl: string;
};

export type ImageObject = {
  height?: string | number;
  type: string;
  url: string;
  width?: string | number;
};

export const getOgpDataForServer = async (rawUrls: string[]): Promise<Data> => {
  const response: (OgpData | null)[] = [];
  const openGraphScraper = require('open-graph-scraper')

  await Promise.all(
    rawUrls.map(async (url) => {
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

  return { ogpData: response };
};

export const convertToHtmlWithOgpCardForServer = async (markdown: string) => {
  const regUrl = /(?<!\()https?:\/\/[-_.!~*\\'()a-zA-Z0-9;\\/?:\\@&=+\\$,%#]+/g;
  const rawUrls = markdown.split("\n").filter((row) => row.match(regUrl));

  const { ogpData } = await getOgpDataForServer(rawUrls);

  let html = convertToHTMLString(markdown);

  rawUrls.forEach((rawUrl) => {
    const ogp = ogpData.find((d) => d?.requestUrl === rawUrl);
    const domain = getDomainFromUrl(rawUrl);
    if (!ogp) {
      html = html.replaceAll(
        `<p>${rawUrl}</p>`,
        `<div><a href="${rawUrl}" target="_blank">${rawUrl}</a></div>`
      );
    } else {
      if (ogp.image) {
        html = html.replaceAll(
          `<p>${rawUrl}</p>`,
          `<a href='${rawUrl}' target="_blank" class="ogpCardWrapper"><div class="ogpCard"><img class="ogImg" src='${ogp.image.url}'/><div class="ogpContainer"><h1>${ogp.title}</h1><div class="ogpDesc">${ogp.description}</div><div class="domainContainer"><img class="favicon" src="https://www.google.com/s2/u/0/favicons?domain=${rawUrl}" alt="${rawUrl}"/><div>${domain}</div></div></div></div></a>`
        );
      } else {
        html = html.replaceAll(
          `<p>${rawUrl}</p>`,
          `<a href='${rawUrl}' target="_blank" class="ogpCardWrapper"><div class="ogpCard"><div class="ogpContainer"><h1>${ogp.title}</h1><div class="ogpDesc">${ogp.description}</div><div class="domainContainer"><img class="favicon" src="https://www.google.com/s2/u/0/favicons?domain=${rawUrl}" alt="${rawUrl}"/><div>${domain}</div></div></div></div></a>`
        );
      }
    }
  });

  return html;
};
