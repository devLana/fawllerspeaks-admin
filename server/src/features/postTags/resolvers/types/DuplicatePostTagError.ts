import type {
  DuplicatePostTagError as ValidationError,
  DuplicatePostTagErrorResolvers as Resolvers,
  Status,
} from "@resolverTypes";

export class DuplicatePostTagError implements ValidationError {
  readonly status: Status;

  constructor(readonly message: string) {
    this.status = "ERROR";
  }
}

export const DuplicatePostTagErrorResolvers: Resolvers = {
  __isTypeOf: parent => parent instanceof DuplicatePostTagError,
};
