import { fetchAllProducts } from "./src/services/kiot/fetchAllProducts.js";
import * as serviceKiot from "./src/services/kiot/index.js";
import * as utils from "./src/utils/index.js";

async function main() {
  const accessTokenKiot = await serviceKiot.getAccessTokenEnvCloud();

  const products = await fetchAllProducts(accessTokenKiot, {
    includeInventory: true,
  });

  const productCostMap = {};
  for (const p of products) {
    if (p.code && p.inventories?.length > 0) {
      // Kiot có thể có nhiều chi nhánh → lấy cost chi nhánh chính (hoặc chi nhánh đầu)
      const inv = p.inventories[0];
      productCostMap[p.code] = inv.cost ?? 0;
    }
  }

  utils.writeJsonFile("./src/data/testProduct.json", products);
  utils.writeJsonFile("./src/data/testProductCost.json", productCostMap);
}

main();
