import { larkClient } from "../core/larkbase-client.js";
import {
  getAccessTokenEnvCloud,
  fetchAllCashflow,
} from "../services/kiot/index.js";
import {
  CASHFLOW_FIELD_MAP,
  CASHFLOW_TYPE_MAP,
  CASHFLOW_UI_TYPE_MAP,
  formartCashflow,
  vnTimeToUTCTimestampMiliseconds,
  writeJsonFile,
} from "../utils/index.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";

export async function syncCashflowToLark(
  baseId,
  tableCustomerName,
  fieldFilterDate,
  from,
  to
) {
  const accessTokenKiot = await getAccessTokenEnvCloud();

  const cashflows = await fetchAllCashflow(accessTokenKiot, from, to);
  const cashflowFormarted = formartCashflow(cashflows);

  writeJsonFile("./src/data/cashflows.json", cashflows);
  writeJsonFile("./src/data/cashflowFormarted.json", cashflowFormarted);

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableCustomerName,
      records: cashflowFormarted,
      fieldMap: CASHFLOW_FIELD_MAP,
      typeMap: CASHFLOW_TYPE_MAP,
      uiType: CASHFLOW_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "Id phiếu",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );
}
