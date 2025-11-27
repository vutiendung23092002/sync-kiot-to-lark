import * as kiotApi from "../../core/kiot_api.js";

export async function fetchAllInvoices(accessToken, from, to, pageSize = 200) {
  let cursor = 0;
  let all = [];
  console.log(pageSize);

  while (true) {
    const params = {
      pageSize,
      fromPurchaseDate: from,
      toPurchaseDate: to,
    };

    if (cursor) params.currentItem = cursor;

    const res = await kiotApi.getInvoices(accessToken, params);

    if (!res?.data || res.data.length === 0) break;

    all.push(...res.data);

    console.log(
      `Fetched ${res.data.length}, total_page: ${all.length}, cursor=${cursor}, total_invoices=${res.total}`
    );

    cursor = all.length;

    if (res.data.length < pageSize) break;
  }

  return all;
}
