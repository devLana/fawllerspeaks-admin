import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import MetadataPostTags from "..";
import * as mocks from "./MetadataPostTags.mocks";
import { renderUI } from "@utils/tests/renderUI";

describe("MetadataPostTags UI", () => {
  const UI = (props: mocks.Props) => (
    <MetadataPostTags {...props}>
      <div>Post tags combobox</div>
    </MetadataPostTags>
  );

  describe("Initial render", () => {
    it("Expect the loading icon to be rendered", () => {
      renderUI(<UI loading={true} data={undefined} error={undefined} />);

      expect(screen.getByLabelText(mocks.loading)).toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.queryByText(mocks.combobox)).not.toBeInTheDocument();
    });
  });

  describe("Post tags API request failed", () => {
    it.each(mocks.alerts)("%s", (_, props, msg) => {
      renderUI(<UI {...props} />);

      expect(screen.queryByLabelText(mocks.loading)).not.toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent(msg);
      expect(screen.queryByText(mocks.combobox)).not.toBeInTheDocument();
    });
  });

  describe("User authentication API error response", () => {
    it.each(mocks.errors)("%s", (_, data, mock) => {
      const router = useRouter();
      router.pathname = mock.pathname;

      renderUI(<UI loading={false} data={data} error={undefined} />);

      expect(screen.getByLabelText(mocks.loading)).toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.queryByText(mocks.combobox)).not.toBeInTheDocument();
      expect(router.replace).toHaveBeenCalledOnce();
      expect(router.replace).toHaveBeenCalledWith(mock.params);
    });
  });

  describe("Post tags data API response", () => {
    it("Expect the combobox input to be rendered", () => {
      renderUI(<UI {...mocks.dataProps} />);

      expect(screen.queryByLabelText(mocks.loading)).not.toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.getByText(mocks.combobox)).toBeInTheDocument();
    });
  });
});
