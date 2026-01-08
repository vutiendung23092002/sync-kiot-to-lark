import * as kiotApi from "../../core/kiot-api.js";
import { delay } from "../../utils/index.js";
import { callWithRetry } from "../../utils/common/callWithRetry.js";

/**
 * Lấy toàn bộ danh sách hàng hóa KiotViet bằng phân trang currentItem.
 *
 * @param {string} accessToken
 * @param {object} filters - Các filter tự truyền vào, ví dụ:
 *   {
 *      includeInventory: true,
 *      includePricebook: true,
 *      isActive: true,
 *      categoryId: 123,
 *      ...
 *   }
 * @param {number} pageSize - Số lượng sản phẩm mỗi page (max 100)
 *
 * @returns {Promise<Array>}
 */
export async function fetchAllProducts(accessToken, filters = {}, pageSize = 100) {
  let cursor = 0;
  let all = [];

  while (true) {
    const params = {
      pageSize,
      ...filters
    };

    console.log(params);

    if (cursor) params.currentItem = cursor;

    const res = await callWithRetry(() =>
      kiotApi.getProducts(accessToken, params)
    );

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
