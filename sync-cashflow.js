import { env } from "./src/config/env.js";
import { syncCashflowToLark } from "./src/sync/syncCashflowToLark.js";

async function syncCashflow() {
  const baseId = env.LARK.BASE_ID;
  const cashflowTableName = env.LARK.LARK_TABLE_CASHFLOW_NAME;
  const cashflowFieldFilterDate = "FilterDate";
  const from = "2025/12/01 00:00:00";
  const to = "2026/12/31 23:59:59";
  await syncCashflowToLark(
    baseId,
    cashflowTableName,
    cashflowFieldFilterDate,
    from,
    to
  );
}

syncCashflow();