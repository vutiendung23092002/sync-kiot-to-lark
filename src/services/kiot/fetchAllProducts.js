import { getProducts } from "../../core/kiot-api.js";
import { delay, callWithRetry } from "../../utils/index.js";

export async function fetchAllProducts(
  accessToken,
  filters = {},
  pageSize = 100
) {
  let cursor = 0;
  let all = [];

  while (true) {
    const params = {
      pageSize,
      ...filters,
    };

    console.log(params);

    if (cursor) params.currentItem = cursor;

    const res = await callWithRetry(() => getProducts(accessToken, params));

    if (!res?.data || res.data.length === 0) break;

    all.push(...res.data);

    console.log(
      `Fetched ${res.data.length}, total: ${all.length}, cursor=${cursor}`
    );

    cursor = all.length;

    if (res.data.length < pageSize) break;
    delay(200);
  }

  return all;
}
