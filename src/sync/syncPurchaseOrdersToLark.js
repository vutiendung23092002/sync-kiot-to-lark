import {
  getAccessTokenEnvCloud,
  fetchAllPurchaseOrders,
} from "../services/kiot/index.js";
import {
  writeJsonFile,
  vnTimeToUTCTimestampMiliseconds,
  formartPurchaseOrders,
  formartPurchaseOrderDetails,
  PURCHASE_ORDER_FIELD_MAP,
  PURCHASE_ORDER_TYPE_MAP,
  PURCHASE_ORDER_UI_TYPE_MAP,
  PURCHASE_ORDER_DETAIL_FIELD_MAP,
  PURCHASE_ORDER_DETAIL_TYPE_MAP,
  PURCHASE_ORDER_DETAIL_UI_TYPE_MAP
} from "../utils/index.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";

export async function syncPurchaseOrdersToLark(
  baseId,
  tablePurchaseOrdersName,
  tablePurchaseOrdersDetailsName,
  fieldFilterDate,
  from,
  to
) {
  const accessTokenKiot = await getAccessTokenEnvCloud();

  const purchaseOrders = await fetchAllPurchaseOrders(
    accessTokenKiot,
    from,
    to,
    100
  );

  formartPurchaseOrders(purchaseOrders);

  const purchaseOrdersFormarted = formartPurchaseOrders(purchaseOrders);
  const purchaseOrderDetailsFormarted = purchaseOrders.flatMap((p) =>
    formartPurchaseOrderDetails(p)
  );
  
  writeJsonFile("./src/data/purchaseOrders.json", purchaseOrders);
  writeJsonFile(
    "./src/data/purchaseOrdersFormarted.json",
    purchaseOrdersFormarted
  );
  writeJsonFile(
    "./src/data/purchaseOrderDetailsFormarted.json",
    purchaseOrderDetailsFormarted
  );

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tablePurchaseOrdersName,
      records: purchaseOrdersFormarted,
      fieldMap: PURCHASE_ORDER_FIELD_MAP,
      typeMap: PURCHASE_ORDER_TYPE_MAP,
      uiType: PURCHASE_ORDER_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "id",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tablePurchaseOrdersDetailsName,
      records: purchaseOrderDetailsFormarted,
      fieldMap: PURCHASE_ORDER_DETAIL_FIELD_MAP,
      typeMap: PURCHASE_ORDER_DETAIL_TYPE_MAP,
      uiType: PURCHASE_ORDER_DETAIL_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "id",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );
}
