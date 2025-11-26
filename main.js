import * as kiotApi from "./src/core/kiot_api.js";
import { env } from "./src/config/env.js";

async function main() {
  const res = await kiotApi.getAccessToken(
    env.KIOT.KIOTVIET_CLIENT_ID,
    env.KIOT.KIOTVIET_CLIENT_SECRET
  );

  console.log(res);
}

main()