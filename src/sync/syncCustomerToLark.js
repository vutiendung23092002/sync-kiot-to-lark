import * as utils from "../utils/index.js";
import * as serviceKiot from "../services/kiot/index.js";
import { fetchAllCustomers } from "../services/kiot/fetchAllCustomer.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";
import { formartCustomer } from "../utils/kiot/formatCustomer.js";

export async function syncCustomerToLark(
  baseId,
  tableCustomerName,
  fieldFilterDate,
  from,
  to,
) {
  const accessTokenKiot = await serviceKiot.getAccessTokenEnvCloud();

  const customers = await fetchAllCustomers(accessTokenKiot);

  utils.writeJsonFile("./src/data/customers.json", customers);

  const customerFormarted = formartCustomer(customers);

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = utils.vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = utils.vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
      larkClient,
      baseId,
      {
        tableName: tableCustomerName,
        records: customerFormarted,
        fieldMap: utils.CUSTOMER_FIELD_MAP,
        typeMap: utils.CUSTOMER_TYPE_MAP,
        uiType: utils.CUSTOMER_UI_TYPE_MAP,
        currencyCode: "VND",
        idLabel: "ID",
      },
      fieldFilterDate,
      timestampFrom,
      timestampTo
    );
}
