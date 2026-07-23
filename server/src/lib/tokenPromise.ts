import jwt, { type JwtPayload } from "jsonwebtoken";

type SignParams = Parameters<typeof jwt.sign>;
type VerifyParams = Parameters<typeof jwt.verify>;

export const sign = (
  data: SignParams[0],
  secret: SignParams[1],
  options: SignParams[2],
) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(data, secret, options, (err, token) => {
      if (err) {
        reject(err);
      } else if (!token) {
        reject(new Error("No token returned from jwt.sign"));
      } else {
        resolve(token);
      }
    });
  });
};

export const verify = (
  token: VerifyParams[0],
  secret: VerifyParams[1],
  options?: VerifyParams[2],
) => {
  return new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, secret, options, (err, data) => {
      if (err) {
        reject(err);
      } else if (!data) {
        reject(new Error("No data returned from jwt.verify"));
      } else if (typeof data !== "object" || !("sub" in data)) {
        reject(new Error("Invalid data format returned from jwt.verify"));
      } else {
        resolve(data);
      }
    });
  });
};
