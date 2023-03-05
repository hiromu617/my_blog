import { convertToHTMLString } from "@hiromu617/markdown-parser";

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

const getDomainFromUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  let result;
  let match;
  match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im);
  if (match) {
    result = match[1];
    match = result.match(/^[^.]+\.(.+\..+)$/);
    if (match) {
      result = match[1];
    }
  }
  return result;
};

export const convertToHtmlWithOgpCard = async (markdown: string) => {
  const regUrl = /(?<!\()https?:\/\/[-_.!~*\\'()a-zA-Z0-9;\\/?:\\@&=+\\$,%#]+/g;
  const rawUrls = markdown.split("\n").filter((row) => row.match(regUrl));
  console.log(rawUrls)

  const searchParams = new URLSearchParams();
  rawUrls.forEach((rawUrl) => searchParams.append("urls", rawUrl));

  const res = await fetch("/api/ogpData/?" + searchParams.toString());
  const json: Data = await res.json();
  const ogpData = json.ogpData;

  let html = convertToHTMLString(markdown);

  rawUrls.forEach((rawUrl, i) => {
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
