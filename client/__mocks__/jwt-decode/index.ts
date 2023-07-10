export default jest
  .fn(() => ({ exp: Date.now() + 24 * 60 * 60 }))
  .mockName("jwt-decode");

export class InvalidTokenError extends Error {}
