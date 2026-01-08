import { generateHash } from "../common/generateHash.js";
import { kiotDateToVN } from "../common/timeHelper.js";

const PARTNER_TYPE_MAP = {
  A: "Tất cả",
  C: "Khách hàng",
  S: "Nhà cung cấp",
  U: "Nhân viên",
  D: "Đối tác giao hàng",
  O: "Khác",
};

export function formartCashflow(cashflows = []) {
  return cashflows.map((item) => {
    const base = {
      id: item?.id ?? "",
      create_date: kiotDateToVN(item?.transDate) ?? "",
      code: item?.code ?? "",
      branch_id: item?.branchId ?? "",
      user_created: item?.user ?? "",
      amount: item?.amount ?? 0,
      status_value: item?.statusValue ?? "",
      created_by_id: item?.createdBy ?? "",
      cash_group_name: item?.cashGroup ?? "",
      description: item?.description ?? "",
      method: item?.method ?? "",
      partner_type: PARTNER_TYPE_MAP[item?.partnerType] ?? "Không xác định",
      cashflow_group_id: item?.cashFlowGroupId ?? "",
      used_for_financial_reporting:
        item?.usedForFinancialReporting == 1
          ? "Có hạch toán"
          : "Không hạch toán" ?? "",
      partner_name: item?.partnerName ?? "",
      retailer_id: item?.retailerId ?? "",
    };

    return {
      ...base,
      hash: generateHash(base),
    };
  });
}
