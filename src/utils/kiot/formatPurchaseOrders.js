import { generateHash } from "../common/generateHash.js";
import { kiotDateToVN } from "../common/timeHelper.js";

const PURCHASE_STATUS_MAP = {
  3: "Đã nhập",
  4: "Đã huỷ",
};

function formatPurchaseOrderDetailText(details = []) {
  return details
    .map(
      (d) =>
        `Sku: ${d.productCode} - Số lượng: ${d.quantity} - Đơn giá: ${d.price} - Giảm giá: ${d.discount}`
    )
    .join("; ");
}

function formatPaymentText(payments = []) {
  return payments
    .map(
      (p) =>
        `Mã phiếu chi: ${p.code} - Phương thức: ${p.method} - Trạng thái: ${
          p.statusValue
        } - Ngày thanh toán: ${kiotDateToVN(p.transDate)}`
    )
    .join("; ");
}

export function formartPurchaseOrders(purchaseOrders = []) {
  return purchaseOrders.map((item) => {
    const base = {
      id: item?.id ?? "",
      code: item?.code ?? "",
      createdDate: kiotDateToVN(item?.createdDate) ?? "",
      purchaseDate: kiotDateToVN(item?.purchaseDate) ?? "",
      retailerId: item?.retailerId ?? "",
      branchId: item?.branchId ?? "",
      branchName: item?.branchName ?? "",
      discount: item?.discount ?? 0,
      discountRatio: item?.discountRatio ?? 0,
      purchaseById: item?.purchaseById ?? "",
      purchaseName: item?.purchaseName ?? "",
      status: PURCHASE_STATUS_MAP[item?.status] ?? item?.status ?? "",
      total: item?.total ?? 0,
      totalPayment: item?.totalPayment ?? 0,
      supplierId: item?.supplierId ?? "",
      supplierCode: item?.supplierCode ?? "",
      supplierName: item?.supplierName ?? "",

      purchase_detail_text: formatPurchaseOrderDetailText(
        item?.purchaseOrderDetails
      ),

      payment_detail_text: formatPaymentText(item?.payments),
    };

    return {
      ...base,
      hash: generateHash(base),
    };
  });
}

export function formartPurchaseOrderDetails(purchaseOrders = []) {
  const purchaseOrderDetails = purchaseOrders?.purchaseOrderDetails ?? [];

  return purchaseOrderDetails.map((detail) => {
    const base = {
      id: `${purchaseOrders?.id}_${detail?.productId}`,
      code: purchaseOrders?.code ?? "",
      status: PURCHASE_STATUS_MAP[purchaseOrders?.status] ?? purchaseOrders?.status ?? "",
      createdDate: kiotDateToVN(purchaseOrders?.createdDate) ?? "",
      purchaseById: purchaseOrders?.purchaseById ?? "",
      purchaseName: purchaseOrders?.purchaseName ?? "",
      supplierId: purchaseOrders?.supplierId ?? "",
      supplierCode: purchaseOrders?.supplierCode ?? "",
      supplierName: purchaseOrders?.supplierName ?? "",
      productCode: detail?.productCode ?? "",
      productId: detail?.productId ?? "",
      productName: detail?.productName ?? "",
      price: detail?.price ?? 0,
      quantity: detail?.quantity ?? 0,
      discount: detail?.discount ?? 0,
    };

    return {
      ...base,
      hash: generateHash(base),
    };
  });
}
