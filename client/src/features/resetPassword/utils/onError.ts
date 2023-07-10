import type { Router } from "next/router";
import type { ApolloError } from "@apollo/client";

export const onError = (err: ApolloError, push: Router["push"]) => {
  if (err.graphQLErrors[0]) {
    void push("/forgot-password?status=api");
  } else {
    void push("/forgot-password?status=network");
  }
};
