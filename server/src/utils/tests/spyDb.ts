import { jest } from "@jest/globals";

import { db } from "@lib/db";

interface Res {
  rows: object[];
}

const spyDb = (value: Res) => {
  const spy = jest.spyOn(db, "query") as jest.SpiedFunction<() => Res>;
  spy.mockReturnValueOnce(value).mockName("DB_Spy");

  return spy;
};

export default spyDb;
