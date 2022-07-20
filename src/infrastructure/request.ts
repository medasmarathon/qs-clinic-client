import { BASE_URL } from "src/globals";
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
    const isApiUrl = url.startsWith(BASE_URL!);
    if (isLoggedIn && isApiUrl) {
        return { "x-access-token": token };
    } else {
        return {};
    }
}

async function handleResponse<ResponseType>(
    response: Response
): Promise<ResponseType> {
    const { accessToken: token, logout } = useAuthStore();
    let resText = await response.text();
    const data = resText && JSON.parse(resText);
    if (!response.ok) {
        if ([401, 403].includes(response.status) && token) {
            logout();
            throw new Error(data);
        }

        const error = data || response.statusText;
        throw new Error(error);
    }
    return (data as Promise<ResponseType>) ?? resText;
}
