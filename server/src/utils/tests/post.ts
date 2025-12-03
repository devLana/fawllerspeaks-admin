import {
  request,
  Agent,
  type RequestOptions,
  type IncomingHttpHeaders,
} from "node:http";
import { URL } from "node:url";
import { Buffer } from "node:buffer";

interface PostResponse<U> {
  statusCode?: number;
  responseHeaders: IncomingHttpHeaders;
  statusMessage?: string;
  data: U;
}

type RequestHeaders = RequestOptions["headers"] & IncomingHttpHeaders;

const post = <T = unknown>(
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
          const responseBody: PostResponse<T> = {
            statusCode,
            responseHeaders: headers,
            statusMessage,
            data: JSON.parse(resData) as T,
          };

          if (
            res.statusCode &&
            (res.statusCode < 200 || res.statusCode >= 300)
          ) {
            reject(resData);
            res.resume();
          } else {
            resolve(responseBody);
          }
        } catch {
          reject("Response error - Error parsing response data");
          res.resume();
        }
      });

      res.on("error", err => {
        reject(`Response error - ${err.message}`);
        res.resume();
      });
    });

    req.on("error", err => {
      reject(`Request error - ${err.message}`);
    });

    req.write(JSON.stringify(data));

    req.end();
  });
};

export default post;
