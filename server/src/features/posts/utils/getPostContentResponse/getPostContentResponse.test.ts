import { expect, test } from "@jest/globals";

import { getPostContentResponse } from ".";

test.each([
  [
    "a simple text string that isn't an html string",
    {
      html: "a simple text string that isn't an html string",
      tableOfContents: null,
    },
  ],
  [
    "<h2>Heading 2</h2><p>Paragraph one</p><p>Another paragraph</p><h3>Heading #3</h3><p>paragraph three</p><p>paragraph four</p><h2>Closing_Heading Text.</h2><p>Closing paragraph</p>",
    {
      html: '<h2 id="heading-2">Heading 2</h2><p>Paragraph one</p><p>Another paragraph</p><h3 id="heading-3">Heading #3</h3><p>paragraph three</p><p>paragraph four</p><h2 id="closing-heading-text">Closing_Heading Text.</h2><p>Closing paragraph</p>',
      tableOfContents: [
        { heading: "Heading 2", level: 2, href: "#heading-2" },
        { heading: "Heading #3", level: 3, href: "#heading-3" },
        {
          heading: "Closing_Heading Text.",
          level: 2,
          href: "#closing-heading-text",
        },
      ],
    },
  ],
  [
    '<p>Paragraph 1</p><img src="src" /><strong>strong text</strong><em>Emphasized text</em><p>closing paragraph</p>',
    {
      html: '<p>Paragraph 1</p><img src="src" /><strong>strong text</strong><em>Emphasized text</em><p>closing paragraph</p>',
      tableOfContents: null,
    },
  ],
])(
  "Posts | Should return a PostContent response object from the given content string",
  (content, expected) => {
    const result = getPostContentResponse(content);
    expect(result).toStrictEqual(expected);
  }
);
