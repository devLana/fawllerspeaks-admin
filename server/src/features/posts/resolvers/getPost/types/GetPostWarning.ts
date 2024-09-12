import type {
  GetPostWarning as Warning,
  GetPostWarningResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class GetPostWarning implements Warning {
  readonly status: Status;

  constructor(readonly message: string) {
    this.status = "WARN";
  }
}

export const GetPostWarningResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof GetPostWarning,
};
