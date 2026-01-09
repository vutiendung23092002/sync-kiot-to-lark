import { getAccessTokenEnvCloud } from "../services/kiot/index.js";
import { fetchAllSuppliers } from "../services/kiot/fetchAllSuppliers.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";
import {
  SUPPLIER_FIELD_MAP,
  SUPPLIER_TYPE_MAP,
  SUPPLIER_UI_TYPE_MAP,
  writeJsonFile,
  vnTimeToUTCTimestampMiliseconds,
  formartSuppliers,
} from "../utils/index.js";

export async function syncSuppliersToLark(
  baseId,
  tableSupplierName,
  fieldFilterDate,
  from,
  to
) {
  const accessTokenKiot = await getAccessTokenEnvCloud();

  const suppliers = await fetchAllSuppliers(accessTokenKiot, 100);
  const suppliersFormarted = formartSuppliers(suppliers);

  writeJsonFile("./src/data/suppliers.json", suppliers);
  writeJsonFile("./src/data/suppliersFormarted.json", suppliersFormarted);

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableSupplierName,
      records: suppliersFormarted,
      fieldMap: SUPPLIER_FIELD_MAP,
      typeMap: SUPPLIER_TYPE_MAP,
      uiType: SUPPLIER_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "ID",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );
}
