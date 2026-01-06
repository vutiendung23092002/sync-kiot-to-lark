import { env } from "./src/config/env.js";
import { syncCustomerToLark } from "./src/sync/syncCustomerToLark.js";

async function syncCustomers() {
  const baseId = env.LARK.BASE_ID;
  const customerTableName = env.LARK.LARK_TABLE_CUSTOMER_NAME;
  const customerFieldFilterDate = "FilterDate";
  const from = "2025/01/01 00:00:00";
  const to = "2100/12/01 23:59:59";
  await syncCustomerToLark(
    baseId,
    customerTableName,
    customerFieldFilterDate,
    from,
    to
  );
}

syncCustomers();
