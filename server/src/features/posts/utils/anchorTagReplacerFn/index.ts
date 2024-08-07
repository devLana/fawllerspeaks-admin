interface Groups {
  url: string | undefined;
  content: string | undefined;
}

type SorU = string | undefined;
type ReplaceParams = [SorU, SorU, number, string, Groups];

export const anchorTagRegex =
  /<a href=(['"])(?<url>.*?)\1>(?<content>.+?)<\/a>/gi;

export const anchorTagReplacerFn = (match: string, ...rest: ReplaceParams) => {
  const groups = rest.at(-1) as Groups;
  const { content, url } = groups;

  if (!content || !url) return match;

  let href = url;

  if (/^(?:w{3}\.)?[^/]+?(?=\.[a-z]{2,4})/i.test(url)) {
    href = `https://${url}`;
  } else if (url.startsWith("//")) {
    href = `https:${url}`;
  }

  let isExternalLink = false;

  if (href.startsWith("http") && !href.includes("fawllerspeaks.com")) {
    isExternalLink = true;
  }

  const aAttributes = ' target="_blank" rel="noopener noreferrer"';
  const attributes = isExternalLink ? aAttributes : "";

  return `<a href="${href}"${attributes}>${content}</a>`;
};
