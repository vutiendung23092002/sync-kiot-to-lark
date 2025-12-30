import * as kiotApi from "../core/kiot-api.js";
import * as utils from "../utils/index.js";
import * as serviceKiot from "../services/kiot/index.js";
import { fetchAllInvoices } from "../services/kiot/fetchAllInvoices.js";
import { fetchAllProducts } from "../services/kiot/fetchAllProducts.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";
import { formartProducts } from "../utils/kiot/formatProducts.js";

export async function syncProductsToLark(
  baseId,
  tableProductName,
  fieldFilterDate,
  from,
  to,
) {
  const accessTokenKiot = await serviceKiot.getAccessTokenEnvCloud();

  const products = await fetchAllProducts(accessTokenKiot, {
    includeInventory: true,
    includePricebook: true,
  });

  const productFormarted = formartProducts(products);

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = utils.vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = utils.vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
      larkClient,
      baseId,
      {
        tableName: tableProductName,
        records: productFormarted,
        fieldMap: utils.PRODUCT_FIELD_MAP,
        typeMap: utils.PRODUCT_TYPE_MAP,
        uiType: utils.PRODUCT_UI_TYPE_MAP,
        currencyCode: "VND",
        idLabel: "Id",
      },
      fieldFilterDate,
      timestampFrom,
      timestampTo
    );
}
