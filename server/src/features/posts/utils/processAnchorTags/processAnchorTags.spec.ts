import { describe, expect, it } from "@jest/globals";
import { processAnchorTags } from ".";

describe("Posts | Anchor tag Processor", () => {
  const testStr1 =
    '<p>paragraph text</p><a href="/relative/link">relative link content</a>';

  const testStr2 =
    '<h2>heading text 2</h2><p>paragraph text and a link: <a href="absolute/internal/link">absolute internal link</a></p>';

  const testData1 = {
    input:
      '<h2>heading text</h2><figure class="class-name"><a href="google.com"><img src="/image/src" /></a></figure>',
    output:
      '<h2>heading text</h2><figure class="class-name"><a href="https://google.com" target="_blank" rel="noopener noreferrer"><img src="/image/src"></a></figure>',
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
      '<p><a href="//some-link-url">some link url</a></p><hr /><h2>heading 2</h2><p><a href="////a-weird-link-url">weird link url</a></p>',
    output:
      '<p><a href="https://some-link-url" target="_blank" rel="noopener noreferrer">some link url</a></p><hr><h2>heading 2</h2><p><a href="https:////a-weird-link-url" target="_blank" rel="noopener noreferrer">weird link url</a></p>',
  };

  it("Should replace the 'href', 'target' and 'rel' attributes of all appropriate anchor tags", () => {
    const str1 = processAnchorTags(testStr1);
    expect(str1).toMatch(testStr1);

    const str2 = processAnchorTags(testStr2);
    expect(str2).toMatch(testStr2);

    const str3 = processAnchorTags(testData1.input);
    expect(str3).toMatch(testData1.output);

    const str4 = processAnchorTags(testData2.input);
    expect(str4).toBe(testData2.output);

    const str5 = processAnchorTags(testData3.input);
    expect(str5).toBe(testData3.output);

    const str6 = processAnchorTags(testData4.input);
    expect(str6).toBe(testData4.output);
  });
});
