import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import GetPost from "..";
import { renderUI } from "@utils/tests/renderUI";
import * as mocks from "./GetPost.mocks";

vi.mock("../PostWrapper");

describe("Get Blog Post", () => {
  const UI = ({ data, error, loading }: mocks.UIProps) => (
    <GetPost loading={loading} data={data} error={error} {...mocks.uiProps}>
      {() => <div>Post component</div>}
    </GetPost>
  );

  describe("Loading progressbar", () => {
    it("Expect the loading progressbar if the query object has not yet been populated", () => {
      const router = useRouter();
      router.isReady = false;

      renderUI(<UI data={undefined} error={undefined} loading={false} />);
      expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();

      router.isReady = true;
    });

    it("Expect the loading progressbar during the post query API request", () => {
      renderUI(<UI data={undefined} error={undefined} loading />);
      expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();
    });
  });

  describe("API request gets an error response", () => {
    it.each(mocks.errors)("%s", (_, error, message) => {
      renderUI(<UI data={undefined} error={error} loading={false} />);

      expect(
        screen.queryByRole("progressbar", mocks.load)
      ).not.toBeInTheDocument();

      expect(screen.getByRole("status")).toHaveTextContent(message);
    });

    it.each(mocks.alerts)("%s", (_, data, message) => {
      renderUI(<UI data={data} error={undefined} loading={false} />);

      expect(
        screen.queryByRole("progressbar", mocks.load)
      ).not.toBeInTheDocument();

      expect(screen.getByRole("status")).toHaveTextContent(message);
    });
  });

  describe("API request gets a user authentication error response", () => {
    it.each(mocks.redirects)("%s", (_, params, data) => {
      const router = useRouter();
      router.asPath = params.asPath;

      renderUI(<UI data={data} error={undefined} loading={false} />);

      expect(router.replace).toHaveBeenCalledOnce();
      expect(router.replace).toHaveBeenCalledWith(params.url);
      expect(screen.getByRole("progressbar", mocks.load)).toBeInTheDocument();
    });
  });

  describe("API returns with post data", () => {
    it("Expect the post component to be rendered", () => {
      renderUI(<UI data={mocks.post} error={undefined} loading={false} />);

      expect(
        screen.queryByRole("progressbar", mocks.load)
      ).not.toBeInTheDocument();

      expect(screen.getByText(/^post component$/i)).toBeInTheDocument();
    });
  });
});
