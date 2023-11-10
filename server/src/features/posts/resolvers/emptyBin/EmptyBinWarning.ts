import type {
  EmptyBinWarning as Error,
  EmptyBinWarningResolvers,
  Status,
} from "@resolverTypes";

export class EmptyBinWarning implements Error {
  readonly status: Status;

  constructor(public readonly message: string) {
    this.status = "WARN";
  }
}

export const EmptyBinWarningResolver: EmptyBinWarningResolvers = {
  __isTypeOf: parent => parent instanceof EmptyBinWarning,
};
