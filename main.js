import * as kiotApi from "./src/core/kiot_api.js";
import * as utils from "./src/utils/index.js";
import { env } from "./src/config/env.js";
import { supabase } from "./src/core/supabase-client.js";
import { encrypt, decrypt } from "./src/utils/common/AES-256-CBC.js";
import { writeJsonFile } from "./src/utils/common/fileHelper.js";
import { fetchAllInvoices } from "./src/services/kiot/fetchAllInvoices.js";
import { formatInvoice } from "./src/utils/kiot/formatInvoice.js";
import { syncDataToLarkBaseFilterDate } from "./src/sync/syncToLarkFilterDate.js";
import { larkClient } from "./src/core/larkbase-client.js";

async function main(from, to) {
  const res = await kiotApi.getAccessToken(
    env.KIOT.KIOTVIET_CLIENT_ID,
    env.KIOT.KIOTVIET_CLIENT_SECRET
  );

  const access_token_info = {
    bearer_token: res?.token_type + " " + res?.access_token,
    expires_in: res?.expires_in,
  };
  console.log(access_token_info);
  const { data, error } = await supabase
    .from("envCloud")
    .upsert(
      {
        id: 1,
        web: "kiot",
        app_name: "kiot_legiahankorea",
        access_token: encrypt(res?.access_token || ""),
        token_type: res?.token_type || "",
        expires_in: res?.expires_in || "",
        refresh_token: encrypt(res?.refresh_token || ""),
        refresh_token_expires_in: res?.refresh_token_expires_in || "",
      },
      { onConflict: "id" }
    )
    .select()
    .eq("id", 1)
    .single();

  const invoices = await fetchAllInvoices(
    decrypt(data.access_token),
    from,
    to,
    200
  );

  console.log(invoices.length);

  writeJsonFile("./src/data/invoices.json", invoices);

  const ids = invoices.map((inv) => inv.id);

  const allInvoicesDetails = [];

  for (const i of ids) {
    const invDetails = await kiotApi.getInvoicesDetail(
      decrypt(data.access_token),
      i
    );
    allInvoicesDetails.push(invDetails);
  }
  console.log(allInvoicesDetails.length);
  writeJsonFile("./src/data/invoicesDetail.json", allInvoicesDetails);

  const invoiceFormatted = allInvoicesDetails.map((i) => formatInvoice(i));

  writeJsonFile("./src/data/invoice_formatted.json", invoiceFormatted);

  await syncDataToLarkBaseFilterDate(
    larkClient,
    "M9w2bqcWcafPXcsxYuNlZUhhgSf",
    {
      tableName: "Test1232",
      records: invoiceFormatted,
      fieldMap: utils.INVOICE_FIELD_MAP,
      typeMap: utils.INVOICE_TYPE_MAP,
      uiType: utils.INVOICE_UI_TYPE_MAP,
      currencyCode: "VND",
    },
    "Ngày tạo hoá đơn",

  );
}

main();
// "2025-10-31T23:59:59"