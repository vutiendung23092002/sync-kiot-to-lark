import { generateHash } from "../common/generateHash.js";
import { kiotDateToVN } from "../common/timeHelper.js";

export function formartSuppliers(suppliers = []) {
  return suppliers.map((item) => {
    const base = {
      id: item?.id ?? "",
      code: item?.code ?? "",
      createdDate: kiotDateToVN(item?.createdDate) ?? "",
      name: item?.name ?? "",
      retailerId: item?.retailerId ?? "",
      branchId: item?.branchId ?? "",
      contactNumber: item?.contactNumber ?? "",
      address: item?.address ?? "",
      totalInvoiced: item?.totalInvoiced ?? 0,
      totalInvoicedWithoutReturn: item?.totalInvoicedWithoutReturn ?? 0,
      debt: item?.debt ?? 0,
      createdBy: item?.createdBy ?? "",
      isActive: item?.isActive ?? false,
    };

    return {
      ...base,
      hash: generateHash(base),
    };
  });
}
