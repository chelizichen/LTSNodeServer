import { body, check, query } from "express-validator"
import { Now } from "../lib/utils"

export const paginationValidate = [
  query("offset").default(0).isInt(),
  query("size").default(10).isInt(),
  query("keyword").default("").isString().ltrim().rtrim()
]

export const saveEventValidate = [
  body("create_time").default(Now()).isISO8601(),
  body("end_time").default(Now()).isISO8601(),
  body("start_time").default(Now()).isISO8601(),
  body("title").isString().ltrim().rtrim().isLength({ max: 10, min: 3 }),
  body("content").isString().isLength({ max: 512 }),
  body("createby_user_id").default(0).isInt(),
  body("target_user_id").default(0).isInt()
]

export const changeStatusValidate = [
  check("id").isInt(),
  check("status").isInt()
]
