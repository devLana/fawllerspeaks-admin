import {
  request,
  Agent,
  type IncomingHttpHeaders,
  type OutgoingHttpHeaders,
  type RequestOptions,
} from "node:http";
import { URL } from "node:url";
import { Buffer } from "node:buffer";

interface PostResponse<U> {
  statusCode?: number;
  responseHeaders: IncomingHttpHeaders;
  statusMessage?: string;
  data: U;
}

type RequestHeaders = OutgoingHttpHeaders & IncomingHttpHeaders;

export const post = <T = unknown>(
  address: string,
  data: Record<string, unknown>,
  reqHeaders: RequestHeaders = {}
) => {
  return new Promise<PostResponse<T>>((resolve, reject) => {
    const url = new URL(address);
    const options: RequestOptions = {
      agent: new Agent({ keepAlive: true }),
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        ...reqHeaders,
      },
    };

    const req = request(url, options);

    req.on("response", res => {
      const chunkData: Uint8Array[] = [];

      res.on("data", (chunk: Uint8Array) => {
        chunkData.push(chunk);
      });

      res.on("end", () => {
        const { headers, statusCode, statusMessage } = res;
        const resData = Buffer.concat(chunkData).toString();

        try {
          if (!statusCode || !statusMessage) {
            reject(new Error("Request failed", { cause: resData }));
            res.resume();
          } else if (statusCode < 200 || statusCode >= 300) {
            reject(new Error("Request failed", { cause: resData }));
            res.resume();
          } else {
            const responseBody: PostResponse<T> = {
              statusCode,
              responseHeaders: headers,
              statusMessage,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
              data: JSON.parse(resData) as T,
            };

            resolve(responseBody);
          }
        } catch (error) {
          reject(
            new Error("Response error - Error parsing response data", {
              cause: error,
            })
          );
          res.resume();
        }
      });

      res.on("error", err => {
        reject(err);
        res.resume();
      });
    });

    req.on("error", err => reject(err));

    req.write(JSON.stringify(data));

    req.end();
  });
};
