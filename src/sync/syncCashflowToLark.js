import * as utils from "../utils/index.js";
import * as serviceKiot from "../services/kiot/index.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";
import { fetchAllCashflow } from "../services/kiot/fetchAllCashflow.js";

export async function syncCashflowToLark(
  baseId,
  tableCustomerName,
  fieldFilterDate,
  from,
  to,
) {
  const accessTokenKiot = await serviceKiot.getAccessTokenEnvCloud();

  const cashflows = await fetchAllCashflow(accessTokenKiot, from, to);

  utils.writeJsonFile("./src/data/cashflows.json", cashflows);

//   const cashflowFormarted = formartCashflow(cashflows);
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = utils.vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = utils.vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

//   await syncDataToLarkBaseFilterDate(
//       larkClient,
//       baseId,
//       {
//         tableName: tableCustomerName,
//         records: cashflowFormarted,
//         fieldMap: utils.CUSTOMER_FIELD_MAP,
//         typeMap: utils.CUSTOMER_TYPE_MAP,
//         uiType: utils.CUSTOMER_UI_TYPE_MAP,
//         currencyCode: "VND",
//         idLabel: "ID",
//       },
//       fieldFilterDate,
//       timestampFrom,
//       timestampTo
//     );
}
