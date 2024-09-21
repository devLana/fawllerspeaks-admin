import { formatPostDate } from ".";

describe("Post Date Format Function", () => {
  it("When a date string is provided, Expect the result to match {Day Month Date, Year}", () => {
    const result = formatPostDate("2021-05-17T12:22:43.717Z");
    expect(result).toMatch("Monday May 17, 2021");
  });
});
