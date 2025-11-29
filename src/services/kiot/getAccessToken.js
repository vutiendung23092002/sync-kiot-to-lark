import * as kiotApi from "../../core/kiot_api.js";
import { env } from "../../config/env.js";
import { supabase } from "../../core/supabase-client.js";
import { encrypt, decrypt } from "../../utils/common/AES-256-CBC.js";

export async function getAccessTokenEnvCloud() {
  const res = await kiotApi.getAccessToken(
    env.KIOT.KIOTVIET_CLIENT_ID,
    env.KIOT.KIOTVIET_CLIENT_SECRET
  );

  const { data, error } = await supabase
    .from("envCloud")
    .upsert(
      {
        id: 1,
        web: "kiot",
        app_name: "kiot_legiahankorea",
          access_token: encrypt(res?.access_token || ""),
          token_type: res?.token_type || "",
          access_token_expire_in: res?.access_token_expire_in || "",
          refresh_token: encrypt(res?.refresh_token || ""),
          refresh_token_expire_in: res?.refresh_token_expire_in || "",
      },
      { onConflict: "id" }
    )
    .select()
    .eq("id", 1)
    .single();

  return decrypt(data.access_token);
}
