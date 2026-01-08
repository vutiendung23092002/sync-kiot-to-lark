import * as utils from "../utils/index.js";
import * as serviceKiot from "../services/kiot/index.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";
import {
  formartReturns,
  formartReturnDetails,
} from "../utils/kiot/formatReturn.js";
import { fetchAllReturns } from "../services/kiot/fetchAllReturns.js";

export async function syncReturnToLark(
  baseId,
  tableReturnName,
  tableReturnNameDetails,
  fieldFilterDate,
  from,
  to
) {
  const accessTokenKiot = await serviceKiot.getAccessTokenEnvCloud();

  const returns = await fetchAllReturns(accessTokenKiot, from, to, 100);

  utils.writeJsonFile("./src/data/returns.json", returns);

  const returnFormarted = formartReturns(returns);
  const returnDetailsFormarted = returns.flatMap((r) =>
    formartReturnDetails(r)
  );

  utils.writeJsonFile("./src/data/returnFormarted.json", returnFormarted);
  utils.writeJsonFile(
    "./src/data/returnDetailsFormarted.json",
    returnDetailsFormarted
  );

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = utils.vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = utils.vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableReturnName,
      records: returnFormarted,
      fieldMap: utils.RETURN_FIELD_MAP,
      typeMap: utils.RETURN_TYPE_MAP,
      uiType: utils.RETURN_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "Id",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableReturnNameDetails,
      records: returnDetailsFormarted,
      fieldMap: utils.RETURN_DETAIL_FIELD_MAP,
      typeMap: utils.RETURN_DETAIL_TYPE_MAP,
      uiType: utils.RETURN_DETAIL_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "Id",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );
}
