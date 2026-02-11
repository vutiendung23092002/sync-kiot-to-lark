import { env } from "../../config/env.js";
import { supabase } from "../../core/supabase-client.js";
import { getAccessToken } from "../../core/kiot-api.js";
import { encrypt, decrypt } from "../../utils/index.js";
import { sql_neon } from "../../core/neon-databse-client.js";

export async function getAccessTokenEnvCloud() {
  // const res = await getAccessToken(
  //   env.KIOT.KIOTVIET_CLIENT_ID,
  //   env.KIOT.KIOTVIET_CLIENT_SECRET
  // );

  // const { data, error } = await supabase
  //   .from("envCloud")
  
  //   .upsert(
  //     {
  //       id: 1,
  //       web: "kiot",
  //       app_name: "kiot_legiahankorea",
  //       access_token: encrypt(res?.access_token || ""),
  //       token_type: res?.token_type || "",
  //       access_token_expire_in: res?.access_token_expire_in || "",
  //       refresh_token: encrypt(res?.refresh_token || ""),
  //       refresh_token_expire_in: res?.refresh_token_expire_in || "",
  //     },
  //     { onConflict: "id" }
  //   )
  //   .select()
  //   .eq("id", 1)
  //   .single();

  // return decrypt(data.access_token);
  const app_id = env.KIOT.KIOTVIET_CLIENT_ID;
  const rows = await sql_neon`
    SELECT access_token, access_token_expire_at
    FROM token
    WHERE app_id = ${app_id}
    LIMIT 1
  `;

  if (!rows.length) {
    throw new Error("Kiot token not found in Neon DB");
  }

  return rows[0].access_token;
}
