const getPostSlug = (title: string) => {
  const regex =
    /let's|it's|s's|'s|won't|n't|'\p{L}{1,5}|(?: *[^\p{L}\p{N}]+ *)+/gu;

  return title
    .toLowerCase()
    .replace(regex, (match, ...rest: [number, string]) => {
      const [, titleStr] = rest;

      if (match === "let's") return "let-us";
      if (match === "it's") return "it-is";
      if (match === "s's" || match === "'s") return "s";

      if (match === "won't") {
        return titleStr.startsWith(match) ? "won-t" : "will-not";
      }

      if (match === "n't") return "-not";

      if (match.includes("'")) {
        if (match.includes("'re")) return "-are";
        if (match.includes("'ll")) return "-will";
        if (match.includes("'ve")) return "-have";

        return "";
      }

      return "-";
    })
    .replace(/^-+|-+$/g, "");
};

export default getPostSlug;
