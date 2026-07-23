import type {
  RefreshData as RefreshDataResponse,
  Status,
} from "@appTypes/resolverTypes";

export class RefreshData implements RefreshDataResponse {
  readonly status: Status;
  readonly __typename: "RefreshData";

  constructor(readonly accessToken: string) {
    this.status = "SUCCESS";
    this.__typename = "RefreshData";
  }
}
