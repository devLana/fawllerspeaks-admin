import type { EmptyBinWarning as Error, Status } from "@resolverTypes";

export class EmptyBinWarning implements Error {
  readonly status: Status;
  readonly __typename: "EmptyBinWarning";

  constructor(public readonly message: string) {
    this.status = "WARN";
    this.__typename = "EmptyBinWarning";
  }
}
