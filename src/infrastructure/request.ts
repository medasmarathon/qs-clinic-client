import { useAuthStore } from "src/stores";

export enum Method {
  GET,
  POST,
  PUT,
  DELETE,
}

export const httpRequest = {
  get: request(Method.GET),
  post: request(Method.POST),
  put: request(Method.PUT),
  delete: request(Method.DELETE),
};
class ErrorResponse {
  status!: "SUCCESS" | "ERROR" | "UNAUTHORIZED";
  message!: string;
}

function request(method: Method) {
  return <ResponseType>(url: string, body?: object) => {
    const requestOptions: RequestInit = {
      method: Method[method],
    };
    if (body) {
      requestOptions.headers = new Headers({
        ...authHeader(url),
        "Content-Type": "application/json",
      });
      requestOptions.body = JSON.stringify(body);
    } else {
      requestOptions.headers = new Headers(authHeader(url));
    }
    console.log("Request body:" + requestOptions.body);
    return fetch(url, requestOptions).then(
      handleResponse
    ) as Promise<ResponseType>;
  };
}

// helper functions

function authHeader(url: string): Record<string, string> {
  // return auth header with jwt if user is logged in and request is to the api url
  const { accessToken: token } = useAuthStore();
  const isLoggedIn = token === "" ? false : true;
  const isApiUrl = url.startsWith(process.env.VUE_APP_CLINIC_URL!);
  if (isLoggedIn && isApiUrl) {
    return { "x-access-token": token };
  } else {
    return {};
  }
}

function handleResponse<ResponseType>(
  response: Response
): Promise<ResponseType> {
  const { accessToken: token, logout } = useAuthStore();
  if (!response.ok) {
    return response.text().then((text) => {
      const data = text && JSON.parse(text);
      if ([401, 403].includes(response.status) && token) {
        logout();
        return Promise.reject(data);
      }

      const error = data || response.statusText;
      return Promise.reject(error);
    });
  }
  return response.json() as Promise<ResponseType>;
}
