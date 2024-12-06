import * as cheerio from "cheerio";

export const processAnchorTags = (html: string) => {
  const $ = cheerio.load(html, { xml: { xmlMode: true } }, false);

  $("a").each((_, anchorElement) => {
    const $a = $(anchorElement);
    let href = $a.attr("href");

    if (href) {
      if (/^(?:w{3}\.)?[^/]+?(?=\.[a-z]{2,4})/i.test(href)) {
        href = `https://${href}`;
      } else if (href.startsWith("//")) {
        href = `https:${href}`;
      }

      if (href.startsWith("http") && !href.includes("fawllerspeaks.com")) {
        $a.attr("target", "_blank");
        $a.attr("rel", "noopener noreferrer");
      }

      $a.attr("href", href);
    }
  });

  return $.html();
};
