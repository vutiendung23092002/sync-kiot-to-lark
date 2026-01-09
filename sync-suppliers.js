import { env } from "./src/config/env.js";
import { syncSuppliersToLark } from "./src/sync/index.js";

async function syncSuppliers() {
  const baseId = env.LARK.BASE_ID;
  const suppliersTableName = env.LARK.TABLE_SUPPLIERS_NAME;
  const suppliersFieldFilterDate = "Ngày tạo";
  const from = "2025/01/01 00:00:00";
  const to = "2100/12/01 23:59:59";
  await syncSuppliersToLark(
    baseId,
    suppliersTableName,
    suppliersFieldFilterDate,
    from,
    to
  );
}

syncSuppliers();
