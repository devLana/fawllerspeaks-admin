import type { QueryGetPostsArgs } from "@apiTypes";

type Keys = keyof QueryGetPostsArgs;

const objectsAreEqual = (
  fieldVariables: QueryGetPostsArgs,
  pageVariables: QueryGetPostsArgs
): boolean => {
  const fieldKeys = Object.keys(fieldVariables) as Keys[];
  const pageKeys = Object.keys(pageVariables) as Keys[];

  if (fieldKeys.length !== pageKeys.length) return false;

  return fieldKeys.every(key => {
    return (
      Object.hasOwn(fieldVariables, key) &&
      pageVariables[key] === fieldVariables[key]
    );
  });
};

export default objectsAreEqual;
