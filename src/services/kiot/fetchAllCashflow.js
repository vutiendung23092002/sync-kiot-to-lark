import { getCashflow } from "../../core/kiot-api.js"
import { delay, callWithRetry } from "../../utils/index.js";

export async function fetchAllCashflow(accessToken, from, to, pageSize = 100) {
  let cursor = 0;
  let all = [];

  while (true) {
    const params = {
      pageSize,
      includeAccount: true,
      includeBranch: true,
      includeUser: true,
      startDate: from,
      endDate: to,
    };

    if (cursor) params.currentItem = cursor;

    const res = await callWithRetry(() =>
      getCashflow(accessToken, params)
    );

    if (!res?.data || res.data.length === 0) break;

    all.push(...res.data);

    console.log(
      `Fetched ${res.data.length}, total_page: ${all.length}, cursor=${cursor}, total_cashflow=${res.total}`
    );

    cursor = all.length;

    if (res.data.length < pageSize) break;
    await delay(200);
  }
  return all;
}
