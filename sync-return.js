import { env } from "./src/config/env.js";
import { syncReturnToLark } from "./src/sync/syncReturnsToLark.js";

async function syncReturns() {
  const baseId = env.LARK.BASE_ID;
  const returnTableName = env.LARK.TABLE_RETURN_NAME;
  const returnDetailsTableName = env.LARK.TABLE_RETURN_DETAILS_NAME;
  const returnFieldFilterDate = "FilterDate";
  const from = "2025/01/01 00:00:00";
  const to = "2100/12/01 23:59:59";
  await syncReturnToLark(
    baseId,
    returnTableName,
    returnDetailsTableName,
    returnFieldFilterDate,
    from,
    to
  );
}

syncReturns();
