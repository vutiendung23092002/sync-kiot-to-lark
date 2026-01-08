import * as kiotApi from "../../core/kiot-api.js";
import { delay } from "../../utils/index.js";
import { callWithRetry } from "../../utils/common/callWithRetry.js";

export async function fetchAllReturns(accessToken, from, to, pageSize = 100) {
  let cursor = 0;
  let all = [];
  console.log(pageSize);

  while (true) {
    const params = {
      pageSize,
      fromReturnDate: from,
      toReturnDate: to,
    };

    if (cursor) params.currentItem = cursor;

    const res = await callWithRetry(() =>
      kiotApi.getReturn(accessToken, params)
    );

    if (!res?.data || res.data.length === 0) break;

    all.push(...res.data);

    console.log(
      `Fetched ${res.data.length}, total_page: ${all.length}, cursor=${cursor}, total_return=${res.total}`
    );

    cursor = all.length;

    if (res.data.length < pageSize) break;
    await delay(200);
  }
  return all;
}
