import {
  getAccessTokenEnvCloud,
  fetchAllReturns,
} from "../services/kiot/index.js";
import {
  writeJsonFile,
  vnTimeToUTCTimestampMiliseconds,
  formartReturns,
  RETURN_FIELD_MAP,
  RETURN_TYPE_MAP,
  RETURN_UI_TYPE_MAP,
  formartReturnDetails,
  RETURN_DETAIL_FIELD_MAP,
  RETURN_DETAIL_TYPE_MAP,
  RETURN_DETAIL_UI_TYPE_MAP,
} from "../utils/index.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";

export async function syncReturnToLark(
  baseId,
  tableReturnName,
  tableReturnNameDetails,
  fieldFilterDate,
  from,
  to
) {
  const accessTokenKiot = await getAccessTokenEnvCloud();

  const returns = await fetchAllReturns(accessTokenKiot, from, to, 100);

  writeJsonFile("./src/data/returns.json", returns);

  const returnFormarted = formartReturns(returns);
  const returnDetailsFormarted = returns.flatMap((r) =>
    formartReturnDetails(r)
  );

  writeJsonFile("./src/data/returnFormarted.json", returnFormarted);
  writeJsonFile(
    "./src/data/returnDetailsFormarted.json",
    returnDetailsFormarted
  );

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableReturnName,
      records: returnFormarted,
      fieldMap: RETURN_FIELD_MAP,
      typeMap: RETURN_TYPE_MAP,
      uiType: RETURN_UI_TYPE_MAP,
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
      fieldMap: RETURN_DETAIL_FIELD_MAP,
      typeMap: RETURN_DETAIL_TYPE_MAP,
      uiType: RETURN_DETAIL_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "Id",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );
}
