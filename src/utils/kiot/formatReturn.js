import { generateHash } from "../common/generateHash.js";
import { kiotDateToVN } from "../common/timeHelper.js";

export function formartReturns(returns = []) {
  return returns.map((item) => {
    const base = {
      id: item?.id ?? "",
      code: item?.code ?? "",
      invoice_id: item?.invoiceId ?? "",
      created_date: kiotDateToVN(item?.createdDate) ?? "",
      return_date: kiotDateToVN(item?.returnDate) ?? "",
      branch_id: item?.branchId ?? "",
      branch_name: item?.branchName ?? "",
      received_by_id: item?.receivedById ?? "",
      sold_by_name: item?.soldByName ?? "",
      customer_id: item?.customerId ?? "",
      customer_code: item?.customerCode ?? "",
      customer_name: item?.customerName ?? "",
      return_total: item?.returnTotal ?? 0,
      total_payment: item?.totalPayment ?? 0,
      status_value: item?.statusValue ?? "",
      description: item?.description ?? "",
    };

    return {
      ...base,
      hash: generateHash(base),
    };
  });
}

export function formartReturnDetails(returns = []) {
  const returnDetails = returns?.returnDetails ?? [];

  return returnDetails.map((detail) => {
    const base = {
      id: `${returns?.id}_${detail?.productId}`,
      code: returns?.code ?? "",
      invoice_id: returns?.invoiceId ?? "",
      created_date: kiotDateToVN(returns?.createdDate) ?? "",
      return_date: kiotDateToVN(returns?.returnDate) ?? "",
      status_value: returns?.statusValue ?? "",

      product_code: detail?.productCode ?? "",
      product_name: detail?.productName ?? "",
      quantity: detail?.quantity ?? 0,
      price: detail?.price ?? 0,
      sub_total: detail?.subTotal ?? 0,

      branch_id: returns?.branchId ?? "",
      branch_name: returns?.branchName ?? "",
      received_by_id: returns?.receivedById ?? "",
      sold_by_name: returns?.soldByName ?? "",
      customer_id: returns?.customerId ?? "",
      customer_code: returns?.customerCode ?? "",
      customer_name: returns?.customerName ?? "",
    };

    return {
      ...base,
      hash: generateHash(base),
    };
  });
}
