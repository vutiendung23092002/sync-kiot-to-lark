import * as utils from "../utils/index.js";
import * as serviceKiot from "../services/kiot/index.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";
import { fetchAllCashflow } from "../services/kiot/fetchAllCashflow.js";
import { formartCashflow } from "../utils/kiot/formatCashflow.js";

export async function syncCashflowToLark(
  baseId,
  tableCustomerName,
  fieldFilterDate,
  from,
  to
) {
  const accessTokenKiot = await serviceKiot.getAccessTokenEnvCloud();

  const cashflows = await fetchAllCashflow(accessTokenKiot, from, to);

  utils.writeJsonFile("./src/data/cashflows.json", cashflows);

  const cashflowFormarted = formartCashflow(cashflows);
  utils.writeJsonFile("./src/data/cashflowFormarted.json", cashflowFormarted);

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = utils.vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = utils.vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableCustomerName,
      records: cashflowFormarted,
      fieldMap: utils.CASHFLOW_FIELD_MAP,
      typeMap: utils.CASHFLOW_TYPE_MAP,
      uiType: utils.CASHFLOW_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "Id phiếu",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );
}
