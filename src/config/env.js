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
};
