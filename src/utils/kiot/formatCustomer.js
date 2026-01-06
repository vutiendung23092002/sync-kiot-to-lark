import { generateHash } from "../common/generateHash.js";

export function formartCustomer(customers = []) {
  return customers.map((item) => {
    const base = {
      id: item?.id ?? "",
      code: item?.code ?? "",
      name: item?.name ?? "",
      organization: item?.organization ?? "",
      phone_number: item?.contactNumber ?? "",
      sub_phone: item?.subNumber ?? "",
      address: item?.address ?? "",
      retailer_id: item?.retailerId ?? "",
      branch_id: item?.branchId ?? "",
      modified_date: item?.modifiedDate ?? "",
      created_date: item?.createdDate ?? "",
      type: item?.type == 0 ? "Cá nhân" : "Công ty" ?? "",
      debt: item?.debt ?? 0,
      total_invoiced: item?.totalInvoiced ?? 0,
      total_revenue: item?.totalRevenue ?? 0,
      total_point: item?.totalPoint ?? 0,
      reward_point: item?.rewardPoint ?? 0,
      comments: item?.comments ?? "",
    };

    return {
      ...base,
      hash: generateHash(base),
    };
  });
}
