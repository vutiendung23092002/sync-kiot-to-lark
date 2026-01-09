import { env } from "./src/config/env.js";
import { syncPurchaseOrdersToLark } from "./src/sync/syncPurchaseOrdersToLark.js";

async function syncPurchaseOrders() {
  const baseId = env.LARK.BASE_ID;
  const purchaseOrdersTableName = env.LARK.TABLE_PURCHASEORDERS_NAME;
  const purchaseOrdersDetailsTableName = env.LARK.TABLE_PURCHASEORDERS_DETAILS_NAME;
  const purchaseOrdersFieldFilterDate = "Ngày tạo phiếu";
  const from = env.LARK.TABLE_PURCHASEORDERS__FROM;
  const to = env.LARK.TABLE_PURCHASEORDERS__TO;
  await syncPurchaseOrdersToLark(
    baseId,
    purchaseOrdersTableName,
    purchaseOrdersDetailsTableName,
    purchaseOrdersFieldFilterDate,
    from,
    to
  );
}

syncPurchaseOrders();
