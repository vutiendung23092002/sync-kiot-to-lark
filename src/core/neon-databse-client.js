import { neon } from "@neondatabase/serverless";
import { env } from "../config/env.js";

export const sql_neon = neon(env.NEONDB.DATABASE_URL);