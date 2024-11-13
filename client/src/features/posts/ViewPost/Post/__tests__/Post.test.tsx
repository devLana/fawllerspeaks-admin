import { screen, within } from "@testing-library/react";

import Post from "..";
import { formatPostDate } from "@utils/posts/formatPostDate";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./Post.mocks";

describe("Blog Post", () => {
  it("Should render all the provided blog post details", () => {
    renderUI(<Post label="View post page" post={mocks.post} />);

    expect(screen.getByLabelText(mocks.status)).toBeInTheDocument();
    expect(screen.getByRole("heading", mocks.heading)).toBeInTheDocument();

    const aside = screen.getByRole("complementary");
    const metadata = within(aside).getByRole("list", mocks.metadataList);

    expect(within(metadata).getAllByRole("listitem")[0]).toHaveTextContent(
      mocks.post.description
    );

    expect(within(metadata).getAllByRole("listitem")[1]).toHaveTextContent(
      mocks.post.excerpt
    );

    expect(within(metadata).getAllByRole("listitem")[2]).toHaveTextContent(
      formatPostDate(mocks.post.datePublished)
    );

    expect(within(metadata).getAllByRole("listitem")[3]).toHaveTextContent(
      formatPostDate(mocks.post.lastModified)
    );

    expect(within(metadata).getAllByRole("listitem")[4]).toHaveTextContent(
      mocks.post.url.href
    );

    expect(within(metadata).getAllByRole("listitem")[5]).toHaveTextContent(
      new Intl.NumberFormat("en-US").format(mocks.post.views)
    );

    const tagsList = within(metadata).getByRole("list", mocks.tagsList);

    expect(within(tagsList).getAllByRole("listitem")[0]).toHaveTextContent(
      mocks.postTags[0]
    );

    expect(within(tagsList).getAllByRole("listitem")[1]).toHaveTextContent(
      mocks.postTags[1]
    );

    expect(within(tagsList).getAllByRole("listitem")[2]).toHaveTextContent(
      mocks.postTags[2]
    );

    expect(within(tagsList).getAllByRole("listitem")[3]).toHaveTextContent(
      mocks.postTags[3]
    );

    expect(within(tagsList).getAllByRole("listitem")[4]).toHaveTextContent(
      mocks.postTags[4]
    );

    expect(within(tagsList).getAllByRole("listitem")[5]).toHaveTextContent(
      mocks.postTags[5]
    );

    const tOC = within(aside).getByRole("list", mocks.tOC);

    expect(within(tOC).getAllByRole("listitem")[0]).toContainElement(
      screen.getByRole("link", mocks.link1)
    );

    expect(within(tOC).getAllByRole("listitem")[1]).toContainElement(
      screen.getByRole("link", mocks.link2)
    );

    const article = screen.getByRole("article");

    expect(article).toContainElement(screen.getByRole("img", mocks.img));
    expect(article).toContainElement(screen.getByRole("img", mocks.avatar));
    expect(article).toContainElement(screen.getByText(mocks.author));

    expect(within(article).getByRole("time")).toHaveTextContent(
      formatPostDate(mocks.post.dateCreated)
    );

    const content = within(article).getByRole("region", mocks.content);

    expect(content).toContainHTML(mocks.post.content.html);
  });
});
