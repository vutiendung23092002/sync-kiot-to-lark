import {
  getAccessTokenEnvCloud,
  fetchAllProducts,
  fetchAllInvoices,
} from "../services/kiot/index.js";
import { getInvoicesDetail } from "../core/kiot-api.js";
import {
  formatInvoice,
  INVOICE_FIELD_MAP,
  INVOICE_TYPE_MAP,
  INVOICE_UI_TYPE_MAP,
  formatInvoiceDetail,
  INVOICE_DETAIL_FIELD_MAP,
  INVOICE_DETAIL_TYPE_MAP,
  INVOICE_DETAIL_UI_TYPE_MAP,
  writeJsonFile,
  toIsoLike,
  callWithRetry,
  chunkArray,
  delay,
  vnTimeToUTCTimestampMiliseconds,
} from "../utils/index.js";
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
  const accessTokenKiot = await getAccessTokenEnvCloud();

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

  const invoices = await fetchAllInvoices(
    accessTokenKiot,
    toIsoLike(from),
    toIsoLike(to),
    200
  );

  writeJsonFile("./src/data/invoices.json", invoices);

  const ids = invoices.map((inv) => inv.id);
  const chunks = chunkArray(ids, chunkSize);
  const allInvoicesDetails = [];

  for (let i = 0; i < chunks.length; i++) {
    const group = chunks[i];
    const totalChunks = chunks.length;
    const chunkIndex = i + 1;

    console.log(
      `📦 Chunk ${chunkIndex}/${totalChunks} — ${group.length} invoices`
    );

    const results = await callWithRetry(
      () =>
        Promise.all(group.map((id) => getInvoicesDetail(accessTokenKiot, id))),
      retries, // dùng đúng tham số m truyền xuống cho có ý nghĩa
      retryDelay
    );

    console.log(`✅ Chunk ${chunkIndex}/${totalChunks} done`);

    allInvoicesDetails.push(...results);

    if (i < totalChunks - 1) {
      console.log(`⏳ Nghỉ ${chunkDelay}ms trước chunk tiếp theo…`);
      await delay(chunkDelay);
    }
  }

  writeJsonFile("./src/data/allInvoicesDetails.json", allInvoicesDetails);

  const invoiceFormatted = allInvoicesDetails.map((i) => formatInvoice(i));

  const allInvoiceDetailsFormatted = allInvoicesDetails.flatMap((inv) =>
    formatInvoiceDetail(inv, productCostMap)
  );

  writeJsonFile("./src/data/invoiceFormatted.json", invoiceFormatted);
  writeJsonFile(
    "./src/data/allInvoiceDetailsFormatted.json",
    allInvoiceDetailsFormatted
  );

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const timestampFrom = vnTimeToUTCTimestampMiliseconds(from) - ONE_DAY;
  const timestampTo = vnTimeToUTCTimestampMiliseconds(to) + ONE_DAY;

  await syncDataToLarkBaseFilterDate(
    larkClient,
    baseId,
    {
      tableName: tableInvoiceName,
      records: invoiceFormatted,
      fieldMap: INVOICE_FIELD_MAP,
      typeMap: INVOICE_TYPE_MAP,
      uiType: INVOICE_UI_TYPE_MAP,
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
      fieldMap: INVOICE_DETAIL_FIELD_MAP,
      typeMap: INVOICE_DETAIL_TYPE_MAP,
      uiType: INVOICE_DETAIL_UI_TYPE_MAP,
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
