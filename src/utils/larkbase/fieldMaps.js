
export const INVOICE_FIELD_MAP = {
  id: "ID hoá đơn", // ID hoá đơn
  create_date: "Ngày tạo hoá đơn", // Ngày tạo hoá đơn
  code: "Mã hoá đơn", // Mã hoá đơn
  order_code: "Mã đơn hàng", // Mã đơn hàng

  payments_code: "Mã phiếu thu", // Mã thanh toán || Mã phiếu thu
  payments_id: "ID phiếu thu", // ID thanh toán || ID phiếu thu
  status_payments: "Trạng thái thanh toán",
  payment_amount: "Khách hàng thanh toán",
  payments_method: "Phương thức thanh toán",

  branch_id: "ID brand",
  sold_by_id: "ID nhân viên",
  sold_by_name: "Nhân viên",
  customer_code: "Mã khách hàng",
  customer_name: "Tên khách hàng",

  total_payment: "Tổng tiền thanh toán",
  total: "Tổng tiền",

  sur_value: "Phụ thu",

  status_value: "Trạng thái đơn hàng",
  partner_delivery_name: "Đơn vị vận chuyển",
  invoice_delivery_code: "Mã đơn GHN",
  cod: "COD",
  products_of_order: "Chi tiết đơn hàng",
  description: "Ghi chú",
  hash: "hash",
};

export const INVOICE_TYPE_MAP = {
  id: 1,
  create_date: 5,
  code: 1,
  order_code: 1,

  payments_code: 1,
  payments_id: 1,
  status_payments: 1,
  payment_amount: 2,
  payments_method: 1,

  branch_id: 1,
  sold_by_id: 1,
  sold_by_name: 1,
  customer_code: 1,
  customer_name: 1,

  total_payment: 2,
  total: 2,

  sur_value: 2,

  status_value: 1,
  partner_delivery_name: 1,
  invoice_delivery_code: 1,
  cod: 1,
  products_of_order: 1,
  description: 1,
  hash: 1,
};

export const INVOICE_UI_TYPE_MAP = {
  id: "Text",
  create_date: "DateTime",
  code: "Text",
  order_code: "Text",

  payments_code: "Text",
  payments_id: "Text",
  status_payments: "Text",
  payment_amount: "Currency",
  payments_method: "Text",

  branch_id: "Text",
  sold_by_id: "Text",
  sold_by_name: "Text",
  customer_code: "Text",
  customer_name: "Text",

  total_payment: "Currency",
  total: "Currency",

  sur_value: "Currency",

  status_value: "Text",
  partner_delivery_name: "Text",
  invoice_delivery_code: "Text",
  cod: "Text",
  products_of_order: "Text",
  description: "Text",
  hash: "Text",
};

