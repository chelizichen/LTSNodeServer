// src/routes/index.ts

import { Router, Express, NextFunction, Request, Response } from "express"
import { constant } from "../constant"
import { Knex } from "knex"
import { initEventStorage } from "../storage/EffectiveEvent"
import { Resp } from "../lib/utils"
import {
  changeStatusValidate,
  saveEventValidate,
  paginationValidate
} from "../validate"
import { validateMiddleWare } from "../configuration"

function routes(ctx: Express): Router {
  const r = Router()
  const knex = ctx.get(constant.SIMP_SERVER_STORAGE) as Knex
  const storage = initEventStorage(knex)

  r.get(
    "/getEvents",
    paginationValidate,
    function (req: Request, res: Response, next: NextFunction) {
      try {
        const query: Pagination = req.query
        storage
          .queryEvents(query)
          .then((resp) => {
            return res.status(200).json(Resp.Ok(resp))
          })
          .catch((e) => {
            console.log("e", e)
            return res.status(403).json(Resp.Error(-1, "getEvents", e))
          })
      } catch (e) {
        next(e)
      }
    }
  )

  r.post(
    "/saveEvent",
    saveEventValidate,
    validateMiddleWare,
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const body: EffectiveEventsDto = req.body
        storage
          .saveEvent(body)
          .then((resp) => {
            return res.status(200).json(Resp.Ok(resp))
          })
          .catch((e) => {
            return res.status(403).json(Resp.Error(-1, "saveError", e))
          })
      } catch (e) {
        next(e)
      }
    }
  )

  r.post(
    "/changeStatus",
    changeStatusValidate,
    validateMiddleWare,
    async function (req: Request, res: Response, next: NextFunction) {
      try {
        const body: Pick<EffectiveEventsDto, "id" | "status"> = req.body
        const resp = await storage.changeStatus(body)
        res.status(200).json(Resp.Ok(resp))
      } catch (e) {
        next(e)
      }
    }
  )

  return r
}

export default routes
