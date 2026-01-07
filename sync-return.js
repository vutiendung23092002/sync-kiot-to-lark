import { env } from "./src/config/env.js";
import { syncProductsToLark } from "./src/sync/syncProductsToLark.js";

async function syncProducts() {
  const baseId = env.LARK.BASE_ID;
  const productTableName = env.LARK.TABLE_PRODUCT_NAME;
  const productFieldFilterDate = "FilterDate";
  const from = "2025/01/01 00:00:00";
  const to = "2100/12/01 23:59:59";
  await syncProductsToLark(
    baseId,
    productTableName,
    productFieldFilterDate,
    from,
    to
  );
}

syncProducts();
