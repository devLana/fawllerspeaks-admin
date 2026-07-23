interface PostResponse<U> {
  responseHeaders: Headers;
  statusCode?: number;
  statusMessage?: string;
  data: U;
}

type RequestHeaders = Record<string, string>;

export const postFormData = async <T>(
  address: string,
  formData: FormData,
  reqHeaders: RequestHeaders = {}
): Promise<PostResponse<T>> => {
  try {
    const response = await fetch(address, {
      method: "POST",
      headers: { Accept: "application/json", ...reqHeaders },
      body: formData,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const data = (await response.json()) as T;
    const responseHeaders = response.headers;
    const statusCode = response.status;
    const statusMessage = response.statusText;

    return { responseHeaders, statusCode, statusMessage, data };
  } catch (error) {
    throw new Error("Response error", { cause: error });
  }
};
