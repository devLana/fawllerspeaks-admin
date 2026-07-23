import type {
  EditProfileValidationError as Errors,
  Status,
} from "@appTypes/resolverTypes";

export class EditProfileValidationError implements Errors {
  readonly status: Status;
  readonly __typename: "EditProfileValidationError";

  constructor(
    readonly firstNameError?: string,
    readonly lastNameError?: string,
    readonly imageError?: string,
  ) {
    this.status = "ERROR";
    this.__typename = "EditProfileValidationError";
  }
}
