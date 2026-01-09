import { getSuppliers } from "../../core/kiot-api.js";
import { delay, callWithRetry } from "../../utils/index.js";

export async function fetchAllSuppliers(accessToken, from, to, pageSize = 100) {
  let cursor = 0;
  let all = [];

  while (true) {
    const params = {
      pageSize,
      includeTotal: true,
      includeSupplierGroup: true,
    };

    if (cursor) params.currentItem = cursor;

    const res = await callWithRetry(() => getSuppliers(accessToken, params));

    if (!res?.data || res.data.length === 0) break;

    all.push(...res.data);

    console.log(
      `Fetched ${res.data.length}, total_page: ${all.length}, cursor=${cursor}, total_suppliers=${res.total}`
    );

    cursor = all.length;

    if (res.data.length < pageSize) break;
    await delay(200);
  }
  return all;
}
