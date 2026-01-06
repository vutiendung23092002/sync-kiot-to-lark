import dotenv from "dotenv";
dotenv.config();

/**
 * Tập hợp toàn bộ biến môi trường cấu hình cho hệ thống:
 * - TikTok Shop (Partner API)
 * - TikTok Ads API
 * - Lark Base
 * - KiotViet
 * - Database
 *
 * Các giá trị được load từ file .env thông qua dotenv.
 *
 * @typedef {Object} EnvConfig
 * @property {KiotVietEnv} KIOTVIET - Config KiotViet
 */

/**
 * Cấu hình môi trường hệ thống, load từ file .env
 * @type {EnvConfig}
 */
export const env = {
  // KiotViet
  KIOT: {
    KIOTVIET_RETAILER: process.env.KIOTVIET_RETAILER,
    KIOTVIET_CLIENT_ID: process.env.KIOT_CLIENT_ID,
    KIOTVIET_CLIENT_SECRET: process.env.KIOT_SECRET,
  },

  SUPABASE: {
    SERVICE_KEY: process.env.DATABASE_SERVICE_KEY,
  },

  LARK: {
    APP_ID: process.env.LARK_APP_ID,
    APP_SECRET: process.env.LARK_APP_SECRET,
    BASE_ID: process.env.LARK_BASE_ID,
    TABLE_PRODUCT_NAME: process.env.LARK_TABLE_PRODUCT_NAME,
    TABLE_INVOICES_NAME: process.env.LARK_TABLE_INVOICE_NAME,
    TABLE_INVOICES_DETAIL_NAME: process.env.LARK_TABLE_INVOICE_DETAIL_NAME,
    LARK_TABLE_INVOICE__FROM: process.env.LARK_TABLE_INVOICE__FROM,
    LARK_TABLE_INVOICE__TO: process.env.LARK_TABLE_INVOICE__TO,
    LARK_TABLE_CUSTOMER_NAME: process.env.LARK_TABLE_CUSTOMER_NAME,
  },

  AES_256_CBC: {
    APP_SECRET_KEY: process.env.AES_256_CBC_APP_SECRET_KEY,
  },
};
