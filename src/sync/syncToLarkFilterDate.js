import * as larkbaseService from "../services/larkbase/index.js";
import * as utils from "../utils/index.js";

/**
 * Đồng bộ dữ liệu vào LarkBase nhưng có thêm filter theo khoảng ngày
 * (dùng cho những bảng có quá nhiều record nên cần search theo field ngày).
 *
 * Cơ chế hoạt động:
 *  1. Lấy dữ liệu nguồn (records hoặc selectFn)
 *  2. Kiểm tra bảng LarkBase đã tồn tại chưa
 *      - Nếu chưa: tự tạo bảng với đầy đủ field theo fieldMap/typeMap/uiType
 *  3. Query dữ liệu trên Lark trong khoảng ngày yêu cầu (`filterFieldName`)
 *  4. So sánh hash để biết bản ghi nào cần tạo mới hoặc cập nhật
 *  5. Gửi batch create / batch update lên LarkBase
 *
 * Lưu ý quan trọng:
 *  - `startDate` và `endDate` đã được ép sang timestamp từ trước
 *  - Nếu truyền `selectFn`, hàm đó phải tự xử lý convert timestamp -> loại dữ liệu cần thiết
 *
 * @async
 * @function syncDataToLarkBaseFilterDate
 *
 * @param {Object} client - Lark API client
 * @param {string} baseId - Lark Base ID
 *
 * @param {Object} options - Bộ config cho đồng bộ
 * @param {string} options.tableName - Tên bảng LarkBase để sync vào
 * @param {Function} [options.selectFn] - Hàm lấy dữ liệu nếu không dùng `records`
 *        - Prototype: (startDateTimestamp, endDateTimestamp) => Array
 * @param {Array<Object>} [options.records=null] - Dữ liệu đã có sẵn để đồng bộ
 * @param {Object} options.fieldMap - Map field key → tên field Lark
 * @param {Object} options.typeMap - Map field key → type trên Lark
 * @param {Object} options.uiType - Map field key → UI type của Lark
 * @param {string} [options.currencyCode="VND"] - Mã tiền dùng cho cột dạng tiền tệ
 * @param {string} [options.idLabel="ID định danh (TTS)"] - Tên cột ID trong Lark để extract hash
 *
 * @param {string} filterFieldName - Tên cột trong Lark dùng để filter theo ngày
 * @param {number} startDate - Timestamp bắt đầu (phải là milliseconds)
 * @param {number} endDate - Timestamp kết thúc (phải là milliseconds)
 *
 * @returns {Promise<void>}
 *
 * @example
 * await syncDataToLarkBaseFilterDate(
 *   larkClient,
 *   "Fg8lbase6123",
 *   {
 *     tableName: "Finance Transaction",
 *     records: formattedTx,
 *     fieldMap: TRANSACTION_FIELD_MAP,
 *     typeMap: TRANSACTION_TYPE_MAP,
 *     uiType: TRANSACTION_UI_TYPE_MAP,
 *     currencyCode: "VND"
 *   },
 *   "Ngày tạo",
 *   timestampFrom,
 *   timestampTo
 * );
 *
 * @example
 * // Dùng selectFn thay vì truyền records
 * await syncDataToLarkBaseFilterDate(
 *   larkClient,
 *   baseId,
 *   {
 *     tableName: "Orders",
 *     selectFn: selectOrdersFromSupabase,
 *     fieldMap: ORDER_FIELD_MAP,
 *     typeMap: ORDER_TYPE_MAP,
 *     uiType: ORDER_UI_TYPE_MAP
 *   },
 *   "create_time",
 *   tsStart,
 *   tsEnd
 * );
 */

export async function syncDataToLarkBaseFilterDate(
  client,
  baseId,
  {
    tableName,
    selectFn,
    records = null,
    fieldMap,
    typeMap,
    uiType,
    currencyCode = "VND",
    idLabel = "ID định danh (TTS)",
  },
  filterFieldName,
  startDate,
  endDate
) {
  console.log(`=== Đồng bộ dữ liệu lên LarkBase: ${tableName} ===`);

  // Lấy dữ liệu (ưu tiên records truyền vào)
  const sourceRecords = records
    ? records
    : await selectFn?.(startDate, endDate);

  const data = sourceRecords || [];
  console.log(`Tổng số bản ghi cần đồng bộ: ${data.length}`);

  if (!data.length) {
    console.warn("Không có dữ liệu để đồng bộ!");
    return;
  }

  // Chuẩn bị dữ liệu diff
  const newDataForDiff = data.map((r) => ({
    id: String(r.id),
    hash: r.hash,
  }));

  // Kiểm tra / tạo bảng
  const listTb = await larkbaseService.getListTable(client, baseId);
  const table = listTb?.data?.items?.find((t) => t.name === tableName);
  let tableId;

  if (table) {
    console.log(`[LARK] Bảng '${tableName}' đã tồn tại.`);
    tableId = table.table_id;
  } else {
    console.log(`[LARK] Tạo bảng '${tableName}' mới...`);
    // const fields = Object.entries(fieldMap).map(([key, label]) => ({
    //   field_name: label,
    //   type: typeMap[key] || 1,
    // }));

    const fields = Object.entries(fieldMap).map(([key, label]) =>
      utils.buildField(key, label, typeMap[key], uiType[key], currencyCode)
    );

    tableId = await larkbaseService.ensureLarkBaseTable(
      client,
      baseId,
      tableName,
      fields
    );
  }
  console.log(tableId);

  // Lấy dữ liệu hiện có trên Lark
  const existingRecords = await larkbaseService.searchLarkRecordsFilterDate(
    client,
    baseId,
    tableId,
    1000,
    filterFieldName,
    startDate,
    endDate
  );
  console.log(
    `[LARK] Đã lấy ${existingRecords.length} bản ghi hiện có từ LarkBase.`
  );

  const simplifiedRecords = utils
    .extractLarkIdHash(existingRecords, idLabel)
    .map((r) => ({
      ...r,
      id: String(r.id),
    }));

  // Diff dữ liệu
  const { toUpsert } = utils.diffRecords(
    newDataForDiff,
    simplifiedRecords,
    "id",
    "hash",
    tableName
  );

  const larkIdMap = Object.fromEntries(
    simplifiedRecords.map((r) => [String(r.id), r.record_id])
  );

  // Chuẩn bị create / update
  const toCreate = data
    .filter(
      (r) =>
        toUpsert.some((u) => String(u.id) === String(r.id)) &&
        !larkIdMap[String(r.id)]
    )
    .map((r) => utils.mapFieldsToLark(r, fieldMap, typeMap));

  const toUpdate = data
    .filter(
      (r) =>
        toUpsert.some((u) => String(u.id) === String(r.id)) &&
        larkIdMap[String(r.id)]
    )
    .map((r) => ({
      record_id: larkIdMap[String(r.id)],
      fields: utils.mapFieldsToLark(r, fieldMap, typeMap).fields,
    }));

  console.log(
    `[LARK] Tạo mới: ${toCreate.length} | Cập nhật: ${toUpdate.length}`
  );

  // Gửi dữ liệu lên Lark
  await Promise.all([
    toCreate.length
      ? larkbaseService.createLarkRecords(client, baseId, tableId, toCreate)
      : Promise.resolve(),
    toUpdate.length
      ? larkbaseService.updateLarkRecords(client, baseId, tableId, toUpdate)
      : Promise.resolve(),
  ]);

  console.log(`[LARK] Hoàn tất đồng bộ '${tableName}'`);
}
