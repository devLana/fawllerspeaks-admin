import type {
  GetPostValidationErrorResolvers as Resolvers,
  GetPostValidationError as Error,
  Status,
} from "@resolverTypes";

export class GetPostValidationError implements Error {
  readonly status: Status;

  constructor(readonly slugError: string) {
    this.status = "ERROR";
  }
}

export const GetPostValidationErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof GetPostValidationError,
};
