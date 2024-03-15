// src/routes/index.ts

import { Router, Express, NextFunction, Request, Response } from "express"
import { constant } from "../constant"
import { Knex } from "knex"
import { Resp } from "../lib/utils"
import { validateMiddleWare } from "../configuration"
import { initUserStorage } from "../storage/Account"
import {
  changeUserLevelValidate,
  paginationValidate,
  upsertUserValidate
} from "../validate"

function routes(ctx: Express): Router {
  const r = Router()
  const knex = ctx.get(constant.SIMP_SERVER_STORAGE) as Knex
  const storage = initUserStorage(knex)
  r.get(
    "/getUserList",
    paginationValidate,
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const query = req.query as unknown as Pagination
        const data = await storage.getList(query)
        res.status(200).json(Resp.Ok(data))
      } catch (e) {
        next(e)
      }
    }
  )
  r.post(
    "/saveUser",
    upsertUserValidate,
    validateMiddleWare,
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const body = req.body as unknown as UserDto
        const data = await storage.saveUser(body)
        res.status(200).json(Resp.Ok(data))
      } catch (e) {
        next(e)
      }
    }
  )
  r.post(
    "/changeUserLevel",
    changeUserLevelValidate,
    validateMiddleWare,
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const body = req.body as unknown as UserDto
        const data = await storage.changeLevel(body)
        res.status(200).json(Resp.Ok(data))
      } catch (e) {
        next(e)
      }
    }
  )
  return r
}

export default routes
