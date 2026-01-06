export const PRODUCT_FIELD_MAP = {
  id: "Id",
  code: "Mã sản phẩm",
  name: "Sản phẩm",
  full_name: "Tên đầy đủ",
  category_name: "Tên danh mục",
  base_price: "Giá chung",
  inventories_cost: "Giá vốn",
  inventories_onHand: "Tồn kho",
  dealer_price: "Giá đại lý",
  distribution_price: "Giá phân phối",
  facebook_price: "Giá Facebook",
  tmdt_price: "Giá sàn TMĐT",
  ctv_price: "Giá CTV",
  is_active: "Đang bán",
  has_variants: "Có biến thể",
  hash: "hash",
};

export const PRODUCT_TYPE_MAP = {
  id: 2,
  code: 1,
  name: 1,
  full_name: 1,
  category_name: 1,
  base_price: 2,
  inventories_cost: 2,
  inventories_onHand: 2,
  dealer_price: 2,
  distribution_price: 2,
  facebook_price: 2,
  tmdt_price: 2,
  ctv_price: 2,
  is_active: 1,
  has_variants: 1,
  hash: 1,
};

export const PRODUCT_UI_TYPE_MAP = {
  id: "Number",
  code: "Text",
  name: "Text",
  full_name: "Text",
  category_name: "Text",
  base_price: "Currency",
  inventories_cost: "Currency",
  inventories_onHand: "Currency",
  dealer_price: "Currency",
  distribution_price: "Currency",
  facebook_price: "Currency",
  tmdt_price: "Currency",
  ctv_price: "Currency",
  is_active: "Text",
  has_variants: "Text",
  hash: "Text",
};

export const INVOICE_FIELD_MAP = {
  purchase_date: "Ngày thanh toán",
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

  status_value: "Trạng thái hoá đơn",
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
  purchase_date: 5,
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
  purchase_date: "DateTime",
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

export const INVOICE_DETAIL_FIELD_MAP = {
  purchase_date: "Ngày thanh toán",
  id: "ID",
  order_id: "Order_ID",
  order_code: "Mã đơn hàng",
  invoice_id: "ID đơn hàng",
  invoice_code: "Mã hoá đơn",
  create_date: "Ngày tạo",
  status_value: "Trạng thái hoá đơn",
  sold_by_name: "Nhân viên",
  customer_code: "Mã khách hàng",
  customer_name: "Tên khách hàng",
  product_id: "Product ID",
  product_code: "Mã sản phẩm",
  product_name: "Tên sản phẩm",
  category_name: "Danh mục",
  cost_snapshot: "Giá vốn",
  quantity: "Số lượng",
  price: "Đơn giá",
  discount: "Giảm giá",
  discount_ratio: "Giảm giá theo %",
  sub_total: "Tổng giá trị",
  note: "Ghi chú",
  serial_numbers: "IMEI",
  return_quantity: "Số lượng hoàn",
  hash: "hash",
};

export const INVOICE_DETAIL_TYPE_MAP = {
  id: 1,
  order_id: 1,
  order_code: 1,
  invoice_id: 1,
  invoice_code: 1,
  purchase_date: 5,
  create_date: 5,
  status_value: 1,
  sold_by_name: 1,
  cost_snapshot: 2,
  customer_code: 1,
  customer_name: 1,
  product_id: 1,
  product_code: 1,
  product_name: 1,
  category_name: 1,
  quantity: 2,
  price: 2,
  discount: 2,
  discount_ratio: 2,
  sub_total: 2,
  note: 1,
  serial_numbers: 1,
  return_quantity: 2,
  hash: 1,
};

export const INVOICE_DETAIL_UI_TYPE_MAP = {
  id: "Text",
  order_id: "Text",
  order_code: "Text",
  invoice_id: "Text",
  invoice_code: "Text",
  purchase_date: "DateTime",
  create_date: "DateTime",
  status_value: "Text",
  sold_by_name: "Text",
  customer_code: "Text",
  customer_name: "Text",
  product_id: "Text",
  product_code: "Text",
  product_name: "Text",
  category_name: "Text",
  quantity: "Number",
  price: "Currency",
  discount: "Currency",
  discount_ratio: "Currency",
  sub_total: "Currency",
  note: "Text",
  serial_numbers: "Text",
  return_quantity: "Number",
  cost_snapshot: "Currency",
  hash: "Text",
};
