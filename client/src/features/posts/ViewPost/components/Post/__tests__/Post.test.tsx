import { screen, within } from "@testing-library/react";

import Post from "..";
import { formatPostDate } from "@utils/posts/formatPostDate";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./Post.mocks";

vi.mock("@features/posts/components/PostViewHeader");

describe("Blog Post", () => {
  it("Should render all the provided blog post details", () => {
    renderUI(<Post label="View post page" post={mocks.post1} />);

    expect(screen.getByText(mocks.status)).toBeInTheDocument();
    expect(screen.getByRole("heading", mocks.heading)).toBeInTheDocument();
    expect(screen.getByRole("button", mocks.menuBtn)).toBeInTheDocument();

    const aside = screen.getByRole("complementary");
    const metadata = within(aside).getByRole("list", mocks.metadataList);

    expect(within(metadata).getAllByRole("listitem")[0]).toHaveTextContent(
      mocks.post1.description
    );

    expect(within(metadata).getAllByRole("listitem")[1]).toHaveTextContent(
      mocks.post1.excerpt
    );

    expect(within(metadata).getAllByRole("listitem")[2]).toHaveTextContent(
      formatPostDate(mocks.post1.datePublished)
    );

    expect(within(metadata).getAllByRole("listitem")[3]).toHaveTextContent(
      formatPostDate(mocks.post1.lastModified)
    );

    expect(within(metadata).getAllByRole("listitem")[4]).toHaveTextContent(
      mocks.post1.url.slug
    );

    expect(within(metadata).getAllByRole("listitem")[5]).toHaveTextContent(
      mocks.post1.url.href
    );

    expect(within(metadata).getAllByRole("listitem")[6]).toHaveTextContent(
      new Intl.NumberFormat("en-US").format(mocks.post1.views)
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
      formatPostDate(mocks.post1.dateCreated)
    );

    const content = within(article).getByRole("region", mocks.content);

    expect(content).toContainHTML(mocks.post1.content.html);
  });

  it("Should render a binned post", () => {
    renderUI(<Post label="View post page" post={mocks.post2} />);

    expect(screen.queryByRole("button", mocks.menuBtn)).not.toBeInTheDocument();

    const article = screen.getByRole("article");
    const alertStatus = screen.getByRole("status");

    expect(article).toContainElement(alertStatus);
  });
});
