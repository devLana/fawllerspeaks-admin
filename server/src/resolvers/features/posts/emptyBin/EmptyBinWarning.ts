import type { Status } from "@appTypes/resolverTypes";

export class EmptyBinWarning {
  readonly status: Status;
  readonly __typename: "EmptyBinWarning";

  constructor(public readonly message: string) {
    this.status = "WARN";
    this.__typename = "EmptyBinWarning";
  }
}
