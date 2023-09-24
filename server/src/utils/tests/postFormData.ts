import {
  request,
  Agent,
  type RequestOptions,
  type IncomingHttpHeaders,
} from "node:http";
import { URL } from "node:url";
import { Buffer } from "node:buffer";

import type FormData from "form-data";

interface PostResponse<U> {
  statusCode?: number;
  responseHeaders: IncomingHttpHeaders;
  statusMessage?: string;
  data: U;
}

type RequestHeaders = RequestOptions["headers"] & IncomingHttpHeaders;

const postFormData = <T = unknown>(
  address: string,
  formData: FormData,
  reqHeaders: RequestHeaders = {}
) => {
  return new Promise<PostResponse<T>>((resolve, reject) => {
    const url = new URL(address);
    const options: RequestOptions = {
      agent: new Agent({ keepAlive: true }),
      method: "POST",
      headers: {
        Accept: "application/json",
        ...formData.getHeaders(),
        ...reqHeaders,
      },
    };

    const req = request(url, options);

    req.on("response", res => {
      const chunkData: Buffer[] = [];

      res.on("data", (chunk: Buffer) => {
        chunkData.push(chunk);
      });

      res.on("end", () => {
        const resData = Buffer.concat(chunkData).toString();

        try {
          const responseBody: PostResponse<T> = {
            statusCode: res.statusCode,
            responseHeaders: res.headers,
            statusMessage: res.statusMessage,
            data: JSON.parse(resData) as T,
          };

          resolve(responseBody);
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

    formData.pipe(req);
  });
};

export default postFormData;
