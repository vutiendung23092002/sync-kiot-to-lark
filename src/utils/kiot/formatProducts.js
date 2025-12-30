import { generateHash } from "../common/generateHash.js";

function getPriceByBookName(priceBooks = [], name) {
  return (
    priceBooks.find((p) => p.priceBookName === name && p.isActive)?.price ?? ""
  );
}

export function formartProducts(products = []) {
  return products.map((item) => {
    const priceBooks = item?.priceBooks ?? [];
    const inventories = item?.inventories?.[0] ?? {};

    const base = {
      id: item?.id ?? "",
      code: item?.code ?? "",
      name: item?.name ?? "",
      full_name: item?.fullName ?? "",
      category_name: item?.categoryName ?? "",
      base_price: item?.basePrice ?? "",

      inventories_cost: inventories?.cost ?? "",
      inventories_onHand: inventories?.onHand ?? "",

      dealer_price: getPriceByBookName(priceBooks, "Đại Lý"),
      distribution_price: getPriceByBookName(priceBooks, "Phân Phối"),
      facebook_price: getPriceByBookName(priceBooks, "Giá FB"),
      tmdt_price: getPriceByBookName(priceBooks, "Giá sàn TMDT"),

      is_active: item?.isActive == true ? "Đang bán" : "Ngừng bán",
      has_variants: item?.hasVariants == true ? "Có" : "Không",
    };

    return {
      ...base,
      hash: generateHash(base),
    };
  });
}
