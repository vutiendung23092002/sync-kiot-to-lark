import http from "./http-client.js";
import {
  KIOT_PUBLIC_URL,
  KIOT_AUTH_URL,
  API_PATHS,
} from "../config/constants.js";
import { env } from "../config/env.js";

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

export async function getInvoices(accessToken, params) {
  const headers = {
    Retailer: env.KIOT.KIOTVIET_RETAILER,
    Authorization: `Bearer ${accessToken}`,
  };

  return await http.get(API_PATHS.KIOT_GET_INVOICES, {
    baseURL: KIOT_PUBLIC_URL,
    headers,
    params,
  });
}

export async function getInvoicesDetail(accessToken, id) {
  const headers = {
    Retailer: env.KIOT.KIOTVIET_RETAILER,
    Authorization: `Bearer ${accessToken}`,
  };

  const res = await http.get(`${API_PATHS.KIOT_GET_INVOICES}/${id}`, {
    baseURL: KIOT_PUBLIC_URL,
    headers,
  });

  return res;
}

export async function getProducts(accessToken, params) {
  const headers = {
    Retailer: env.KIOT.KIOTVIET_RETAILER,
    Authorization: `Bearer ${accessToken}`,
  };

  return await http.get(API_PATHS.KIOT_GET_PRODUCTS, {
    baseURL: KIOT_PUBLIC_URL,
    headers,
    params,
  });
}
