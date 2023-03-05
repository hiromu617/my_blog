import { Data } from "./../pages/api/ogpData";
import { convertToHTMLString } from "@hiromu617/markdown-parser";
import { getDomainFromUrl } from "./getDomainFromUrl";

const getOgpData = async (rawUrls: string[]): Promise<Data> => {
  const searchParams = new URLSearchParams();
  rawUrls.forEach((rawUrl) => searchParams.append("urls", rawUrl));
  const res = await fetch("/api/ogpData/?" + searchParams.toString());
  const json: Data = await res.json();

  return json;
};

export const convertToHtmlWithOgpCard = async (markdown: string) => {
  const regUrl = /(?<!\()https?:\/\/[-_.!~*\\'()a-zA-Z0-9;\\/?:\\@&=+\\$,%#]+/g;
  const rawUrls = markdown.split("\n").filter((row) => row.match(regUrl));

  const { ogpData } = await getOgpData(rawUrls);

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
