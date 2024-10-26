import { HttpResponse } from "msw";
import type { Mutation, Query } from "@apiTypes";

type MutationFieldNames = Exclude<keyof Mutation, "__typename">;
type QueryFieldNames = Exclude<keyof Query, "__typename">;
type FieldNames = MutationFieldNames | QueryFieldNames;

type FieldTypes<T extends FieldNames> = T extends MutationFieldNames
  ? Mutation[T]
  : T extends QueryFieldNames
  ? Query[T]
  : never;

type TypeName<T extends { __typename?: string }> =
  | NonNullable<T["__typename"]>
  | "UnsupportedType";

export type TypeNames<T extends FieldNames> = TypeName<FieldTypes<T>>;

export const mswData = <T extends FieldNames>(
  fieldName: T,
  typename: TypeNames<T>,
  data: object = {}
) => {
  return HttpResponse.json({
    data: {
      [fieldName]: { __typename: typename, ...data },
    } as Record<T, FieldTypes<T>>,
  });
};

export const mswErrors = (error: Error, responseInit: ResponseInit = {}) => {
  return HttpResponse.json({ errors: [error] }, { ...responseInit });
};
