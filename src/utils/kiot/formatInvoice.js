import { generateHash } from "../common/generateHash.js";

export function formatInvoice(invoice) {
  const payments = invoice?.payments || [];
  const surcharges = invoice?.invoiceOrderSurcharges || [];
  const delivery = invoice?.invoiceDelivery || {};
  const partner = delivery?.partnerDelivery || {};
  const invoiceDetails = invoice?.invoiceDetails || [];

  const formatted = {
    id: invoice?.id || "", // ID hoá đơn
    create_date: invoice?.createdDate || "", // Ngày tạo hoá đơn
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

    status_value: invoice?.statusValue || "", // Trạng thái đơn hàng
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
