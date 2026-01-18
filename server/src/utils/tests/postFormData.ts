interface PostResponse<U> {
  statusCode?: number;
  responseHeaders: Headers;
  statusMessage?: string;
  data: U;
}

type RequestHeaders = Record<string, string>;

const postFormData = async <T = unknown>(
  address: string,
  formData: FormData,
  reqHeaders: RequestHeaders = {}
): Promise<PostResponse<T>> => {
  let data: T;
  let statusCode: number;
  let responseHeaders: Headers;
  let statusMessage: string;

  try {
    const response = await fetch(address, {
      method: "POST",
      headers: { Accept: "application/json", ...reqHeaders },
      body: formData,
    });

    statusCode = response.status;
    responseHeaders = response.headers;
    statusMessage = response.statusText;
    data = (await response.json()) as T;
  } catch (error) {
    throw new Error("Response error");
  }

  return { statusCode, responseHeaders, statusMessage, data };
};

export default postFormData;
