import { body, check, query } from "express-validator"
import { Now } from "sgridnode/build/main"

export const paginationValidate = [
  query("offset").default(0).isInt(),
  query("size").default(10).isInt(),
  query("keyword").default("").isString().ltrim().rtrim()
]

export const saveEventValidate = [
  body("createTime").default(Now()).isISO8601(),
  body("endTime").default(Now()).isISO8601(),
  body("startTime").default(Now()).isISO8601(),
  body("title").isString().ltrim().rtrim().isLength({ max: 10, min: 3 }),
  body("content").isString().isLength({ max: 512 }),
  body("createbyUserId").default(0).isInt(),
  body("targetUserId").default(0).isInt()
]

export const changeStatusValidate = [
  check("id").isInt(),
  check("status").isInt()
]

export const upsertUserValidate = [
  body("id").default(0).isInt(),
  body("status").default(0).isInt(),
  body("userName").isString().trim(),
  body("createTime").default(Now()).isISO8601(),
  body("password").isString()
]

export const changeUserLevelValidate = [
  check("id").isInt(),
  check("level").isInt()
]
