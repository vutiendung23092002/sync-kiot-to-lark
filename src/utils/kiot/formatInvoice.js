import { generateHash } from "../common/generateHash.js";
import { kiotDateToVN } from "../common/timeHelper.js"

export function formatInvoice(invoice) {
  const payments = invoice?.payments || [];
  const surcharges = invoice?.invoiceOrderSurcharges || [];
  const delivery = invoice?.invoiceDelivery || {};
  const partner = delivery?.partnerDelivery || {};
  const invoiceDetails = invoice?.invoiceDetails || [];

  const formatted = {
    id: invoice?.id || "", // ID hoá đơn
    create_date: invoice?.createdDate || "", // Ngày tạo hoá đơn
    purchase_date: invoice?.purchaseDate || "",
    code: invoice?.code || "", // Mã hoá đơn
    order_code: invoice?.orderCode || "", // Mã đơn hàng

    payments_code: payments.map((p) => p.code).join(", "), // Mã thanh toán || Mã phiếu thu
    payments_id: payments.map((p) => p.id).join(", "), // ID thanh toán || ID phiếu thu
    status_payments: payments.map((p) => p.statusValue).join(", "), // Trạng thái thanh toán
    payment_amount: payments.reduce((s, p) => s + (p.amount || 0), 0), // Khách hàng thanh toán
    payments_method: payments.map((p) => p.method).join(", "), // Phương thức thanh toán

    branch_id: invoice?.branchId || "", // ID brand
    sold_by_id: invoice?.soldById || "", // ID nhân viên
    sold_by_name: invoice?.soldByName || "", // Nhân viên
    customer_code: invoice?.customerCode || "", // Mã khách hàng
    customer_name: invoice?.customerName || "", // Tên khách hàng

    total_payment: invoice?.totalPayment || 0, // Tổng tiền thanh toán
    total: invoice?.total || 0, // Tổng tiền

    sur_value: surcharges.reduce((s, x) => s + (x.surValue || 0), 0), // Phụ thu

    status_value: invoice?.statusValue || "", // Trạng thái hoá đơn
    partner_delivery_name: partner?.name || "", // Đơn vị vận chuyển
    invoice_delivery_code: delivery?.deliveryCode || "", // Mã đơn GHN
    cod: invoice?.usingCod || "", // COD

    products_of_order: invoiceDetails
      .map((o) => `${o.productId} - ${o.productCode} - ${o.productName}`)
      .join(" | "), // "Chi tiết đơn hàng"

    description: invoice?.description || "", // Ghi chú
  };

  const hash = generateHash(formatted);
  return { ...formatted, hash };
}

export function formatInvoiceDetail(invoice, productCostMap) {
  const invoiceDetails = invoice?.invoiceDetails || [];

  return invoiceDetails.map((item) => {
    const base = {
      id: item?.id,
      order_id: invoice?.orderId || "",
      order_code: invoice?.orderCode || "",
      invoice_id: invoice?.id || "",
      invoice_code: invoice?.code || "",
      purchase_date: invoice?.purchaseDate || "",
      create_date: invoice?.createdDate || "",
      status_value: invoice?.statusValue || "",
      sold_by_name: invoice?.soldByName || "",
      customer_code: invoice?.customerCode || "",
      customer_name: invoice?.customerName || "",
      product_id: item?.productId || "",
      product_code: item?.productCode || "",
      product_name: item?.productName || "",
      category_name: item?.categoryName || "",
      quantity: item?.quantity || 0,
      price: item?.price || 0,
      discount: item?.discount || 0,
      discount_ratio: item?.discountRatio || 0,
      sub_total: item?.subTotal || 0,
      note: invoice?.description || "",
      serial_numbers: item?.serialNumbers || "",
      return_quantity: item?.returnQuantity || 0,
    };

    // cost từ product
    const cost = productCostMap[item.productCode] ?? null;

    return {
      ...base,
      cost_snapshot: cost, // chỉ để sync, còn overwrite hay không do Lark quyết
      hash: generateHash(base),
    };
  });
}
