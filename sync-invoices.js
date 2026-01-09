import * as sync from "./src/sync/index.js";
import { env } from "./src/config/env.js";

async function syncInvoices() {
  // Cấu hình call api
  const chunkSize = 10; //Số api call trong 1 chunk
  const chunkDelay = 300; // 0.3s - thời gian delay giữa mỗi chunk
  const retryDelay = 500; //0.5s - thời gian delay mỗi khi chunk lỗi - retry
  const retries = 50; // restry chunk đến l100 mà vẫn lỗi thì dừng ctrinh và nhả error

  // Cấu hình chung
  const baseId = env.LARK.BASE_ID;
  const from = env.LARK.TABLE_INVOICE__FROM;
  const to = env.LARK.TABLE_INVOICE__TO;

  console.log(`From: ${from} - To: ${to}`)

  // Cấu hình "Hoá đơn"
  const invoiceTableName = env.LARK.TABLE_INVOICES_NAME;
  const tableInvoiceDetailName = env.LARK.TABLE_INVOICES_DETAIL_NAME;
  const invoiceFieldFilterDate = "Ngày thanh toán";
  const excludeUpdateField = "Giá vốn";

  console.time("syncInvoices");
  await sync.syncInvoicesToLark(
    baseId,
    invoiceTableName,
    tableInvoiceDetailName,
    invoiceFieldFilterDate,
    excludeUpdateField,
    from,
    to,
    chunkSize,
    chunkDelay,
    retryDelay,
    retries
  );
  console.timeEnd("syncInvoices");
}

syncInvoices();
// syncInvoices: 2:55.240 (m:ss.mmm) ~ chunkSize = 0 
// syncInvoices: 2:12.304 (m:ss.mmm) ~ chunkSize = 6 - retryDelay = 2000 
// syncInvoices: 2:11.994 (m:ss.mmm) ~ chunkSize = 6 - retryDelay = 500 
// syncInvoices: 2:30.936 (m:ss.mmm) ~ chunkSize = 10 - retryDelay = 2000
// syncInvoices: 1:46.973 (m:ss.mmm) ~ chunkSize = 10 - retryDelay = 500