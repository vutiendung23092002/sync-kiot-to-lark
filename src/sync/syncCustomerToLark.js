import { larkClient } from "../core/larkbase-client.js";
import {
  getAccessTokenEnvCloud,
  fetchAllCustomers,
} from "../services/kiot/index.js";
import {
  CUSTOMER_FIELD_MAP,
  CUSTOMER_TYPE_MAP,
  CUSTOMER_UI_TYPE_MAP,
  formartCustomer,
  writeJsonFile,
  vnTimeToUTCTimestampMiliseconds,
} from "../utils/index.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";

export async function syncCustomerToLark(
  baseId,
  tableCustomerName,
  fieldFilterDate,
  from,
  to
) {
  const accessTokenKiot = await getAccessTokenEnvCloud();

  const customers = await fetchAllCustomers(accessTokenKiot);
  const customerFormarted = formartCustomer(customers);

  writeJsonFile("./src/data/customers.json", customers);

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableCustomerName,
      records: customerFormarted,
      fieldMap: CUSTOMER_FIELD_MAP,
      typeMap: CUSTOMER_TYPE_MAP,
      uiType: CUSTOMER_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "ID",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );
}
