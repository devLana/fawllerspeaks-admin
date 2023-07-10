import jwt from "jsonwebtoken";

type SignParams = Parameters<typeof jwt.sign>;
type VerifyParams = Parameters<typeof jwt.verify>;
type VerifyCallback = NonNullable<VerifyParams[3]>;
type VerifyData = NonNullable<Parameters<VerifyCallback>[1]>;

export const sign = (
  data: SignParams[0],
  secret: SignParams[1],
  options: SignParams[2]
) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(data, secret, options, (err, token) => {
      if (err || !token) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export const verify = (
  token: VerifyParams[0],
  secret: VerifyParams[1],
  options?: VerifyParams[2]
) => {
  return new Promise<VerifyData>((resolve, reject) => {
    jwt.verify(token, secret, options, (err, data) => {
      if (err || !data) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
