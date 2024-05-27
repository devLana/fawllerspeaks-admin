import { describe, expect, it } from "@jest/globals";
import { anchorTagRegex, anchorTagReplacerFn } from ".";

describe("Posts | Anchor tag replacer function", () => {
  const testStr1 =
    '<p>paragraph text</p><a href="/relative/link">relative link content</a>';

  const testStr2 =
    '<h2>heading text 2</h2><p>paragraph text and a link: <a href="absolute/internal/link">absolute internal link</a></p>';

  const testData1 = {
    input:
      '<h2>heading text</h2><figure class="class-name"><a href="google.com"><img src="/image/src" /></a></figure>',
    output:
      '<h2>heading text</h2><figure class="class-name"><a href="https://google.com" target="_blank" rel="noopener noreferrer"><img src="/image/src" /></a></figure>',
  };

  const testData2 = {
    input:
      '<h2>heading 2</h2><p>text <a href="www.google.com">first anchor tag</a></p><h3>heading 3</h3><p><a href="https://fawllerspeaks.com/about">About Us</a></p>',
    output:
      '<h2>heading 2</h2><p>text <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">first anchor tag</a></p><h3>heading 3</h3><p><a href="https://fawllerspeaks.com/about">About Us</a></p>',
  };

  const testData3 = {
    input:
      '<a href="https://absolute-link.org">absolute link</a><h2><a href="fawllerspeaks.com/contact-us">contact us heading link</a></h2>',
    output:
      '<a href="https://absolute-link.org" target="_blank" rel="noopener noreferrer">absolute link</a><h2><a href="https://fawllerspeaks.com/contact-us">contact us heading link</a></h2>',
  };

  const testData4 = {
    input:
      '<p><a href="//some-link-url">some link url</a></p><h2>heading 2</h2><p><a href="////a-weird-link-url">weird link url</a></p>',
    output:
      '<p><a href="https://some-link-url" target="_blank" rel="noopener noreferrer">some link url</a></p><h2>heading 2</h2><p><a href="https:////a-weird-link-url" target="_blank" rel="noopener noreferrer">weird link url</a></p>',
  };

  it("Should replace the 'href', 'target' and 'rel' attributes of appropriate anchor tags", () => {
    const str1 = testStr1.replace(anchorTagRegex, anchorTagReplacerFn);
    expect(str1).toMatch(testStr1);

    const str2 = testStr2.replace(anchorTagRegex, anchorTagReplacerFn);
    expect(str2).toMatch(testStr2);

    const str3 = testData1.input.replace(anchorTagRegex, anchorTagReplacerFn);
    expect(str3).toMatch(testData1.output);

    const str4 = testData2.input.replace(anchorTagRegex, anchorTagReplacerFn);
    expect(str4).toBe(testData2.output);

    const str5 = testData3.input.replace(anchorTagRegex, anchorTagReplacerFn);
    expect(str5).toBe(testData3.output);

    const str6 = testData4.input.replace(anchorTagRegex, anchorTagReplacerFn);
    expect(str6).toBe(testData4.output);
  });
});
