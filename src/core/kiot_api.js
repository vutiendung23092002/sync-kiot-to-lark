import http from "./http-client.js";
import { KIOT_AUTH_URL, API_PATHS } from "../config/constants.js";

export async function getAccessToken(clientId, clientSecret) {
  const params = {
    scopes: "PublicApi.Access",
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await http.post(
    API_PATHS.KIOT_GET_ACCESS_TOKEN,
    new URLSearchParams(params),
    {
      baseURL: KIOT_AUTH_URL,
      headers,
    }
  );
  return res;
}
