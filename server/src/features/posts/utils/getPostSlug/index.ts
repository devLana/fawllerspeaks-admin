const getPostSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}']+/gu, " ")
    .trim()
    .split(" ")
    .reduce((slug, word, index, words) => {
      let newSlug: string;

      if (word === "won't") {
        newSlug = index === 0 ? "wont" : `${slug}will-not`;
      } else if (word === "it's") {
        newSlug = `${slug}it-is`;
      } else if (word === "let's") {
        newSlug = `${slug}let-us`;
      } else if (word.endsWith("s's")) {
        newSlug = `${slug}${word.replace("'s", "")}`;
      } else if (word.endsWith("n't")) {
        newSlug = `${slug}${word.replace("n't", "-not")}`;
      } else if (word.endsWith("'re")) {
        newSlug = `${slug}${word.replace("'re", "-are")}`;
      } else if (word.endsWith("'ll")) {
        newSlug = `${slug}${word.replace("'ll", "-will")}`;
      } else if (word.endsWith("'ve")) {
        newSlug = `${slug}${word.replace("'ve", "-have")}`;
      } else if (word.includes("'")) {
        newSlug = `${slug}${word.replace(/'/g, "")}`;
      } else {
        newSlug = `${slug}${word}`;
      }

      if (index !== words.length - 1) {
        newSlug += "-";
      }

      return newSlug;
    }, "");
};

export default getPostSlug;
