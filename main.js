import * as sync from "./src/sync/index.js";

async function main() {
  // Cấu hình call api
  const chunkSize = 10; //Số api call trong 1 chunk
  const chunkDelay = 300; // 0.3s - thời gian delay giữa mỗi chunk
  const retryDelay = 500; //0.5s - thời gian delay mỗi khi chunk lỗi - retry
  const retries = 50; // restry chunk đến l100 mà vẫn lỗi thì dừng ctrinh và nhả error

  // Cấu hình chung
  const baseId = "M9w2bqcWcafPXcsxYuNlZUhhgSf";
  const from = "2025/09/01 00:00:00";
  const to = "2025/12/31 23:59:59";

  // Cấu hình "Hoá đơn"
  const invoiceTableName = "4.Hoá đơn cũ + mới";
  const tableInvoiceDetailName = "4.Chi tiết hoá đơn cũ + mới";
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

main();
// syncInvoices: 2:55.240 (m:ss.mmm) ~ chunkSize = 0 
// syncInvoices: 2:12.304 (m:ss.mmm) ~ chunkSize = 6 - retryDelay = 2000 
// syncInvoices: 2:11.994 (m:ss.mmm) ~ chunkSize = 6 - retryDelay = 500 
// syncInvoices: 2:30.936 (m:ss.mmm) ~ chunkSize = 10 - retryDelay = 2000
// syncInvoices: 1:46.973 (m:ss.mmm) ~ chunkSize = 10 - retryDelay = 500