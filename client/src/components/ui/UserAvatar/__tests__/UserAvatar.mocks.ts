import { initials, firstName, lastName, writeUser } from "@utils/tests/user";

export const name = { name: new RegExp(`${firstName} ${lastName} avatar`) };
export const initials_name = { name: new RegExp(initials) };
export const userWithImage = writeUser(true);
export const userWithoutImage = writeUser(false);
export { initials };
