import {
  getAccessTokenEnvCloud,
  fetchAllProducts,
} from "../services/kiot/index.js";
import {
  writeJsonFile,
  vnTimeToUTCTimestampMiliseconds,
  formartProducts,
  PRODUCT_FIELD_MAP,
  PRODUCT_TYPE_MAP,
  PRODUCT_UI_TYPE_MAP,
} from "../utils/index.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";

export async function syncProductsToLark(
  baseId,
  tableProductName,
  fieldFilterDate,
  from,
  to
) {
  const accessTokenKiot = await getAccessTokenEnvCloud();

  const products = await fetchAllProducts(accessTokenKiot, {
    includeInventory: true,
    includePricebook: true,
  });

  writeJsonFile("./src/data/products.json", products);

  const productFormarted = formartProducts(products);

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableProductName,
      records: productFormarted,
      fieldMap: PRODUCT_FIELD_MAP,
      typeMap: PRODUCT_TYPE_MAP,
      uiType: PRODUCT_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "Id",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );
}
