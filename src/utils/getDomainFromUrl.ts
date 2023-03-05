export const getDomainFromUrl = (url: string | undefined): string | undefined => {
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
