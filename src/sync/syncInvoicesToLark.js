import * as kiotApi from "../core/kiot-api.js";
import * as utils from "../utils/index.js";
import * as serviceKiot from "../services/kiot/index.js";
import { fetchAllInvoices } from "../services/kiot/fetchAllInvoices.js";
import { fetchAllProducts } from "../services/kiot/fetchAllProducts.js";
import { syncDataToLarkBaseFilterDate } from "./syncToLarkFilterDate.js";
import { larkClient } from "../core/larkbase-client.js";

export async function syncInvoicesToLark(
  baseId,
  tableInvoiceName,
  tableInvoiceDetailName,
  fieldFilterDate,
  excludeUpdateField,
  from,
  to,
  chunkSize,
  chunkDelay,
  retryDelay,
  retries
) {
  const accessTokenKiot = await serviceKiot.getAccessTokenEnvCloud();

  const products = await fetchAllProducts(accessTokenKiot, {
    includeInventory: true,
  });

  const productCostMap = {};
  for (const p of products) {
    if (p.code && p.inventories?.length > 0) {
      const inv = p.inventories[0];
      productCostMap[p.code] = inv.cost ?? 0;
    }
  }

  // utils.writeJsonFile("./src/data/testProduct.json", products);
  // utils.writeJsonFile("./src/data/testProductCost.json", productCostMap);

  const invoices = await fetchAllInvoices(
    accessTokenKiot,
    utils.toIsoLike(from),
    utils.toIsoLike(to),
    200
  );

  utils.writeJsonFile("./src/data/invoices.json", invoices);
  const ids = invoices.map((inv) => inv.id);
  const chunks = utils.chunkArray(ids, chunkSize);
  const allInvoicesDetails = [];

  for (let i = 0; i < chunks.length; i++) {
    const group = chunks[i];
    const totalChunks = chunks.length;
    const chunkIndex = i + 1;

    console.log(
      `📦 Chunk ${chunkIndex}/${totalChunks} — ${group.length} invoices`
    );

    const results = await utils.callWithRetry(
      () =>
        Promise.all(
          group.map((id) => kiotApi.getInvoicesDetail(accessTokenKiot, id))
        ),
      retries, // dùng đúng tham số m truyền xuống cho có ý nghĩa
      retryDelay
    );

    console.log(`✅ Chunk ${chunkIndex}/${totalChunks} done`);

    allInvoicesDetails.push(...results);

    if (i < totalChunks - 1) {
      console.log(`⏳ Nghỉ ${chunkDelay}ms trước chunk tiếp theo…`);
      await utils.delay(chunkDelay);
    }
  }

  // utils.writeJsonFile("./src/data/invoicesDetail.json", allInvoicesDetails);

  const invoiceFormatted = allInvoicesDetails.map((i) =>
    utils.formatInvoice(i)
  );

  const allInvoiceDetailsFormatted = allInvoicesDetails.flatMap((inv) =>
    utils.formatInvoiceDetail(inv, productCostMap)
  );

  // utils.writeJsonFile("./src/data/invoice_formatted.json", invoiceFormatted);
  // utils.writeJsonFile(
  //   "./src/data/invoice_detail_formatted.json",
  //   allInvoiceDetailsFormatted
  // );

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = utils.vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = utils.vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableInvoiceName,
      records: invoiceFormatted,
      fieldMap: utils.INVOICE_FIELD_MAP,
      typeMap: utils.INVOICE_TYPE_MAP,
      uiType: utils.INVOICE_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "ID hoá đơn",
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableInvoiceDetailName,
      records: allInvoiceDetailsFormatted,
      fieldMap: utils.INVOICE_DETAIL_FIELD_MAP,
      typeMap: utils.INVOICE_DETAIL_TYPE_MAP,
      uiType: utils.INVOICE_DETAIL_UI_TYPE_MAP,
      currencyCode: "VND",
      idLabel: "ID",
      excludeUpdateField: excludeUpdateField,
    },
    fieldFilterDate,
    timestampFrom,
    timestampTo
  );
}

// syncInvoicesToLark("M9w2bqcWcafPXcsxYuNlZUhhgSf", "2025/09/01 00:00:00", "2025/11/30 23:59:59");
// "2025-10-31T23:59:59"
